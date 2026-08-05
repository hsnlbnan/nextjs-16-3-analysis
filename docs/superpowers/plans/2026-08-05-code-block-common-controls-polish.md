# Code Block and Common Controls Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove duplicate Shiki line spacing, align paired code editors to one desktop height, and apply verified low-risk polish to the application's primary shared controls.

**Architecture:** Preserve `CodeBlock` as an async Server Component and correct only the layout of its existing Shiki HTML. Use content-driven grid stretching rather than fixed heights, add restrained press feedback to the two primary actions, narrow the one rendered `transition-all`, and report broader shared-control findings without redesigning them.

**Tech Stack:** Next.js 16.3.0 App Router, React 19.2.8, TypeScript, Tailwind CSS v4, Shiki 4.4.1, Playwright 1.62.1

## Global Constraints

- Preserve the existing dark visual language, Tailwind styling system, component library, content hierarchy, routes, and application behavior.
- Do not add features, routes, dependencies, themes, or unrelated copy changes.
- Do not use a fixed height for code or localized text containers.
- Desktop paired editors must share one row height; narrow layouts must keep natural per-editor heights.
- Keep filename rows at the top, captions at the bottom, and code horizontally scrollable inside its own surface.
- Preserve Shiki highlighting, `use cache`, `cacheLife("max")`, and every existing `CodeBlock` prop.
- Use `scale(0.96)` only for the primary CTA and Run button; do not animate high-frequency preset, reset, slider, or navigation controls.
- Never introduce `transition-all`; list the exact transitioning properties.
- Treat shared UI primitives that are not rendered by current routes as review findings, not implementation scope.
- Do not stage or commit application, test, or plan files: they belong to the user's currently untracked work. The already committed design spec remains the only commit for this task.
- Read the version-matched guides `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` and `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md` before editing production code.

---

### Task 1: Add failing code-block layout regressions

**Files:**
- Create: `e2e/code-block-layout.spec.ts`
- Reference: `app/globals.css:194-210`
- Reference: `components/code-block.tsx:21-62`
- Reference: `app/[locale]/(site)/waterfall/page.tsx:58-70`

**Interfaces:**
- Consumes: the production `/tr/waterfall` route and its existing filename/caption text
- Produces: two Playwright regressions for equal paired height, aligned captions, and one line box per Shiki source line

- [ ] **Step 1: Read the version-matched CSS and Playwright guides**

Run:

```bash
sed -n '1,240p' node_modules/next/dist/docs/01-app/01-getting-started/11-css.md
sed -n '1,240p' node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md
```

Expected: the local Next.js 16.3 docs confirm global CSS is imported from the root layout and Playwright should exercise a built application.

- [ ] **Step 2: Create the focused regression file**

Create `e2e/code-block-layout.spec.ts` with:

```ts
import { expect, test, type Locator, type Page } from "@playwright/test";

function codeFigure(page: Page, filename: string): Locator {
  return page.locator("figure").filter({
    has: page.getByText(filename, { exact: true }),
  });
}

test.describe("code block layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/tr/waterfall");
  });

  test("paired examples share a desktop height and caption baseline", async ({
    page,
  }) => {
    const sequential = codeFigure(
      page,
      "app/[locale]/lab/sequential/page.tsx",
    );
    const parallel = codeFigure(
      page,
      "app/[locale]/lab/parallel/page.tsx",
    );

    await expect(sequential).toBeVisible();
    await expect(parallel).toBeVisible();

    const [sequentialBox, parallelBox, sequentialCaption, parallelCaption] =
      await Promise.all([
        sequential.boundingBox(),
        parallel.boundingBox(),
        sequential.locator("figcaption").boundingBox(),
        parallel.locator("figcaption").boundingBox(),
      ]);

    if (
      !sequentialBox ||
      !parallelBox ||
      !sequentialCaption ||
      !parallelCaption
    ) {
      throw new Error("Expected both code figures and captions to be visible");
    }

    expect(Math.abs(sequentialBox.height - parallelBox.height)).toBeLessThan(1);
    expect(
      Math.abs(
        sequentialCaption.y + sequentialCaption.height -
          (parallelCaption.y + parallelCaption.height),
      ),
    ).toBeLessThan(1);
  });

  test("each Shiki source line occupies one line box", async ({ page }) => {
    const metrics = await codeFigure(
      page,
      "app/[locale]/lab/sequential/page.tsx",
    )
      .locator("pre")
      .evaluate((pre) => {
        const lineHeight = Number.parseFloat(getComputedStyle(pre).lineHeight);
        return {
          height: pre.getBoundingClientRect().height,
          lineCount: pre.querySelectorAll(".line").length,
          lineHeight,
        };
      });

    expect(metrics.height).toBeCloseTo(
      metrics.lineCount * metrics.lineHeight,
      0,
    );
  });
});
```

