#!/usr/bin/env node
/**
 * Quick account/credit check before spending on music or SFX generation -
 * those are priced very differently from narration TTS and worth checking
 * balance against before any exploratory calls.
 *
 * Usage: node tools/tts/account.mjs
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const API = "https://api.elevenlabs.io/v1";

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

  const res = await fetch(`${API}/user/subscription`, {
    headers: { "xi-api-key": apiKey },
  });
  if (!res.ok) {
    console.error(`HTTP ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main();
