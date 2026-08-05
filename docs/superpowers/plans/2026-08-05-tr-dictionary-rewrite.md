# Turkish Dictionary Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the complete Turkish dictionary for Turkish-speaking Next.js developers and correct only the English claims that the Turkish audit proved inaccurate.

**Architecture:** Preserve the existing `Dictionary = typeof en` schema and all component call sites. Treat `en.ts` as the structural source, rewrite `tr.ts` section by section under one terminology contract, then make narrowly scoped factual corrections in both dictionaries before running structural, static, runtime, visual, and end-to-end verification.

**Tech Stack:** Next.js 16.3.0, React 19.2.8, TypeScript, localized TypeScript dictionaries, ESLint, Playwright

## Global Constraints

- Keep all 218 existing dictionary string keys and all placeholder tokens unchanged.
- Use natural Turkish syntax and address the reader as “sen.”
- Keep recognizable framework terms in English: `Suspense boundary`, `route`, `layout`, `App Shell`, `static shell`, `fallback`, `stream`, `cache`, `prefetch`, `request`, and `client navigation`.
- Never use bare “sınır” to mean a Suspense boundary.
- Preserve the distinction between `await` placement, query concurrency, Suspense fallback placement, streaming, PPR, Cache Components, and Partial Prefetching.
- Do not add chapters, routes, demos, dictionary keys, dependencies, or visual redesign work.
- Do not stage or commit `lib/dictionaries/tr.ts` or `lib/dictionaries/en.ts` during execution: both files are part of the user's currently untracked work, so committing them would capture a pre-existing baseline that is not ours.
- Use the bundled, version-matched documentation under `node_modules/next/dist/docs/` as the authority for Next.js claims.

---

### Task 1: Capture dictionary invariants and editorial audit baselines

**Files:**
- Inspect: `lib/dictionaries/tr.ts`
- Inspect: `lib/dictionaries/en.ts`
- Verify: one-off Node structural check and ripgrep editorial scans; no persistent test file

**Interfaces:**
- Consumes: the exported `en` and `tr` objects
- Produces: a recorded baseline of 218 strings per locale, identical key paths, identical placeholders, and an editorial list of phrases that must disappear

- [ ] **Step 1: Verify structural parity before editing**

Run:

```bash
node --experimental-strip-types --input-type=module - <<'NODE'
import { en } from './lib/dictionaries/en.ts'
import { tr } from './lib/dictionaries/tr.ts'

const flatten = (value, path = [], out = new Map()) => {
  if (typeof value === 'string') out.set(path.join('.'), value)
  else if (Array.isArray(value)) value.forEach((item, index) => flatten(item, [...path, String(index)], out))
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => flatten(item, [...path, key], out))
  return out
}

const enStrings = flatten(en)
const trStrings = flatten(tr)
const missing = [...enStrings.keys()].filter((key) => !trStrings.has(key))
const extra = [...trStrings.keys()].filter((key) => !enStrings.has(key))
const tokens = (text) => [...text.matchAll(/\{[^}]+\}/g)].map((match) => match[0]).sort().join(',')
const tokenMismatches = [...enStrings].filter(([key, text]) => tokens(text) !== tokens(trStrings.get(key) ?? ''))

console.log({ en: enStrings.size, tr: trStrings.size, missing, extra, tokenMismatches })
if (enStrings.size !== 218 || trStrings.size !== 218 || missing.length || extra.length || tokenMismatches.length) process.exit(1)
NODE
```

Expected: exit 0 with `en: 218`, `tr: 218`, and three empty arrays.

- [ ] **Step 2: Capture the Turkish editorial baseline**

Run:

```bash
rg -n "Migrasyondan sağ çıkan|güvenlik şekilli|ince taneli sınır|kendi takvimiyle|diskalifiye|yalnızca gerekmesi gereken|hatayı üstünü|bu sayılar gerçek değil|fazladan hiçbir maliyet" lib/dictionaries/tr.ts
```

Expected before implementation: matches are found. This is an editorial audit, not an automated behavior test; every matched phrase must be reviewed and rewritten.

- [ ] **Step 3: Capture the historical-claim audit baseline**

Run:

```bash
rg -n "Mevcut değildi|Not available|waits for the slowest query|en yavaş sorguyu bekliyordu" lib/dictionaries/tr.ts lib/dictionaries/en.ts
```

Expected before implementation: matches in the migration table. This is an editorial audit; the claims must be qualified or replaced against version-matched documentation.

---

### Task 2: Rewrite Turkish metadata, home, Suspense, and waterfall copy

