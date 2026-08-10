#!/usr/bin/env node
/**
 * ElevenLabs sound-effects generation - exploratory tool.
 *
 * One text prompt -> one short SFX clip. This is deliberately separate from
 * synth.mjs (narration) and music.mjs (music) because the API, pricing, and
 * output shape are all different: no voiceId, no lines.json, duration is
 * requested directly (0.5-30s) rather than measured after the fact.
 *
 * Usage:
 *   node tools/tts/sfx.mjs "soft low-pitched UI click" --out=click.mp3 --duration=0.4
 */

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const API = "https://api.elevenlabs.io/v1";
const OUT_DIR = path.join(__dirname, "sfx-out");

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
      if (!process.env.ELEVENLABS_API_KEY) process.env.ELEVENLABS_API_KEY = value;
    }
  }
}

async function main() {
  await loadEnv();
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("No ELEVENLABS_API_KEY found in .env");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const text = args.find((a) => !a.startsWith("--"));
  if (!text) {
    console.error('Usage: node tools/tts/sfx.mjs "description" [--out=name.mp3] [--duration=1.5]');
    process.exit(1);
  }
  const outArg = args.find((a) => a.startsWith("--out="));
  const durationArg = args.find((a) => a.startsWith("--duration="));
  const out = outArg ? outArg.slice(6) : `${Date.now()}.mp3`;
  const duration = durationArg ? parseFloat(durationArg.slice(11)) : undefined;

  const body = { text };
  if (duration !== undefined) body.duration_seconds = duration;

  console.log(`Requesting SFX: "${text}"${duration ? ` (${duration}s)` : " (auto duration)"}`);

  const res = await fetch(`${API}/sound-generation`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error(`HTTP ${res.status}: ${await res.text()}`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  const buf = Buffer.from(await res.arrayBuffer());
  const outPath = path.join(OUT_DIR, out);
  await writeFile(outPath, buf);
  console.log(`Wrote ${outPath} (${(buf.length / 1024).toFixed(1)} KB)`);
}

main();
