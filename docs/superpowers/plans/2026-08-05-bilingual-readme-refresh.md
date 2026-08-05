# Bilingual README Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stale English-only README with an accurate English-first, Turkish-second guide and four localized screenshots captured from the current production application.

**Architecture:** `README.md` remains the single documentation entry point and uses anchor links to move between two complete language sections. Four production screenshots live under `docs/images/readme/`; technical claims are checked against repository sources rather than copied from memory.

**Tech Stack:** Markdown, Next.js 16.3 production build, Playwright/Chromium, pnpm, PNG assets

## Global Constraints

- English appears first and Turkish appears after a clear divider in the same `README.md`.
- Both language sections carry equivalent facts and instructions; Turkish follows `lib/dictionaries/tr.ts` terminology.
- Capture four screenshots at a 1440 × 900 viewport from `next start`, without browser chrome or development overlays.
- Store screenshots under `docs/images/readme/` and reference them with relative Markdown paths.
- Document 15 Playwright tests and the current 15 static / 17 partial / 2 dynamic route distribution.
- Do not modify application UI or dictionary content.
- Do not add remote-dependent badges or hard-coded repository URLs.
- Do not stage unrelated modified or untracked files.

---

### Task 1: Capture localized production screenshots

**Files:**
- Create: `docs/images/readme/overview-en.png`
- Create: `docs/images/readme/waterfall-en.png`
- Create: `docs/images/readme/overview-tr.png`
- Create: `docs/images/readme/waterfall-tr.png`

**Interfaces:**
- Consumes: `/en`, `/en/waterfall`, `/tr`, and `/tr/waterfall` on `http://127.0.0.1:3100`.
- Produces: four 1440 × 900 PNG files referenced by Task 2.

- [ ] **Step 1: Build the current application**

Run `pnpm build`.

Expected: exit code 0 and a Next.js 16.3 route table.

- [ ] **Step 2: Start the production server**

Run `pnpm start --port 3100` in a managed background session.

Expected: `Ready` at `http://localhost:3100`.

- [ ] **Step 3: Create the screenshot directory**

Run:

```bash
mkdir -p docs/images/readme
```

- [ ] **Step 4: Capture the four screenshots with Playwright**

Run this program through `node --input-type=module -e` using shell-safe quoting:

```js
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
});
const baseURL = "http://127.0.0.1:3100";
const captures = [
  { route: "/en", output: "docs/images/readme/overview-en.png" },
  { route: "/en/waterfall", heading: "The only difference", output: "docs/images/readme/waterfall-en.png" },
  { route: "/tr", output: "docs/images/readme/overview-tr.png" },
  { route: "/tr/waterfall", heading: "Tek fark bu", output: "docs/images/readme/waterfall-tr.png" },
];

for (const capture of captures) {
  await page.goto(`${baseURL}${capture.route}`, { waitUntil: "networkidle" });
  if (capture.heading) {
    const heading = page.getByRole("heading", { name: capture.heading, exact: true });
    await heading.evaluate((element) =>
      window.scrollTo(
        0,
        element.getBoundingClientRect().top + window.scrollY - 120,
      ),
    );
  }
  await page.screenshot({ path: capture.output });
}
await browser.close();
```

Expected: four PNG files with no Next.js development indicator.

- [ ] **Step 5: Inspect dimensions and visual content**

Run:

```bash
sips -g pixelWidth -g pixelHeight docs/images/readme/*.png
```

Expected: every file reports `pixelWidth: 1440` and `pixelHeight: 900`. Open each image and confirm localized copy; in Waterfall, confirm equal-height editors and aligned captions.

- [ ] **Step 6: Stop only the production server from Step 2**

Send `Ctrl-C` to its managed session. Leave the user's existing development server untouched.

---

### Task 2: Rebuild README as one bilingual document

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: Task 1 assets plus `package.json`, `next.config.ts`, `data/build-report.json`, and `e2e/`.
- Produces: one English-first, Turkish-second README with valid anchors and relative links.

- [ ] **Step 1: Replace the stale README structure**

Use this exact heading and asset order:

