#!/usr/bin/env node
/**
 * Re-fetch any registry.json entries whose cached audio file is missing.
 *
 * The registry (id, Freesound source ID, license, mood tags) is tracked in
 * git; the actual mp3s under assets/sound-library/ are NOT (see .gitignore -
 * same reasoning as voice/out/ for narration). After a fresh clone, or if
 * the cache was cleaned, run this to repopulate assets/ from Freesound
 * without needing to re-search or re-decide anything - the registry already
 * has the exact source ID.
 *
 * Usage:
 *   node tools/sound-library/sync.mjs
 *   node tools/sound-library/sync.mjs --force   # re-fetch everything
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const REGISTRY_PATH = path.join(__dirname, "registry.json");
const API = "https://freesound.org/apiv2";

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
    if (canon.includes("freesound") && canon.includes("key")) {
      if (!process.env.FREESOUND_API_KEY) process.env.FREESOUND_API_KEY = value;
    }
  }
}

async function fetchFreesoundPreview(freesoundId, destPath) {
  const apiKey = process.env.FREESOUND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "No FREESOUND_API_KEY in .env - needed to re-fetch missing cache entries. " +
        "Get one free at https://freesound.org/apiv2/apply",
    );
  }
  const res = await fetch(
    `${API}/sounds/${freesoundId}/?fields=id,name,previews`,
    { headers: { Authorization: `Token ${apiKey}` } },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching sound #${freesoundId}: ${await res.text()}`);
  const sound = await res.json();
  const previewUrl = sound.previews?.["preview-hq-mp3"];
  if (!previewUrl) throw new Error(`No preview-hq-mp3 for sound #${freesoundId}`);

  const audioRes = await fetch(previewUrl);
  if (!audioRes.ok) throw new Error(`HTTP ${audioRes.status} downloading preview`);
  const buf = Buffer.from(await audioRes.arrayBuffer());
  await mkdir(path.dirname(destPath), { recursive: true });
  await writeFile(destPath, buf);
  return buf.length;
}

async function main() {
  await loadEnv();

  const force = process.argv.includes("--force");
  const registry = JSON.parse(await readFile(REGISTRY_PATH, "utf8"));

  let synced = 0;
  let skipped = 0;
  let failed = 0;

  for (const [id, entry] of Object.entries(registry.entries)) {
    const destPath = path.join(REPO_ROOT, entry.file);
    if (existsSync(destPath) && !force) {
      skipped++;
      continue;
    }
    try {
      console.log(`Fetching "${entry.name}" (#${entry.freesoundId}) -> ${entry.file}`);
      const bytes = await fetchFreesoundPreview(entry.freesoundId, destPath);
      console.log(`  ${(bytes / 1024).toFixed(1)} KB written`);
      synced++;
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${synced} synced, ${skipped} already cached, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main();
