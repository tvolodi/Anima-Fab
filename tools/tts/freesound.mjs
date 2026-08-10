#!/usr/bin/env node
/**
 * Freesound search + fetch - the counterpart to music.mjs/sfx.mjs, for the
 * ElevenLabs-vs-Freesound comparison.
 *
 * Needs FREESOUND_API_KEY in .env (free - apply at
 * https://freesound.org/apiv2/apply, no OAuth needed for search + preview
 * download, only the full-quality /download/ endpoint needs OAuth2. Preview
 * mp3s (~128kbps) are good enough for this comparison and for real use).
 *
 * Usage:
 *   node tools/tts/freesound.mjs "ambient ...
 * `duration:[20 TO 60]`.
 *   node tools/tts/freesound.mjs --search="ambient drone" --filter="duration:[20 TO 60]"
 *   node tools/tts/freesound.mjs --id=12345 --out=candidate.mp3
 */

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const API = "https://freesound.org/apiv2";
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
    if (canon.includes("freesound") && canon.includes("key")) {
      if (!process.env.FREESOUND_API_KEY) process.env.FREESOUND_API_KEY = value;
    }
  }
}

async function main() {
  await loadEnv();
  const apiKey = process.env.FREESOUND_API_KEY;
  if (!apiKey) {
    console.error(
      "No FREESOUND_API_KEY found in .env. Get one free at https://freesound.org/apiv2/apply " +
        "(token auth is enough - no OAuth needed for search + preview download).",
    );
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const idArg = args.find((a) => a.startsWith("--id="));
  const searchArg = args.find((a) => a.startsWith("--search="));
  const filterArg = args.find((a) => a.startsWith("--filter="));
  const outArg = args.find((a) => a.startsWith("--out="));
  const licenseFilter = !args.includes("--any-license");

  if (idArg) {
    // Direct fetch by known sound ID.
    const id = idArg.slice(5);
    const out = outArg ? outArg.slice(6) : `freesound_${id}.mp3`;
    const res = await fetch(
      `${API}/sounds/${id}/?fields=id,name,previews,license,duration,username`,
      { headers: { Authorization: `Token ${apiKey}` } },
    );
    if (!res.ok) {
      console.error(`HTTP ${res.status}: ${await res.text()}`);
      process.exit(1);
    }
    const sound = await res.json();
    await downloadPreview(sound, out);
    return;
  }

  if (!searchArg) {
    console.error(
      'Usage:\n' +
        '  node tools/tts/freesound.mjs --search="ambient drone" [--filter="duration:[20 TO 60]"] [--out=name.mp3]\n' +
        '  node tools/tts/freesound.mjs --id=12345 [--out=name.mp3]\n' +
        "  (add --any-license to skip the CC0/CC-BY filter and see everything)",
    );
    process.exit(1);
  }

  const query = searchArg.slice(9);
  const params = new URLSearchParams({
    query,
    fields: "id,name,previews,license,duration,username,avg_rating",
    sort: "rating_desc",
    page_size: "10",
  });
  // Default to permissive licenses (CC0 / CC-BY) so results are safe to use
  // without extra attribution bookkeeping - see TOOLS.md licensing section.
  const filters = [];
  if (filterArg) filters.push(filterArg.slice(9));
  if (licenseFilter) {
    filters.push(
      '(license:"Creative Commons 0" OR license:"Attribution")',
    );
  }
  if (filters.length) params.set("filter", filters.join(" "));

  console.log(`Searching Freesound: "${query}"${filterArg ? ` [${filterArg.slice(9)}]` : ""}`);

  const res = await fetch(`${API}/search/text/?${params}`, {
    headers: { Authorization: `Token ${apiKey}` },
  });
  if (!res.ok) {
    console.error(`HTTP ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const data = await res.json();

  if (!data.results?.length) {
    console.log("No results.");
    return;
  }

  console.log(`\n${data.count} total results, showing top ${data.results.length}:\n`);
  for (const s of data.results) {
    console.log(
      `  #${s.id}  "${s.name}"  by ${s.username}  ${s.duration.toFixed(1)}s  ` +
        `${s.license.split("/").pop() || s.license}  rating=${s.avg_rating}`,
    );
  }
  console.log(
    `\nFetch one with: node tools/tts/freesound.mjs --id=<id> --out=name.mp3`,
  );
}

async function downloadPreview(sound, out) {
  const previewUrl = sound.previews?.["preview-hq-mp3"];
  if (!previewUrl) {
    console.error("No preview-hq-mp3 available for this sound.");
    process.exit(1);
  }
  console.log(`Fetching "${sound.name}" by ${sound.username} (${sound.license})`);
  const res = await fetch(previewUrl);
  if (!res.ok) {
    console.error(`HTTP ${res.status} fetching preview`);
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });
  const buf = Buffer.from(await res.arrayBuffer());
  const outPath = path.join(OUT_DIR, out);
  await writeFile(outPath, buf);
  console.log(`Wrote ${outPath} (${(buf.length / 1024).toFixed(1)} KB)`);
  console.log(`License: ${sound.license} - keep this noted if the track gets used in the episode.`);
}

main();