**Files:**
- Modify: `lib/dictionaries/tr.ts:4-142`
- Reference: `lib/dictionaries/en.ts:4-143`
- Reference: `node_modules/next/dist/docs/01-app/02-guides/streaming.md:15-123`
- Reference: `node_modules/next/dist/docs/01-app/04-glossary.md:252-262`

**Interfaces:**
- Consumes: the existing dictionary keys used by the landing, Suspense, waterfall, lab comparison, and timeline components
- Produces: the same keys and string types with developer-first Turkish copy

- [ ] **Step 1: Rewrite metadata, navigation, and home strings**

Edit `meta`, `nav`, and `home` without moving or renaming keys. Apply these exact content decisions:

- `home.chapters.suspense.title`: say that the `Suspense boundary` determines which UI waits.
- `home.chapters.waterfall.title`: say that a `Suspense boundary` does not make queries faster.
- `home.chapters.waterfall.body`: replace “Migrasyondan sağ çıkan hata” with a direct explanation of sequential versus parallel async work.
- `home.chapters.cache.title`: use “Route’u değil, veriyi cache’e alırsın.”
- Keep CTA labels verb-first and Turkish.

- [ ] **Step 2: Rewrite the Suspense chapter**

Edit every leaf under `suspense`. Preserve these distinctions in the resulting prose:

- The blocking route awaits data before returning markup.
- The streaming route starts work and resolves it below a `Suspense boundary`.
- Only UI that is not itself blocked can enter the first response/static shell.
- A boundary changes the waiting UI and streaming unit, not query duration.
- A smaller boundary usually preserves more real UI, but avoid claiming a whole-page boundary “helps nobody.”
- Replace “shell boyandı” prose with wording that distinguishes byte arrival from render completion.

- [ ] **Step 3: Rewrite the waterfall chapter**

Edit every leaf under `waterfall`. Use “sequential” and “parallel” consistently and describe the timing result directly:

- sequential duration is approximately the sum of both waits;
- parallel duration is approximately the slower operation;
- sibling `Suspense boundary` regions resolve independently;
- remove “zero extra cost,” “hostage,” “fine-grained boundary,” and “own schedule” metaphors.

- [ ] **Step 4: Verify this section's prohibited terms are gone**

Run:

```bash
rg -n "\b[Ss]ınır(?:ı|ın|lar|ları)?\b|Migrasyondan sağ çıkan|ince taneli|rehin|kendi takvimiyle|fazladan hiçbir maliyet" lib/dictionaries/tr.ts
```

Expected: no bare “sınır” referring to Suspense and none of the prohibited calques. Any legitimate non-Suspense use must be reviewed manually rather than accepted automatically.

---

### Task 3: Rewrite Turkish cache, prefetch, migration, lab, and common copy

**Files:**
- Modify: `lib/dictionaries/tr.ts:143-401`
- Reference: `lib/dictionaries/en.ts:144-404`
- Reference: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cacheLife.md:248-272`
- Reference: `node_modules/next/dist/docs/01-app/02-guides/adopting-partial-prefetching.md`
- Reference: `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md:475-542`
- Reference: `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md:582-586`

**Interfaces:**
- Consumes: the existing keys used by CacheExplorer, PrefetchLab, BuildReportTable, lab routes, and shared lab labels
- Produces: identical keys with concise Turkish labels and accurate long-form explanations

- [ ] **Step 1: Rewrite Cache Components copy**

Edit every leaf under `cache` with these decisions:

- Use “cache’e almak” and “cache’teki değer”; do not use “cached işaretlemek.”
- Explain `stale`, `revalidate`, and `expire` in Turkish while retaining their API names.
- Replace “bayat değer” with “güncelliğini yitirmiş değer.”
- Explain “dynamic hole” as a region resolved at request time; do not present the English phrase as the explanation.
- Rewrite “security-shaped correctness bug” as a possible cross-user data isolation/security problem.
- State that `use cache: remote` requires platform support and a configured remote cache provider.
- Keep `updateTag` versus `revalidateTag` timing behavior explicit.

- [ ] **Step 2: Rewrite Partial Prefetching copy**

Edit every leaf under `prefetch` with these decisions:

- Distinguish a direct visit's static shell from a client navigation's App Shell.
- Keep `params`, `useSearchParams()`, `<Link prefetch>`, and `<Link prefetch={false}>` exact.
- Replace “these numbers are not real” with “these measurements do not represent production prefetch behavior.”
- Remove claims that URL-dependent data is simply “baked into” a shell; explain that a shared per-route App Shell cannot contain per-URL values.
- Keep all buttons and metric labels short enough for the existing 18-rem side panel.

- [ ] **Step 3: Rewrite migration copy and correct history**

Edit every leaf under `migration` with these decisions:

- Static row: explain whole-route prerender eligibility under the earlier default model without saying all earlier rendering lacked Suspense streaming.
- Dynamic row: say the route is rendered per request, but acknowledge that Suspense streaming already existed before Next.js 16.
- Partial row: state that PPR existed experimentally in Next.js 15; Next.js 16 removed the experimental flags and integrated it with Cache Components.
- Gotchas: replace “patlar,” “hata yalan söyler,” “insight belirir,” and “validation insight duvarı” with calm diagnostic wording and an actionable fix.
- Preserve exact API names and CLI commands.

- [ ] **Step 4: Rewrite lab and common labels**

Edit `lab` and `common` so labels remain short and consistent. Preserve `{count}` exactly. Prefer “ekrana geldi” or an equally precise timeline label over ambiguous “boyandı” only if the same meaning remains valid for measured byte arrival.

- [ ] **Step 5: Repeat the Turkish editorial scan**

Run:

```bash
rg -n "Migrasyondan sağ çıkan|güvenlik şekilli|ince taneli sınır|kendi takvimiyle|diskalifiye|yalnızca gerekmesi gereken|hatayı üstünü|bu sayılar gerçek değil|fazladan hiçbir maliyet|bayat bir değer|dynamic hole olur" lib/dictionaries/tr.ts
```

Expected: no output.

---

### Task 4: Correct inherited English technical claims

**Files:**
- Modify: `lib/dictionaries/en.ts:54, 137, 223-224, 258-259, 282-303`
- Reference: `node_modules/next/dist/docs/01-app/02-guides/streaming.md:15-47`
- Reference: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md:38-46`
- Reference: `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md:582-586`