- [ ] **Step 3: Run the focused tests and verify the red state**

Run:

```bash
pnpm exec playwright test e2e/code-block-layout.spec.ts --project=chromium
```

Expected: two failures. The height assertion reports approximately 653 px versus 735 px, and the line-box assertion reports approximately 557 px versus 14 × 20.625 px.

---

### Task 2: Correct Shiki rhythm and paired editor alignment

**Files:**
- Modify: `app/globals.css:194-210`
- Modify: `components/code-block.tsx:36-59`
- Modify: `app/[locale]/(site)/waterfall/page.tsx:58-70`
- Modify: `app/[locale]/(site)/suspense/page.tsx:54-66`
- Test: `e2e/code-block-layout.spec.ts`

**Interfaces:**
- Consumes: Shiki's existing `<pre><code><span class="line">…` HTML and `CodeBlock` props
- Produces: a content-driven full-height `CodeBlock` surface that stretches only when its grid row is taller

- [ ] **Step 1: Remove the duplicate Shiki line-box rule**

Delete only this rule from `app/globals.css`:

```css
.shiki-host .line {
  display: block;
  min-height: 1lh;
}
```

Keep the `.shiki-host pre` and `.shiki-host code` rules unchanged. The `<pre>` element's preserved newline nodes become the single source of vertical line rhythm.

- [ ] **Step 2: Make `CodeBlock` a full-height flex surface**

Change the figure class in `components/code-block.tsx` to:

```tsx
"border-border/60 bg-card/40 flex h-full flex-col overflow-hidden rounded-lg border"
```

Change the highlighted-code container class to:

```tsx
"shiki-host min-h-0 flex-1 overflow-x-auto px-3.5 py-3 text-[12.5px] leading-[1.65]"
```

Do not change the filename row, caption row, HTML generation, or component props.

- [ ] **Step 3: Stretch both paired comparison grids**

In both `waterfall/page.tsx` and `suspense/page.tsx`, replace:

```tsx
<div className="grid items-start gap-4 lg:grid-cols-2">
```

with:

```tsx
<div className="grid items-stretch gap-4 lg:grid-cols-2">
```

- [ ] **Step 4: Run the focused tests and verify the green state**

Run:

```bash
pnpm exec playwright test e2e/code-block-layout.spec.ts --project=chromium
```

Expected: 2 passed. The two Waterfall figures and caption bottoms differ by less than 1 px, and `<pre>` height matches line count × computed line-height.

- [ ] **Step 5: Verify responsive editor behavior without adding fixed heights**

Run a Playwright browser check against `/tr/suspense` and `/tr/waterfall` at 1440×1000, 1024×900, and 390×844. Record for every code figure: figure height, caption bottom, document `scrollWidth`, and document `clientWidth`.

Expected:

- At 1440 px and 1024 px, each paired row has equal figure heights and aligned caption bottoms.
- At 390 px, editors stack, each retains its content-driven height, and `scrollWidth === clientWidth` for the document.
- Long code remains scrollable within `.shiki-host` rather than expanding the page.

---

### Task 3: Add restrained primary-control feedback

