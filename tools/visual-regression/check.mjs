#!/usr/bin/env node
/**
 * Visual regression for episode stills. No browser involved - Remotion's own
 * CLI already renders PNGs directly (`remotion still`); this tool's only job
 * is comparing a fresh render against a committed baseline with pixelmatch,
 * the same diff engine Playwright uses internally for toHaveScreenshot,
 * without pulling in a browser to get it. See tools/visual-regression/README.md.
 *
 * Exists because self-review missed a real bug (an origin box silently
 * disappearing once every subsystem extracted, in s02-ep02) that a committed
 * baseline + automatic diff would have caught on the very next change that
 * touched that act. See CLAUDE.md's Builder role.
 *
 * Usage:
 *   node tools/visual-regression/check.mjs <episode>              # check against baselines
 *   node tools/visual-regression/check.mjs <episode> --update      # (re)write baselines
 *   node tools/visual-regression/check.mjs <episode> --lang=en     # check a props variant
 *   node tools/visual-regression/check.mjs <episode> --props='{"lang":"en"}' --suffix=en
 *   node tools/visual-regression/check.mjs <episode> --threshold=0.02   # % pixels allowed to differ (default 0.5%)
 */

import { readFile, writeFile, mkdir, unlink, rename } from "node:fs/promises";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const EPISODES_DIR = path.join(REPO_ROOT, "episodes");
const SNAPSHOTS_PATH = path.join(__dirname, "snapshots.json");
const BASELINES_DIR = path.join(__dirname, "baselines");
const DIFFS_DIR = path.join(__dirname, "diffs");

const DEFAULT_SCALE = 0.5;
// % of pixels allowed to differ before FAIL. Deliberately tight: the bug this
// tool exists to catch (a thin, low-opacity boundary rect silently vanishing
// in s02-ep02) only moved the diff from 0.000% to 0.002% of frame pixels - a
// generic "0.5% is normal image-diff noise" default would have missed it.
// Verified 2026-08-11 by reintroducing that exact bug and confirming this
// threshold catches it while a same-pixel re-render stays at 0.000%.
const DEFAULT_THRESHOLD_PCT = 0.001;

function run(cmd, args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, shell: process.platform === "win32" });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
    child.on("error", (err) => resolve({ code: -1, stdout, stderr: String(err) }));
  });
}

