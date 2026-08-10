#!/usr/bin/env node
/**
 * Round-trip verification: synthesised audio -> ElevenLabs Scribe (STT) ->
 * compare against the text we asked for.
 *
 * WHAT THIS CATCHES: pronunciation and text-normalisation defects. If
 * "в две тысячи девятнадцатом" comes back as something else, or a word is
 * swallowed, or the model reads a numeral wrong, this finds it mechanically.
 *
 * WHAT THIS CANNOT CATCH: delivery. STT returns words, and the words were the
 * input. Whether Olga sounds defensive-but-competent or like a call-centre
 * robot is discarded by transcription. That judgement stays human - it is
 * exactly what tools/tts/audition.mjs is for.
 *
 * So: use this as a defect filter, not as an approval gate.
 *
 * Usage:
 *   node tools/tts/verify.mjs ep01-nobody-has-seen-it
 *   node tools/tts/verify.mjs ep01-nobody-has-seen-it --only=o01,n09
 *   node tools/tts/verify.mjs --file=voice-auditions/olga/<id>.mp3 --expect="..."
 */

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const API = "https://api.elevenlabs.io/v1";
/** scribe_v1 is deprecated; v2 covers 90+ languages including Russian. */
const STT_MODEL = "scribe_v2";

/**
 * Remove eleven_v3 audio tags before comparing.
 *
 * Tags are delivery direction, not speech - the model consumes them. But a
 * non-verbal tag like [sigh] produces actual audio, which Scribe transcribes
 * as its own bracketed marker ("[вздох]"). Both sides get stripped so the
 * comparison stays about WORDS.
 */
function stripTags(s) {
  return s.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
}

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

/**
 * Russian number words -> digits, so spelled-out years compare equal to what
 * Scribe returns.
 *
 * Needed because the lines file deliberately spells numbers out ("в две тысячи
 * девятнадцатом") to control TTS pronunciation, while STT transcribes them
 * back as digits ("в 2019"). Without this, every number in every episode gets
 * flagged as a defect - which is a false alarm that would train us to ignore
 * the report.
 *
 * Only covers what the scripts actually use: years and small counts.
 */
const NUM_WORDS = {
  ноль: 0, один: 1, одна: 1, два: 2, две: 2, три: 3, четыре: 4, пять: 5,
  шесть: 6, семь: 7, восемь: 8, девять: 9, десять: 10, одиннадцать: 11,
  двенадцать: 12, тринадцать: 13, четырнадцать: 14, пятнадцать: 15,
  шестнадцать: 16, семнадцать: 17, восемнадцать: 18, девятнадцать: 19,
  двадцать: 20, тридцать: 30, сорок: 40, пятьдесят: 50, сто: 100,
  тысяча: 1000, тысячи: 1000, тысяч: 1000,
};

/**
 * Ordinal/case endings collapse to the cardinal stem: девятнадцатом -> девятнадцать.
 *
 * NOTE: uses an explicit Cyrillic class, NOT \w. In JavaScript \w is ASCII-only,
 * so /^девятнадцат\w*$/ never matches "девятнадцатом" - which silently broke
 * year folding on the first attempt.
 */
const CYR = "[а-яё]*";
const ORDINAL_STEMS = [
  [new RegExp(`^девятнадцат${CYR}$`), "девятнадцать"],
  [new RegExp(`^восемнадцат${CYR}$`), "восемнадцать"],
  [new RegExp(`^семнадцат${CYR}$`), "семнадцать"],
  [new RegExp(`^шестнадцат${CYR}$`), "шестнадцать"],
  [new RegExp(`^пятнадцат${CYR}$`), "пятнадцать"],
  [new RegExp(`^четырнадцат${CYR}$`), "четырнадцать"],
  [new RegExp(`^тринадцат${CYR}$`), "тринадцать"],
  [new RegExp(`^двенадцат${CYR}$`), "двенадцать"],
  [new RegExp(`^одиннадцат${CYR}$`), "одиннадцать"],
  [new RegExp(`^двадцат${CYR}$`), "двадцать"],
  [new RegExp(`^тридцат${CYR}$`), "тридцать"],
  [new RegExp(`^десят${CYR}$`), "десять"],
  [new RegExp(`^тысячн${CYR}$`), "тысяча"],
];

/**
 * Collapse runs of number-words into a single digit token.
 * "две тысячи девятнадцатом" -> "2019"
 */
function foldNumbers(words) {
  const out = [];
  let acc = null;

  const valueOf = (w) => {
    if (NUM_WORDS[w] !== undefined) return NUM_WORDS[w];
    for (const [re, stem] of ORDINAL_STEMS) {
      if (re.test(w)) return NUM_WORDS[stem];
    }
    return null;
  };

  const flush = () => {
    if (acc !== null) {
      out.push(String(acc));
      acc = null;
    }
  };

  for (const w of words) {
    const v = valueOf(w);
    if (v === null) {
      flush();
      // Strip ordinal suffixes STT adds to digits: "2019-м" -> "2019"
      out.push(w.replace(/^(\d+)[-–]?[а-яё]+$/, "$1"));
      continue;
    }
    if (acc === null) acc = v;
    else if (v >= 1000) acc = (acc || 1) * v;
    else acc += v;
  }
  flush();
  return out;
}

