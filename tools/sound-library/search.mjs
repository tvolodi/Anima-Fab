#!/usr/bin/env node
/**
 * Search the CURATED registry first - the whole point of this library is to
 * stop re-searching Freesound and re-litigating mood for every episode. Only
 * reach for tools/tts/freesound.mjs (raw Freesound search) when nothing here
 * fits and a new entry needs deciding.
 *
 * Usage:
 *   node tools/sound-library/search.mjs calm ambient
 *   node tools/sound-library/search.mjs --kind=sfx click
 *   node tools/sound-library/search.mjs            # list everything
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = path.join(__dirname, "registry.json");

async function main() {
  const registry = JSON.parse(await readFile(REGISTRY_PATH, "utf8"));
  const args = process.argv.slice(2);
  const kindArg = args.find((a) => a.startsWith("--kind="));
  const kind = kindArg ? kindArg.slice(7) : null;
  const terms = args.filter((a) => !a.startsWith("--")).map((t) => t.toLowerCase());

  const entries = Object.entries(registry.entries).filter(([id, e]) => {
    if (kind && e.kind !== kind) return false;
    if (terms.length === 0) return true;
    const haystack = [id, e.name, ...e.moodTags].join(" ").toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });

  if (entries.length === 0) {
    console.log("No matches in the curated registry.");
    console.log(
      "Search Freesound directly for something new: node tools/tts/freesound.mjs --search=\"...\"",
    );
    console.log(
      "Then add a winner to the registry: node tools/sound-library/add.mjs --id=<freesoundId> --name=<registry-id> --kind=music --tags=calm,ambient",
    );
    return;
  }

  console.log(`${entries.length} match(es):\n`);
  for (const [id, e] of entries) {
    console.log(`  ${id}  [${e.kind}]  ${e.durationSeconds.toFixed(1)}s  ${e.licenseShort}`);
    console.log(`    "${e.name}" by ${e.author}`);
    console.log(`    tags: ${e.moodTags.join(", ")}`);
    console.log(`    file: ${e.file}`);
    if (e.usedIn?.length) console.log(`    used in: ${e.usedIn.join(", ")}`);
    console.log();
  }
}

main();
