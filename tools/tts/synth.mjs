#!/usr/bin/env node
/**
 * ElevenLabs TTS for episode narration.
 *
 * Reads voice/lines.json, writes one mp3 per line into voice/out/, and a
 * manifest with real measured durations - which is what timing.ts needs to
 * stop being placeholders.
 *
 * CACHING IS THE POINT. Each line is hashed by (text + voiceId + settings +
 * model). Unchanged lines are skipped. Credits are finite and the script gets
 * rewritten often; re-synthesising 33 lines on every run would be expensive
 * and slow.
 *
 * Usage:
 *   node tools/tts/synth.mjs ep01-nobody-has-seen-it
 *   node tools/tts/synth.mjs ep01-nobody-has-seen-it --only=o01,s02
 *   node tools/tts/synth.mjs ep01-nobody-has-seen-it --force
 *   node tools/tts/synth.mjs ep01-nobody-has-seen-it --dry-run
 *
 * Needs ELEVENLABS_API_KEY in the environment or in .env at the repo root.
 */

import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");

const API = "https://api.elevenlabs.io/v1";

/**
 * eleven_v3 - supports Russian and, critically, AUDIO TAGS: bracketed delivery
 * direction like [flatly], [sigh], [resigned tone] that is consumed as
 * direction rather than spoken.
 *
 * This is what makes the script's production notes machine-actionable. "Deliver
 * the 2019 line completely flat" stops being a note to a human and becomes
 * [flatly] in the text. Verified working on Russian - see docs/VOICE.md.
 *
 * Fallback if v3 misbehaves: eleven_multilingual_v2 (no tag support - strip
 * tags first, or they WILL be read aloud).
 */
const DEFAULT_MODEL = "eleven_v3";

/**
 * Load .env and normalise the key name.
 *
 * Accepts any reasonable spelling of the ElevenLabs key (ELEVENLABS_API_KEY,
 * elevenlab_api_key, ELEVEN_LABS_API_KEY, ...) rather than making the human
 * match one exact string. Normalised into ELEVENLABS_API_KEY for the rest of
 * the script.
 */
async function loadEnv() {
  const envPath = path.join(REPO_ROOT, ".env");
  if (!existsSync(envPath)) return;
  const raw = await readFile(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, k, v] = m;
    const value = v.replace(/^["']|["']$/g, "");
    if (!process.env[k]) process.env[k] = value;

    const canon = k.replace(/_/g, "").toLowerCase();
    if (canon.includes("eleven") && canon.includes("key")) {
      if (!process.env.ELEVENLABS_API_KEY) {
        process.env.ELEVENLABS_API_KEY = value;
      }
    }
  }
}

function hashLine(text, voiceId, settings, model) {
  return createHash("sha256")
    .update(JSON.stringify({ text, voiceId, settings, model }))
    .digest("hex")
    .slice(0, 16);
}

/**
 * Duration of an MP3, by summing frame headers.
 *
 * Avoids depending on ffmpeg, which is not installed on this machine. Only
 * handles MPEG-1/2 Layer III, which is what the API returns.
 */
function mp3Duration(buf) {
  const V1_L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
  const V2_L3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
  const RATES = {
    3: [44100, 48000, 32000],
    2: [22050, 24000, 16000],
    0: [11025, 12000, 8000],
  };

  let i = 0;
  let seconds = 0;
  let frames = 0;

  // Skip ID3v2 if present.
  if (buf.length > 10 && buf.toString("ascii", 0, 3) === "ID3") {
    const size =
      ((buf[6] & 0x7f) << 21) |
      ((buf[7] & 0x7f) << 14) |
      ((buf[8] & 0x7f) << 7) |
      (buf[9] & 0x7f);
    i = 10 + size;
  }

  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff || (buf[i + 1] & 0xe0) !== 0xe0) {
      i++;
      continue;
    }
    const verBits = (buf[i + 1] >> 3) & 0x03;
    const layer = (buf[i + 1] >> 1) & 0x03;
    if (layer !== 0x01) {
      i++;
      continue;
    } // Layer III only
    const brIdx = (buf[i + 2] >> 4) & 0x0f;
    const srIdx = (buf[i + 2] >> 2) & 0x03;
    if (brIdx === 0 || brIdx === 15 || srIdx === 3) {
      i++;
      continue;
    }

    const isV1 = verBits === 3;
    const bitrate = (isV1 ? V1_L3 : V2_L3)[brIdx] * 1000;
    const rates = RATES[verBits] ?? RATES[3];
    const sampleRate = rates[srIdx];
    if (!bitrate || !sampleRate) {
      i++;
      continue;
    }

    const samples = isV1 ? 1152 : 576;
    const padding = (buf[i + 2] >> 1) & 0x01;
    const frameLen = Math.floor((samples / 8) * (bitrate / sampleRate)) + padding;

    seconds += samples / sampleRate;
    frames++;
    i += frameLen > 0 ? frameLen : 1;
  }

  return frames > 0 ? seconds : null;
}