/** Strip punctuation/case so comparison is about words, not formatting. */
function normalise(s) {
  const words = stripTags(s)
    .toLowerCase()
    // Strip combining stress accents. Russian scripts use "Айти́шник" to force
    // correct TTS stress, but STT returns the plain word - without this every
    // stress-marked word reads as a mismatch.
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .normalize("NFC")
    .replace(/ё/g, "е")
    .replace(/[.,!?;:—–«»"'()…]/g, " ")
    .replace(/(\d)\s*-\s*([а-я])/g, "$1$2")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  return foldNumbers(words).join(" ");
}

/** Word-level edit distance, as a similarity ratio 0..1. Number-fold aware. */
function similarity(a, b) {
  const A = normalise(a).split(" ").filter(Boolean);
  const B = normalise(b).split(" ").filter(Boolean);
  if (A.length === 0 && B.length === 0) return 1;

  const d = Array.from({ length: A.length + 1 }, (_, i) =>
    Array.from({ length: B.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= A.length; i++) {
    for (let j = 1; j <= B.length; j++) {
      d[i][j] =
        A[i - 1] === B[j - 1]
          ? d[i - 1][j - 1]
          : 1 + Math.min(d[i - 1][j], d[i][j - 1], d[i - 1][j - 1]);
    }
  }
  const dist = d[A.length][B.length];
  return 1 - dist / Math.max(A.length, B.length);
}

/** Words present in one but not the other - the useful part of a mismatch. */
function wordDiff(expected, got) {
  const E = normalise(expected).split(" ").filter(Boolean);
  const G = normalise(got).split(" ").filter(Boolean);
  const gs = new Set(G);
  const es = new Set(E);
  return {
    missing: E.filter((w) => !gs.has(w)),
    extra: G.filter((w) => !es.has(w)),
  };
}

async function transcribe(apiKey, filePath, language = "rus") {
  const buf = await readFile(filePath);
  const form = new FormData();
  form.append("file", new Blob([buf], { type: "audio/mpeg" }), path.basename(filePath));
  form.append("model_id", STT_MODEL);
  form.append("language_code", language);

  const res = await fetch(`${API}/speech-to-text`, {
    method: "POST",
    headers: { "xi-api-key": apiKey },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`STT ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();
  return data.text ?? "";
}

async function main() {
  await loadEnv();
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("No ElevenLabs key found in .env");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const fileArg = args.find((a) => a.startsWith("--file="));
  const expectArg = args.find((a) => a.startsWith("--expect="));

  // Single-file mode, for auditions.
  if (fileArg) {
    const file = path.resolve(REPO_ROOT, fileArg.slice(7));
    const got = await transcribe(apiKey, file);
    console.log(`\nTranscript: ${got}`);
    if (expectArg) {
      const expected = expectArg.slice(9);
      const sim = similarity(expected, got);
      const { missing, extra } = wordDiff(expected, got);
      console.log(`Expected:   ${expected}`);
      console.log(`Similarity: ${(sim * 100).toFixed(1)}%`);
      if (missing.length) console.log(`Missing:    ${missing.join(", ")}`);
      if (extra.length) console.log(`Extra:      ${extra.join(", ")}`);
    }
    console.log(
      `\nNOTE: this checks WORDS only. Delivery - whether it sounds right - is not\n` +
        `something transcription can tell you. Listen to the file.`,
    );
    return;
  }

  const episode = args.find((a) => !a.startsWith("--"));
  if (!episode) {
    console.error(
      "Usage:\n" +
        "  node tools/tts/verify.mjs <episode-dir> [--only=id1,id2]\n" +
        '  node tools/tts/verify.mjs --file=path/to.mp3 --expect="текст"\n',
    );
    process.exit(1);
  }

  const onlyArg = args.find((a) => a.startsWith("--only="));
  const only = onlyArg ? onlyArg.slice(7).split(",").map((s) => s.trim()) : null;

  const epDir = path.join(REPO_ROOT, "episodes", episode);
  const manifestPath = path.join(epDir, "voice", "manifest.json");
  if (!existsSync(manifestPath)) {
    console.error(
      `No manifest at ${manifestPath}. Run tools/tts/synth.mjs first.`,
    );
    process.exit(1);
  }

  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const entries = Object.entries(manifest.lines).filter(
    ([id]) => !only || only.includes(id),
  );

  const results = [];
  let worst = 1;

  for (const [id, line] of entries) {
    const file = path.join(epDir, line.file);
    if (!existsSync(file)) {
      console.log(`  ? ${id}: audio missing (${line.file})`);
      continue;
    }
    process.stdout.write(`  · ${id} ... `);
    try {
      const got = await transcribe(apiKey, file);
      const sim = similarity(line.text, got);
      const { missing, extra } = wordDiff(line.text, got);
      worst = Math.min(worst, sim);

      const flag = sim >= 0.95 ? "ok" : sim >= 0.85 ? "CHECK" : "BAD";
      console.log(`${(sim * 100).toFixed(0)}% ${flag}`);
      if (sim < 0.95) {
        console.log(`      expected: ${line.text}`);
        console.log(`      heard:    ${got}`);
        if (missing.length) console.log(`      missing:  ${missing.join(", ")}`);
        if (extra.length) console.log(`      extra:    ${extra.join(", ")}`);
      }
      results.push({ id, similarity: sim, expected: line.text, heard: got, missing, extra });
    } catch (err) {
      console.log("FAILED");
      console.error(`      ${err.message}`);
    }
  }

  const reportPath = path.join(epDir, "voice", "verify-report.json");
  await writeFile(
    reportPath,
    JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) + "\n",
  );

  const bad = results.filter((r) => r.similarity < 0.85);
  console.log(
    `\n${results.length} checked, worst ${(worst * 100).toFixed(0)}%, ${bad.length} below 85%.`,
  );
  console.log(`Report: ${path.relative(REPO_ROOT, reportPath)}`);
  console.log(
    `\nThis only proves the right WORDS came out. It says nothing about whether\n` +
      `Olga sounds competent or Sergey sounds tired. Those need your ears.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