**Files:**
- Create: `e2e/control-polish.spec.ts`
- Modify: `app/[locale]/(site)/page.tsx:26-32,57-77`
- Modify: `components/lab/lab-comparison.tsx:142-166`

**Interfaces:**
- Consumes: the existing home CTA at `/tr/suspense`, chapter-row arrow icons, and the LabComparison Run button
- Produces: `0.96` press feedback on primary actions and exact transition properties on the rendered chapter arrows

- [ ] **Step 1: Write failing interaction-polish tests**

Create `e2e/control-polish.spec.ts` with:

```ts
import { expect, test, type Locator, type Page } from "@playwright/test";

async function activeScale(page: Page, control: Locator): Promise<string> {
  await control.scrollIntoViewIfNeeded();
  const box = await control.boundingBox();
  if (!box) throw new Error("Expected control to have a bounding box");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const scale = await control.evaluate((element) => getComputedStyle(element).scale);
  await page.mouse.up();
  return scale;
}

test.describe("primary control polish", () => {
  test.use({ reducedMotion: "reduce" });

  test("the home CTA has restrained press feedback", async ({ page }) => {
    await page.goto("/tr");
    const cta = page.locator('a[href="/tr/suspense"]').first();

    await expect(cta).toBeVisible();
    expect(await activeScale(page, cta)).toBe("0.96");
  });

  test("the lab Run button has restrained press feedback", async ({ page }) => {
    await page.goto("/tr/suspense");
    const run = page.getByRole("button", { name: "İkisini çalıştır" });

    await expect(run).toBeVisible();
    expect(await activeScale(page, run)).toBe("0.96");
  });

  test("chapter arrows do not transition every CSS property", async ({ page }) => {
    await page.goto("/tr");
    const arrow = page
      .locator('a[href="/tr/suspense"]')
      .last()
      .locator("svg");

    await expect(arrow).toBeVisible();
    expect(await arrow.evaluate((icon) => getComputedStyle(icon).transitionProperty))
      .not.toBe("all");
  });
});
```

- [ ] **Step 2: Run the focused tests and verify the red state**

Run:

```bash
pnpm exec playwright test e2e/control-polish.spec.ts --project=chromium
```

Expected: three failures. Both active scale values are `none`, and the chapter arrow transition property is `all`.

- [ ] **Step 3: Add press feedback to the home CTA**

In `app/[locale]/(site)/page.tsx`, replace the CTA transition class with this exact property list and active state:

```tsx
className="bg-foreground text-background hover:bg-foreground/90 mt-10 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-[color,background-color,scale] active:scale-[0.96]"
```

- [ ] **Step 4: Narrow the rendered chapter-arrow transition**

Replace the chapter-row `ArrowRight` class with:

```tsx
className="text-muted-foreground/40 group-hover:text-lab-instant mt-1 size-4 shrink-0 transition-[color,translate] group-hover:translate-x-0.5"
```

- [ ] **Step 5: Add press feedback to the LabComparison primary action**

Replace the Run button class in `components/lab/lab-comparison.tsx` with:

```tsx
className="bg-foreground text-background hover:bg-foreground/90 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-[background-color,opacity,scale] enabled:active:scale-[0.96] disabled:opacity-55"
```

Do not add scale transitions to the latency presets, reset action, slider, nav links, or other high-frequency controls.

- [ ] **Step 6: Run both focused suites and verify the green state**

Run:

```bash
pnpm exec playwright test e2e/code-block-layout.spec.ts e2e/control-polish.spec.ts --project=chromium
```

Expected: 5 passed, with computed active scale `0.96` for both primary controls and a non-`all` transition property for the chapter arrow.

---

### Task 4: Review common controls and verify the complete application

**Files:**
- Review: `components/site-header.tsx`
- Review: `components/chapter.tsx`
- Review: `components/lab/lab-comparison.tsx`
- Review: `components/lab/cache-explorer.tsx`
- Review: `components/lab/prefetch-lab.tsx`
- Review: `components/ui/button.tsx`
- Review: `components/ui/toggle.tsx`
- Review: `components/ui/tabs.tsx`
- Review: `components/ui/badge.tsx`
- Review: `components/ui/accordion.tsx`
- Review: `components/ui/switch.tsx`
- Verify: all six `/tr` public routes and both new Playwright files