async function renderStill(episode, composition, frame, outFile, { scale, props }) {
  const dir = path.join(EPISODES_DIR, episode);
  const cmd = [
    "remotion",
    "still",
    "src/index.ts",
    composition,
    outFile,
    `--frame=${frame}`,
    `--scale=${scale}`,
    "--quiet",
  ];

  // Pass props via a temp JSON file, not an inline --props='{"..."}' string:
  // with shell:true (needed on Windows so `npx` resolves at all), the shell
  // strips the outer quotes before remotion sees them, leaving unparseable
  // JSON. A file path sidesteps quoting entirely and works on every platform.
  let propsFile = null;
  if (props && Object.keys(props).length > 0) {
    propsFile = path.join(path.dirname(outFile), `.props-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
    await mkdir(path.dirname(propsFile), { recursive: true });
    await writeFile(propsFile, JSON.stringify(props));
    cmd.push(`--props=${propsFile}`);
  }

  try {
    const r = await run("npx", cmd, dir);
    if (r.code !== 0 || !existsSync(outFile)) {
      throw new Error(`remotion still failed for ${composition} frame ${frame} (exit ${r.code}):\n${r.stderr || r.stdout}`);
    }
  } finally {
    if (propsFile) await unlink(propsFile).catch(() => {});
  }
}

async function main() {
  const args = process.argv.slice(2);
  const episode = args.find((a) => !a.startsWith("--"));
  const update = args.includes("--update");
  const scaleArg = args.find((a) => a.startsWith("--scale="));
  const scale = scaleArg ? Number(scaleArg.slice(8)) : DEFAULT_SCALE;
  const thresholdArg = args.find((a) => a.startsWith("--threshold="));
  const thresholdPct = thresholdArg ? Number(thresholdArg.slice(12)) : DEFAULT_THRESHOLD_PCT;
  const langArg = args.find((a) => a.startsWith("--lang="));
  const lang = langArg ? langArg.slice(7) : null;
  const propsArg = args.find((a) => a.startsWith("--props="));
  const explicitProps = propsArg ? JSON.parse(propsArg.slice(8)) : null;
  const suffixArg = args.find((a) => a.startsWith("--suffix="));

  if (!episode) {
    console.error(
      "Usage:\n" +
        "  node tools/visual-regression/check.mjs <episode> [--update] [--lang=en]\n" +
        "  [--props='{\"key\":\"val\"}' --suffix=variant-name] [--scale=0.5] [--threshold=0.5]\n",
    );
    process.exit(1);
  }

  const spec = JSON.parse(await readFile(SNAPSHOTS_PATH, "utf8"));
  const episodeSpec = spec.episodes[episode];
  if (!episodeSpec) {
    console.error(
      `No snapshot spec for "${episode}" in ${path.relative(REPO_ROOT, SNAPSHOTS_PATH)}.\n` +
        `Add an entry with composition + key frames before running this.`,
    );
    process.exit(1);
  }

  const props = explicitProps ?? (lang ? { lang } : {});
  const variantSuffix = suffixArg ? suffixArg.slice(9) : lang ? lang : null;

  const baselineDir = path.join(BASELINES_DIR, episode);
  const diffDir = path.join(DIFFS_DIR, episode);
  await mkdir(baselineDir, { recursive: true });
  if (!update) await mkdir(diffDir, { recursive: true });

  console.log(
    `${update ? "Updating" : "Checking"} ${episodeSpec.frames.length} snapshot(s) for "${episode}"` +
      (variantSuffix ? ` (variant: ${variantSuffix})` : "") +
      `...\n`,
  );

  let failed = 0;
  let passed = 0;

  for (const { frame, label } of episodeSpec.frames) {
    const nameBase = `${episodeSpec.composition}__f${frame}` + (variantSuffix ? `__${variantSuffix}` : "");
    const baselineFile = path.join(baselineDir, `${nameBase}.png`);
    const tmpFile = path.join(update ? baselineDir : diffDir, `${nameBase}.new.png`);

    await renderStill(episode, episodeSpec.composition, frame, tmpFile, { scale, props });

    if (update) {
      await rename(tmpFile, baselineFile);
      console.log(`  wrote ${label} (frame ${frame}) -> ${path.relative(REPO_ROOT, baselineFile)}`);
      continue;
    }

    if (!existsSync(baselineFile)) {
      console.log(`  ? ${label} (frame ${frame}): no baseline yet - run with --update first`);
      failed++;
      await unlink(tmpFile).catch(() => {});
      continue;
    }

    const baseline = PNG.sync.read(readFileSync(baselineFile));
    const fresh = PNG.sync.read(readFileSync(tmpFile));

    if (baseline.width !== fresh.width || baseline.height !== fresh.height) {
      console.log(
        `  X ${label} (frame ${frame}): SIZE MISMATCH baseline=${baseline.width}x${baseline.height} fresh=${fresh.width}x${fresh.height}`,
      );
      failed++;
      continue;
    }

    const { width, height } = baseline;
    const diff = new PNG({ width, height });
    const diffPixels = pixelmatch(baseline.data, fresh.data, diff.data, width, height, {
      threshold: 0.1, // per-pixel color-difference sensitivity (pixelmatch's own scale, 0-1)
    });
    const totalPixels = width * height;
    const diffPct = (diffPixels / totalPixels) * 100;

    if (diffPct > thresholdPct) {
      const diffFile = path.join(diffDir, `${nameBase}.diff.png`);
      writeFileSync(diffFile, PNG.sync.write(diff));
      const freshKeptFile = path.join(diffDir, `${nameBase}.new.png`);
      console.log(
        `  X ${label} (frame ${frame}): ${diffPct.toFixed(2)}% pixels differ (threshold ${thresholdPct}%)\n` +
          `      diff:  ${path.relative(REPO_ROOT, diffFile)}\n` +
          `      fresh: ${path.relative(REPO_ROOT, freshKeptFile)}\n` +
          `      baseline: ${path.relative(REPO_ROOT, baselineFile)}`,
      );
      failed++;
    } else {
      console.log(`  ok ${label} (frame ${frame}): ${diffPct.toFixed(3)}% pixels differ`);
      passed++;
      await unlink(tmpFile).catch(() => {});
    }
  }

  if (update) {
    console.log(`\n${episodeSpec.frames.length} baseline(s) written.`);
    return;
  }

  console.log(`\n${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    console.log(
      `\nIf these changes are intentional, review the diffs above, then re-run with\n` +
        `--update to accept the new baselines.`,
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