async function synthesize(apiKey, voiceId, text, settings, model) {
  const res = await fetch(`${API}/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: model,
      voice_settings: settings,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ElevenLabs ${res.status}: ${body.slice(0, 400)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await loadEnv();

  const args = process.argv.slice(2);
  const episode = args.find((a) => !a.startsWith("--"));
  const force = args.includes("--force");
  const dryRun = args.includes("--dry-run");
  const onlyArg = args.find((a) => a.startsWith("--only="));
  const only = onlyArg ? onlyArg.slice(7).split(",").map((s) => s.trim()) : null;

  if (!episode) {
    console.error(
      "Usage: node tools/tts/synth.mjs <episode-dir> [--only=id1,id2] [--force] [--dry-run]",
    );
    process.exit(1);
  }

  const epDir = path.join(REPO_ROOT, "episodes", episode);
  const linesPath = path.join(epDir, "voice", "lines.json");
  const outDir = path.join(epDir, "voice", "out");
  const manifestPath = path.join(epDir, "voice", "manifest.json");

  if (!existsSync(linesPath)) {
    console.error(`No lines file at ${linesPath}`);
    process.exit(1);
  }

  const spec = JSON.parse(await readFile(linesPath, "utf8"));
  const model = spec.model ?? DEFAULT_MODEL;

  const missingVoices = Object.entries(spec.speakers)
    .filter(([, s]) => !s.voiceId)
    .map(([k]) => k);

  if (missingVoices.length > 0 && !dryRun) {
    console.error(
      `\nThese speakers have no voiceId yet: ${missingVoices.join(", ")}\n\n` +
        `Pick voices in the ElevenLabs Voice Library (filter by Russian), then paste\n` +
        `their IDs into ${path.relative(REPO_ROOT, linesPath)}.\n\n` +
        `Run with --dry-run to check the line list without synthesising.\n`,
    );
    process.exit(1);
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey && !dryRun) {
    console.error(
      "ELEVENLABS_API_KEY is not set. Put it in .env at the repo root or export it.",
    );
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });

  const previous = existsSync(manifestPath)
    ? JSON.parse(await readFile(manifestPath, "utf8"))
    : { lines: {} };

  const manifest = { model, generatedAt: new Date().toISOString(), lines: {} };
  let synthesised = 0;
  let skipped = 0;
  let totalChars = 0;

  for (const line of spec.lines) {
    if (only && !only.includes(line.id)) {
      const prev = previous.lines[line.id];
      if (prev) manifest.lines[line.id] = prev;
      continue;
    }

    const speaker = spec.speakers[line.speaker];
    if (!speaker) {
      console.error(`  ! ${line.id}: unknown speaker "${line.speaker}"`);
      continue;
    }

    const settings = speaker.settings ?? {};
    const hash = hashLine(line.text, speaker.voiceId, settings, model);
    const file = path.join(outDir, `${line.id}.mp3`);
    const prev = previous.lines[line.id];

    if (dryRun) {
      console.log(`  · ${line.id} [${line.speaker}] ${line.text.length} chars`);
      totalChars += line.text.length;
      continue;
    }

    if (!force && prev?.hash === hash && existsSync(file)) {
      manifest.lines[line.id] = prev;
      skipped++;
      continue;
    }

    process.stdout.write(`  → ${line.id} [${line.speaker}] ... `);
    try {
      const audio = await synthesize(
        apiKey,
        speaker.voiceId,
        line.text,
        settings,
        model,
      );
      await writeFile(file, audio);
      const dur = mp3Duration(audio);
      const info = await stat(file);

      manifest.lines[line.id] = {
        hash,
        speaker: line.speaker,
        act: line.act,
        text: line.text,
        file: path.relative(epDir, file).replace(/\\/g, "/"),
        durationSeconds: dur ? Number(dur.toFixed(3)) : null,
        frames30: dur ? Math.ceil(dur * 30) : null,
        bytes: info.size,
      };
      synthesised++;
      totalChars += line.text.length;
      console.log(dur ? `${dur.toFixed(2)}s` : "ok (duration unknown)");
    } catch (err) {
      console.log("FAILED");
      console.error(`    ${err.message}`);
      if (prev) manifest.lines[line.id] = prev;
    }
  }

  if (dryRun) {
    console.log(
      `\nDry run: ${spec.lines.length} lines, ${totalChars} characters total.`,
    );
    console.log("No API calls made, nothing written.");
    return;
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  const durations = Object.values(manifest.lines)
    .map((l) => l.durationSeconds)
    .filter((d) => typeof d === "number");
  const total = durations.reduce((a, b) => a + b, 0);

  console.log(
    `\n${synthesised} synthesised, ${skipped} cached. ${totalChars} characters billed.`,
  );
  console.log(
    `Narration total: ${total.toFixed(1)}s across ${durations.length} lines.`,
  );
  console.log(`Manifest: ${path.relative(REPO_ROOT, manifestPath)}`);
  console.log(
    `\nNote: narration total excludes the scripted silences, which are the point.\n` +
      `See docs/TODO.md before deriving timing.ts from these numbers.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
