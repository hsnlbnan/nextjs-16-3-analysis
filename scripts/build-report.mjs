#!/usr/bin/env node
/**
 * Runs `next build` and turns its route table into JSON for the migration
 * chapter.
 *
 * The chapter's claim is that a single build can contain fully static routes,
 * partially prerendered ones and fully dynamic ones side by side. Rather than
 * asserting that, the page reads this file — so the table on the site is
 * whatever the last real build actually produced.
 *
 *   pnpm report:build
 */

import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = resolve(ROOT, "data/build-report.json");

/** The legend `next build` prints under its own table. */
const KINDS = {
  "○": "static",
  "◐": "partial",
  "ƒ": "dynamic",
};

const ROUTE_LINE = /([○◐ƒ])\s+(\/\S*)(?:\s+(\S+)\s+(\S+))?\s*$/u;

/**
 * `next build` abbreviates long `generateStaticParams` lists as
 * "[+6 more paths]". Counting only the printed rows would undercount the
 * build, so the aggregate is parsed too and carried through as its own row.
 */
const MORE_PATHS_LINE = /([○◐ƒ])\s+\[\+(\d+) more paths?\]/u;

function run() {
  return new Promise((resolvePromise, reject) => {
    const child = spawn("npx", ["next", "build"], {
      cwd: ROOT,
      env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1" },
    });

    let stdout = "";

    child.stdout.on("data", (chunk) => {
      const text = String(chunk);
      stdout += text;
      process.stdout.write(text);
    });

    child.stderr.on("data", (chunk) => process.stderr.write(chunk));

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`next build exited with code ${code}`));
        return;
      }
      resolvePromise(stdout);
    });
  });
}

function parseRoutes(stdout) {
  // Strip ANSI escapes that survive NO_COLOR on some terminals.
  const clean = stdout.replace(/\[[0-9;]*m/gu, "");
  const lines = clean.split("\n");

  const start = lines.findIndex((line) => line.trimStart().startsWith("Route ("));
  if (start === -1) {
    throw new Error("Could not find the route table in the build output.");
  }

  const routes = [];

  for (const line of lines.slice(start + 1)) {
    // The legend below the table marks the end of the route list.
    if (line.includes("(Static)") || line.includes("prerendered as static")) break;

    const more = line.match(MORE_PATHS_LINE);
    if (more) {
      const [, symbol, count] = more;
      routes.push({
        path: `[+${count} more paths]`,
        kind: KINDS[symbol],
        revalidate: null,
        expire: null,
        aggregate: Number(count),
      });
      continue;
    }

    const match = line.match(ROUTE_LINE);
    if (!match) continue;

    const [, symbol, path, revalidate, expire] = match;

    // Skip the `/[locale]` fallback entries: they duplicate the concrete
    // locale routes and would double every count.
    if (path.includes("[")) continue;

    routes.push({
      path,
      kind: KINDS[symbol],
      revalidate: revalidate ?? null,
      expire: expire ?? null,
    });
  }

  return routes;
}

const stdout = await run();
const routes = parseRoutes(stdout);

if (routes.length === 0) {
  throw new Error("Parsed zero routes — the build output format may have changed.");
}

const totals = routes.reduce(
  (accumulator, route) => {
    accumulator[route.kind] += route.aggregate ?? 1;
    return accumulator;
  },
  { static: 0, partial: 0, dynamic: 0 },
);

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(
  OUTPUT,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      nextVersion: process.env.npm_package_dependencies_next ?? null,
      totals,
      routes,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `\nWrote ${routes.length} routes to data/build-report.json ` +
    `(${totals.static} static, ${totals.partial} partial, ${totals.dynamic} dynamic)`,
);
