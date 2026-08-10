#!/usr/bin/env node
/**
 * ElevenLabs music generation - exploratory tool.
 *
 * Separate from sfx.mjs: different endpoint (/v1/music), different request
 * shape (music_length_ms instead of duration_seconds, up to 600000ms),
 * different cost profile - probe with SHORT clips before committing to a
 * full-length score.
 *
 * Usage:
 *   node tools/tts/music.mjs "calm, minimal, ambient pad, no percussion" --out=test.mp3 --ms=8000
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
  const prompt = args.find((a) => !a.startsWith("--"));
  if (!prompt) {
    console.error('Usage: node tools/tts/music.mjs "prompt" [--out=name.mp3] [--ms=8000] [--instrumental]');
    process.exit(1);
  }
  const outArg = args.find((a) => a.startsWith("--out="));
  const msArg = args.find((a) => a.startsWith("--ms="));
  const instrumental = args.includes("--instrumental");
  const out = outArg ? outArg.slice(6) : `music_${Date.now()}.mp3`;
  const musicLengthMs = msArg ? parseInt(msArg.slice(5), 10) : 8000;

  const body = {
    prompt,
    music_length_ms: musicLengthMs,
    force_instrumental: instrumental,
  };

  console.log(`Requesting music: "${prompt}" (${musicLengthMs}ms, instrumental=${instrumental})`);

  const res = await fetch(`${API}/music`, {
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