**Interfaces:**
- Consumes: the final rendered application and all shared-control source classes
- Produces: verified build/test evidence plus a standalone `better-ui` findings report with implemented and remaining findings separated

- [ ] **Step 1: Run the systemic source audit**

Run:

```bash
rg -n "transition-all|will-change-all|active:.*scale|rounded-|shadow-|border-|overflow-x-auto|scrollbar-none" components app --glob "*.tsx" --glob "*.css"
```

Classify each actual rendered occurrence using the approved design. Do not modify unused UI primitives during this pass. Record their actionable `transition-all` uses as one consolidated shared-primitives finding rather than one row per file.

- [ ] **Step 2: Walk shared-control states at slowed motion**

Use Playwright with a Chromium DevTools Protocol session and:

```ts
await cdp.send("Animation.setPlaybackRate", { playbackRate: 0.1 });
```

Inspect at least:

- Home CTA: default, hover, focus-visible, active.
- Chapter row: default and hover arrow transition.
- Header chapter nav and locale switcher: default, hover, active/current, keyboard focus.
- Lab toolbar: latency presets, slider focus, Run active/loading/disabled, Reset after completion.
- External-route icon: hover and keyboard focus.

Expected: transitions remain interruptible, primary press scale reaches `0.96`, high-frequency controls do not gain custom motion, and focus styling remains visible. Repeat the primary actions with reduced motion enabled and verify the global rule reduces transition duration to approximately `0.01ms`.

- [ ] **Step 3: Inspect responsive routes and navigation discoverability**

Inspect `/tr`, `/tr/suspense`, `/tr/waterfall`, `/tr/cache`, `/tr/prefetch`, and `/tr/migration` at 1440×1000, 1024×900, and 390×844.

For every viewport, verify document `scrollWidth === clientWidth`. At 390 px, record whether the horizontally scrollable chapter nav communicates that more items exist; if not, keep the layout unchanged and report it as a `MEDIUM` “Hint at hidden content” finding.

Expected: no page-level overflow or clipped critical action. Internal code/table scrollers may overflow only inside their own bounded surface.

- [ ] **Step 4: Run static verification**

Run:

```bash
pnpm exec tsc --noEmit
pnpm lint
```

Expected: both exit 0 with no TypeScript or ESLint errors.

- [ ] **Step 5: Run a production build**

Run:

```bash
pnpm build
```

Expected: exit 0. The existing `metadataBase` warning may remain; no new warnings may be introduced.

- [ ] **Step 6: Run the full end-to-end suite**

Run:

```bash
pnpm test:e2e
```

Expected: the existing 10 behavior tests plus the 5 new UI regressions pass, for 15 total passing tests and zero failures.

- [ ] **Step 7: Check final working-tree scope**

Run:

```bash
git status --short
git diff --cached --name-only
```

Expected: no staged files. Changes remain limited to the two new E2E files, `app/globals.css`, `components/code-block.tsx`, the Suspense and Waterfall pages, the home page, and `components/lab/lab-comparison.tsx`, alongside the user's pre-existing work.

- [ ] **Step 8: Deliver the standalone UI-polish review**

Group confirmed findings by the applicable `better-ui` principle. Use a table with `Severity`, `Location`, `Before`, `After`, and `Why` columns. Mark the duplicate editor spacing, unequal paired heights, primary press feedback, and rendered `transition-all` as implemented. Consolidate remaining unused shared-primitives `transition-all` occurrences. Report the mobile navigation discovery issue only if the 390 px inspection confirms it.

End with:

- Exact verification commands and observed pass counts.
- Which viewport and interaction states were inspected.
- `Approve` only if no actionable findings remain; otherwise `Needs changes` when only `MEDIUM` or `LOW` findings remain.
