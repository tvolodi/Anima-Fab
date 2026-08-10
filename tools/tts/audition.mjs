#!/usr/bin/env node
/**
 * Voice audition: synthesise the SAME hard line with several candidate voices,
 * so you can listen side by side and pick.
 *
 * Run this BEFORE committing to an ElevenLabs tier. Olga and Sergey carry
 * episode 1, and they are exactly the kind of delivery TTS tends to flatten:
 * Olga must sound competent-but-defensive, Sergey tired-not-angry. If the
 * multilingual model cannot do that in Russian, better to find out now than
 * after an annual subscription.
 *
 * Usage:
 *   node tools/tts/audition.mjs --list
 *   node tools/tts/audition.mjs --role=olga --voices=id1,id2,id3
 *   node tools/tts/audition.mjs --role=sergey --voices=id1,id2 --model=eleven_turbo_v2_5
 *
 * Output goes to voice-auditions/<role>/<voiceId>.mp3
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const API = "https://api.elevenlabs.io/v1";
const DEFAULT_MODEL = "eleven_multilingual_v2";

/**
 * The audition lines are chosen to be HARD, not representative.
 *
 * Each one is a place where a flat TTS read would kill the moment, so a voice
 * that survives these will survive the episode.
 */
const AUDITION = {
  narrator: {
    text: "Чек-лист есть. Его написали в две тысячи девятнадцатом. Человек, который уже уволился.",
    listenFor:
      "Must land completely FLAT. This is the biggest laugh in the episode and it dies if the voice 'performs' it. If it sounds amused, reject.",
    settings: { stability: 0.55, similarity_boost: 0.75, style: 0.0 },
  },
  olga: {
    text: "Опоздаю — штраф на компанию. Ошибусь — штраф на компанию. Не опаздываю и не ошибаюсь.",
    listenFor:
      "Competent and slightly defensive - a person used to being blamed for delays that are not hers. Must NOT sound like a bureaucrat joke or a customer-service robot. The repetition needs to build, not flatten.",
    settings: { stability: 0.62, similarity_boost: 0.8, style: 0.15 },
  },
  sergey: {
    text: "Заявку никто не присылает. Я узнаю, когда он уже стоит у стола.",
    listenFor:
      "Tired, not angry. This has happened to him many times. Resignation, not complaint. If it sounds irritated, the audience sides against him and the act breaks.",
    settings: { stability: 0.42, similarity_boost: 0.75, style: 0.25 },
  },
  director: {
    text: "У нас есть онбординг. Этим занимается отдел кадров. Есть чек-лист.",
    listenFor:
      "Short, slightly too loud, total confidence. Should sound like someone who has never checked.",
    settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3 },
  },
  hire: {
    text: "Простите… а мне куда?",
    listenFor:
      "Genuinely uncertain, NOT comic. This is the emotional close of the episode. If it plays for a laugh, reject.",
    settings: { stability: 0.4, similarity_boost: 0.7, style: 0.2 },
  },
};

/** See synth.mjs - accepts any reasonable spelling of the key name. */
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

async function listVoices(apiKey) {
  const res = await fetch(`${API}/voices`, { headers: { "xi-api-key": apiKey } });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  const data = await res.json();

  console.log(`\n${data.voices.length} voices available:\n`);
  for (const v of data.voices) {
    const labels = Object.entries(v.labels ?? {})
      .map(([k, val]) => `${k}=${val}`)
      .join(" ");
    console.log(`  ${v.voice_id}  ${v.name}`);
    if (labels) console.log(`      ${labels}`);
  }
  console.log(
    `\nFor Russian, prefer voices labelled multilingual or explicitly Russian.\n` +
      `The Voice Library on the website has more than this account list - browse there,\n` +
      `add the ones you like to your account, then re-run --list.\n`,
  );
}

async function main() {
  await loadEnv();
  const args = process.argv.slice(2);
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    console.error(
      "ELEVENLABS_API_KEY is not set. Put it in .env at the repo root:\n" +
        "  ELEVENLABS_API_KEY=sk_...\n",
    );
    process.exit(1);
  }

  if (args.includes("--list")) {
    await listVoices(apiKey);
    return;
  }

  const roleArg = args.find((a) => a.startsWith("--role="));
  const voicesArg = args.find((a) => a.startsWith("--voices="));
  const modelArg = args.find((a) => a.startsWith("--model="));
  const model = modelArg ? modelArg.slice(8) : DEFAULT_MODEL;

  if (!roleArg || !voicesArg) {
    console.error(
      "Usage:\n" +
        "  node tools/tts/audition.mjs --list\n" +
        "  node tools/tts/audition.mjs --role=olga --voices=id1,id2,id3\n\n" +
        `Roles: ${Object.keys(AUDITION).join(", ")}\n`,
    );
    process.exit(1);
  }

  const role = roleArg.slice(7);
  const spec = AUDITION[role];
  if (!spec) {
    console.error(`Unknown role "${role}". Try: ${Object.keys(AUDITION).join(", ")}`);
    process.exit(1);
  }

  const voiceIds = voicesArg.slice(9).split(",").map((s) => s.trim()).filter(Boolean);
  const outDir = path.join(REPO_ROOT, "voice-auditions", role);
  await mkdir(outDir, { recursive: true });

  console.log(`\nRole: ${role}`);
  console.log(`Line: "${spec.text}"`);
  console.log(`Model: ${model}\n`);
  console.log(`LISTEN FOR:\n  ${spec.listenFor}\n`);

  for (const voiceId of voiceIds) {
    process.stdout.write(`  → ${voiceId} ... `);
    try {
      const res = await fetch(`${API}/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: spec.text,
          model_id: model,
          voice_settings: spec.settings,
        }),
      });
      if (!res.ok) {
        console.log(`FAILED ${res.status}`);
        console.error(`    ${(await res.text()).slice(0, 300)}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const file = path.join(outDir, `${voiceId}.mp3`);
      await writeFile(file, buf);
      console.log(`${Math.round(buf.length / 1024)} KB`);
    } catch (err) {
      console.log("FAILED");
      console.error(`    ${err.message}`);
    }
  }

  console.log(`\nWritten to voice-auditions/${role}/`);
  console.log(
    `Listen to all of them back to back before deciding. Then paste the winning\n` +
      `voiceId into episodes/<ep>/voice/lines.json.\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