```markdown
# Instant Lab

[English](#english) · [Türkçe](#türkçe)

<a id="english"></a>

## English

![Instant Lab overview in English](docs/images/readme/overview-en.png)

### Quick start
### What this project proves
![Waterfall comparison in English](docs/images/readme/waterfall-en.png)
### Five chapters
### How timing is measured
### One build, three rendering modes
### Verification
### Commands
### Known limits
### Stack and licence

---

<a id="türkçe"></a>

## Türkçe

![Instant Lab Türkçe genel bakış](docs/images/readme/overview-tr.png)

### Hızlı başlangıç
### Bu proje neyi kanıtlıyor?
![Türkçe Waterfall karşılaştırması](docs/images/readme/waterfall-tr.png)
### Beş bölüm
### Timing nasıl ölçülüyor?
### Tek build, üç render modu
### Doğrulama
### Komutlar
### Bilinen sınırlar
### Teknolojiler ve lisans
```

- [ ] **Step 2: Write the English section from current facts**

State all of the following:

- Instant Lab runs the rendering model it explains; only artificial server latency is simulated.
- Five chapters cover Suspense, async waterfalls, Cache Components, Partial Prefetching, and migration.
- Inline RSC stream markers measure byte arrival before hydration; client navigation uses `NavBeacon` because the router does not evaluate inline scripts.
- The current build contains 15 static, 17 partial, and 2 dynamic routes.
- The production Playwright suite contains 15 tests: instant-navigation claims plus code-layout and control-interaction regressions.
- Quick start uses `pnpm install` and `pnpm dev`; honest prefetch measurement uses `pnpm build` followed by `pnpm start`.
- The command table contains every `package.json` script, including `test:e2e:ui`.
- The stack reports Next.js 16.3.0, React 19.2.8, TypeScript, Tailwind CSS v4, Radix/shadcn, Shiki, and Playwright.

- [ ] **Step 3: Write the complete Turkish section**

Mirror the English facts without literal sentence-by-sentence translation. Use the established terms `route`, `static shell`, `Suspense boundary`, `request`, `stream`, `timing`, `cache`, `build`, and `Partial Prefetching`. Do not use “sınır” alone for a Suspense boundary.

- [ ] **Step 4: Keep links descriptive and relative**

Link these repository targets:

```text
next.config.ts
scripts/build-report.mjs
data/build-report.json
e2e/instant-navigation.spec.ts
e2e/code-block-layout.spec.ts
e2e/control-polish.spec.ts
lib/i18n.ts
LICENSE
```

Link the official Next.js `instant()` documentation with its existing public URL. Do not add badges without a configured remote.

- [ ] **Step 5: Run copy self-review**

Check that both languages use the same test count, route totals, chapter count, commands, known limits, and dependency versions. Remove paragraphs that duplicate chapter prose without helping setup or evaluation.

---

### Task 3: Verify documentation and assets

**Files:**
- Verify: `README.md`
- Verify: `docs/images/readme/*.png`

**Interfaces:**
- Consumes: Task 1 assets and Task 2 Markdown.
- Produces: evidence that README claims, links, commands, and images match the repository.

- [ ] **Step 1: Check formatting and whitespace**

Run:

```bash
git diff --check -- README.md docs/images/readme
```

Expected: no output and exit code 0.

- [ ] **Step 2: Verify local README targets**

Run a Node script that extracts non-HTTP Markdown targets, removes anchors, and asserts each referenced path exists. It must confirm all four images and every repository link from Task 2.

Expected: `README local targets: OK` and exit code 0.

- [ ] **Step 3: Verify commands and numeric claims against sources**

Run `pnpm exec playwright test --list` and confirm it reports `Total: 15 tests in 3 files`. Then run a Node script that reads `README.md`, `package.json`, and `data/build-report.json`. Assert:

```js
report.totals.static === 15;
report.totals.partial === 17;
report.totals.dynamic === 2;
Object.keys(packageJson.scripts).every((name) =>
  readme.includes(`pnpm ${name}`),
);
```

Expected: `README facts: OK` and exit code 0.

- [ ] **Step 4: Run project verification**

Run:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test:e2e
```

Expected: ESLint and TypeScript exit 0; Playwright reports 15 passed.

- [ ] **Step 5: Inspect final workspace scope**

Run:

```bash
git status --short
git diff --cached --name-only
```

Expected: README and four screenshot files are visible in the working tree, while the cached diff is empty. Preserve all unrelated user changes and untracked files.
