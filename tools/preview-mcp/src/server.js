#!/usr/bin/env node
/**
 * anima-preview: an MCP server that renders single frames of a Remotion
 * composition to PNG so the model can look at them.
 *
 * This exists to close one specific gap. The script says the Act 2 overlay
 * "must be genuinely ugly - if it composes nicely, the episode fails". Without
 * this tool the model writes that code blind and cannot tell whether it came
 * out ugly or accidentally elegant. With it: render frame, look, adjust seed,
 * look again.
 *
 * Deliberately small. Rendering full video, mixing audio and uploading are
 * fire-and-forget CLI steps with no decisions in them - they do not belong in
 * MCP. See docs/PIPELINE.md.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { spawn } from "node:child_process";
import { readFile, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const EPISODES_DIR = path.join(REPO_ROOT, "episodes");
const PREVIEW_DIR = path.join(REPO_ROOT, ".preview");

/** Guard against path traversal via the episode parameter. */
function episodeDir(episode) {
  if (!/^[a-zA-Z0-9._-]+$/.test(episode)) {
    throw new Error(
      `Invalid episode name: ${episode}. Expected a directory name under episodes/.`,
    );
  }
  const dir = path.join(EPISODES_DIR, episode);
  if (!dir.startsWith(EPISODES_DIR + path.sep)) {
    throw new Error("Episode path escapes episodes/.");
  }
  if (!existsSync(dir)) {
    throw new Error(`No such episode: ${episode}`);
  }
  return dir;
}

function run(cmd, args, cwd, timeoutMs = 300000) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd,
      shell: process.platform === "win32",
      env: process.env,
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill();
      resolve({ code: -1, stdout, stderr: stderr + "\n[timed out]" });
    }, timeoutMs);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ code: -1, stdout, stderr: String(err) });
    });
  });
}

const server = new Server(
  { name: "anima-preview", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "render_frame",
      description:
        "Render a single frame of a Remotion composition to PNG and return it as an image. " +
        "Use this to actually look at what an animation component produces - especially for " +
        "judgements the code cannot make, like whether the Act 2 overlay is convincingly ugly. " +
        "Renders are slow (10-60s); prefer a few well-chosen frames over sweeps.",
      inputSchema: {
        type: "object",
        properties: {
          episode: {
            type: "string",
            description:
              "Episode directory name under episodes/, e.g. 'ep01-nobody-has-seen-it'.",
          },
          composition: {
            type: "string",
            description:
              "Composition id as registered in the episode's Root.tsx, e.g. 'Episode' or 'Act2Overlay'.",
          },
          frame: {
            type: "number",
            description: "Frame number to render (0-based).",
          },
          props: {
            type: "object",
            description:
              "Optional input props passed to the composition, e.g. {\"seed\": 12, \"chaos\": 1.4}. " +
              "This is how to sweep overlay variants without editing code.",
          },
          scale: {
            type: "number",
            description:
              "Render scale, default 0.5. Half size is plenty for judging composition and much faster.",
          },
        },
        required: ["episode", "composition", "frame"],
      },
    },
    {
      name: "list_compositions",
      description:
        "List the composition ids registered in an episode, with their duration in frames, fps and dimensions. " +
        "Call this before render_frame if unsure what exists or how long it runs.",
      inputSchema: {
        type: "object",
        properties: {
          episode: { type: "string", description: "Episode directory name." },
        },
        required: ["episode"],
      },
    },
    {
      name: "list_episodes",
      description: "List available episode directories in the workspace.",
      inputSchema: { type: "object", properties: {} },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;

  try {
    if (name === "list_episodes") {
      if (!existsSync(EPISODES_DIR)) {
        return text("No episodes/ directory yet.");
      }
      const entries = await readdir(EPISODES_DIR, { withFileTypes: true });
      const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
      return text(
        dirs.length ? dirs.join("\n") : "episodes/ exists but is empty.",
      );
    }

    if (name === "list_compositions") {
      const dir = episodeDir(args.episode);
      const r = await run(
        "npx",
        ["remotion", "compositions", "src/index.ts", "--quiet"],
        dir,
      );
      if (r.code !== 0) {
        return text(
          `remotion compositions failed (exit ${r.code}).\n\n${r.stderr || r.stdout}`,
          true,
        );
      }
      return text(r.stdout.trim() || "(no output)");
    }

    if (name === "render_frame") {
      const dir = episodeDir(args.episode);
      const frame = Number(args.frame);
      if (!Number.isFinite(frame) || frame < 0) {
        return text(`Invalid frame: ${args.frame}`, true);
      }
      const scale = args.scale ?? 0.5;

      await mkdir(PREVIEW_DIR, { recursive: true });
      const outFile = path.join(
        PREVIEW_DIR,
        `${args.episode}__${args.composition}__f${frame}.png`,
      );

      const cmd = [
        "remotion",
        "still",
        "src/index.ts",
        args.composition,
        outFile,
        `--frame=${frame}`,
        `--scale=${scale}`,
        "--quiet",
      ];
      if (args.props && Object.keys(args.props).length > 0) {
        cmd.push(`--props=${JSON.stringify(args.props)}`);
      }

      const r = await run("npx", cmd, dir);

      if (r.code !== 0 || !existsSync(outFile)) {
        return text(
          `remotion still failed (exit ${r.code}).\n\n${r.stderr || r.stdout}`,
          true,
        );
      }

      const buf = await readFile(outFile);
      const info = await stat(outFile);
      return {
        content: [
          {
            type: "image",
            data: buf.toString("base64"),
            mimeType: "image/png",
          },
          {
            type: "text",
            text: `${args.composition} frame ${frame} @ scale ${scale} (${Math.round(info.size / 1024)} KB)\n${outFile}`,
          },
        ],
      };
    }

    return text(`Unknown tool: ${name}`, true);
  } catch (err) {
    return text(String(err?.message ?? err), true);
  }
});

function text(s, isError = false) {
  return { content: [{ type: "text", text: s }], isError };
}

const transport = new StdioServerTransport();
await server.connect(transport);