**Interfaces:**
- Consumes: the English source dictionary type and the factual corrections already expressed in Turkish
- Produces: the same English dictionary shape with corrected shared claims

- [ ] **Step 1: Correct the first-response and boundary-cost absolutes**

Qualify `suspense.lede` so the first response contains content outside the boundary that can render without unresolved async work. Rewrite `waterfall.independent.body` so sibling boundaries resolve independently without claiming they have literally no cost.

- [ ] **Step 2: Correct remote cache and development prefetch claims**

Change `cache.serverless.body` to make platform support/configuration explicit. Change `prefetch.demo.copy.devWarning` to say development measurements are not representative of production prefetch behavior, rather than “not real.”

- [ ] **Step 3: Correct the migration history table**

Rewrite the dynamic and partial “Before 16” cells so they state:

- Suspense streaming already worked for request-rendered routes before Next.js 16.
- Experimental PPR existed in Next.js 15.
- Next.js 16 removed the experimental flags and made PPR part of Cache Components.

- [ ] **Step 4: Repeat the English historical-claim editorial scan**

Run:

```bash
rg -n "Not available|waits for the slowest query before seeing anything at all|These numbers are not the real ones|fixes it|cost nothing extra" lib/dictionaries/en.ts
```

Expected: no output.

---

### Task 5: Verify structure, rendering, layout, and behavior

**Files:**
- Verify: `lib/dictionaries/tr.ts`
- Verify: `lib/dictionaries/en.ts`
- Verify: all `/tr` chapter routes and existing Playwright scenarios

**Interfaces:**
- Consumes: the rewritten dictionaries
- Produces: evidence that the rewrite preserved schema, UI behavior, and technical claims

- [ ] **Step 1: Re-run structural parity and placeholder validation**

Run the exact Node script from Task 1 Step 1.

Expected: exit 0 with 218 strings in each locale, no missing/extra keys, and no placeholder mismatches.

- [ ] **Step 2: Run static checks**

Run:

```bash
pnpm exec tsc --noEmit
pnpm lint
```

Expected: both commands exit 0.

- [ ] **Step 3: Run a production build**

Run:

```bash
pnpm build
```

Expected: exit 0 and the documented static/partial/dynamic route mix remains present.

- [ ] **Step 4: Run the existing end-to-end suite**

Run:

```bash
pnpm test:e2e
```

Expected: all existing Playwright tests pass.

- [ ] **Step 5: Verify Turkish routes visually at desktop and narrow widths**

Start the production server with `pnpm start`, then inspect these routes at approximately 1440×1000 and 390×844:

```text
/tr
/tr/suspense
/tr/waterfall
/tr/cache
/tr/prefetch
/tr/migration
```

Expected: no horizontal overflow, clipped controls, unreadable table cells, awkward single-word heading wraps, or English fallback copy outside exact technical terms.

- [ ] **Step 6: Review the final diff without staging user work**

Run:

```bash
git diff -- lib/dictionaries/tr.ts lib/dictionaries/en.ts
git status --short
```

Expected: only the intended dictionary content changed within the implementation scope; no target file is staged or committed.
