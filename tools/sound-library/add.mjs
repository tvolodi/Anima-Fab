#!/usr/bin/env node
/**
 * Add a Freesound track to the curated registry - the "I've decided" step
 * after auditioning candidates. Fetches the preview mp3, measures its real
 * duration, and writes a registry.json entry with license + mood tags.
 *
 * Usage:
 *   node tools/sound-library/add.mjs --id=854842 --name=warm-pad-drone \
 *     --kind=music --tags=calm,ambient,minimal --notes="won vs ElevenLabs for S02E01"
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

function licenseShort(url) {
  if (url.includes("publicdomain/zero")) return "CC0";
  if (url.includes("licenses/by/")) return "CC-BY";
  if (url.includes("licenses/by-nc")) return "CC-BY-NC";
  if (url.includes("sampling+")) return "Sampling+";
  return url;
}

async function main() {
  await loadEnv();
  const apiKey = process.env.FREESOUND_API_KEY;
  if (!apiKey) {
    console.error("No FREESOUND_API_KEY in .env");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const get = (flag) => {
    const a = args.find((x) => x.startsWith(`--${flag}=`));
    return a ? a.slice(flag.length + 3) : undefined;
  };

  const freesoundId = get("id");
  const name = get("name");
  const kind = get("kind") || "music";
  const tags = (get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean);
  const notes = get("notes") || "";
  const usedIn = (get("used-in") || "").split(",").map((t) => t.trim()).filter(Boolean);

  if (!freesoundId || !name) {
    console.error(
      "Usage: node tools/sound-library/add.mjs --id=<freesoundId> --name=<registry-id> " +
        "[--kind=music|sfx] [--tags=calm,ambient] [--notes=\"...\"] [--used-in=ep-name]",
    );
    process.exit(1);
  }
  if (!/^[a-z0-9-]+$/.test(name)) {
    console.error("--name must be kebab-case (the registry key), e.g. warm-pad-drone");
    process.exit(1);
  }

  const res = await fetch(
    `${API}/sounds/${freesoundId}/?fields=id,name,previews,license,duration,username`,
    { headers: { Authorization: `Token ${apiKey}` } },
  );
  if (!res.ok) {
    console.error(`HTTP ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const sound = await res.json();
  const previewUrl = sound.previews?.["preview-hq-mp3"];
  if (!previewUrl) {
    console.error("No preview-hq-mp3 available for this sound.");
    process.exit(1);
  }

  const registry = JSON.parse(await readFile(REGISTRY_PATH, "utf8"));
  if (registry.entries[name]) {
    console.error(`Registry already has an entry named "${name}". Pick a different --name.`);
    process.exit(1);
  }

  const subdir = kind === "sfx" ? "sfx" : "music";
  const relFile = `assets/sound-library/${subdir}/${name}.mp3`;
  const destPath = path.join(REPO_ROOT, relFile);

  console.log(`Fetching "${sound.name}" by ${sound.username} (#${freesoundId})...`);
  const audioRes = await fetch(previewUrl);
  if (!audioRes.ok) {
    console.error(`HTTP ${audioRes.status} downloading preview`);
    process.exit(1);
  }
  const buf = Buffer.from(await audioRes.arrayBuffer());
  await mkdir(path.dirname(destPath), { recursive: true });
  await writeFile(destPath, buf);
  console.log(`Wrote ${relFile} (${(buf.length / 1024).toFixed(1)} KB)`);

  registry.entries[name] = {
    kind,
    freesoundId: sound.id,
    name: sound.name,
    author: sound.username,
    license: sound.license,
    licenseShort: licenseShort(sound.license),
    durationSeconds: sound.duration,
    moodTags: tags,
    file: relFile,
    usedIn,
    notes,
    addedAt: new Date().toISOString().slice(0, 10),
  };

  await writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2) + "\n");
  console.log(`\nAdded "${name}" to registry.json (${licenseShort(sound.license)}).`);
}

main();
