# Instant Lab — design

**Date:** 2026-08-05
**Status:** approved, in implementation
**Target:** Next.js 16.3.0, React 19.2.8, Tailwind v4, shadcn/ui

## What this is

A single Next.js 16.3 application that teaches the 16.3 rendering model — Suspense boundaries,
Partial Prerendering, Cache Components, Partial Prefetching — by **running real routes and
measuring them**, not by animating a story about them.

It ships as a public GitHub repo and is meant to be shared on LinkedIn. Credibility is the
product: every timing on the page comes from a real render, and the repo's own e2e suite
asserts the claims it makes.

## Non-negotiables

1. **No simulated timings.** Every number shown next to a demo is measured from a real
   navigation to a real route in this app.
2. **The app dogfoods what it teaches.** `cacheComponents: true` and `partialPrefetching: true`
   are on. The chapter pages themselves are static shells.
3. **Honesty about limits is content, not a footnote.** Where a demo cannot be truthful
   (prefetching is disabled in `next dev`; `use cache` is in-memory per instance on
   serverless), the UI says so in place.

## Verified 16.3 API surface

Checked against `node_modules/next/dist/docs/` (version-matched, bundled with next@16.3.0).

| Concern | Truth |
| --- | --- |
| Flags | `cacheComponents: true` and `partialPrefetching: true` are separate opt-ins |
| Root params | `import { locale } from 'next/root-params'` → `await locale()`. Server Components only — not Client Components, Server Actions, Route Handlers, or `unstable_cache`. Works inside `use cache`, and only the getters actually called join the cache key. |
| Root params + Cache Components | `generateStaticParams` on the root layout is **required**; each root param needs ≥1 value or the build fails |
| `instant` | `export const instant = false` opts a segment out of instant-navigation *validation*. Docs: "For opted-out segments, the navigation blocks on the server." |
| Validation | On by default in dev (`validationLevel: 'warning'`); never blocks the build. `'manual-warning'` restricts it to segments that export `instant`. |
| Incremental prefetch adoption | `export const prefetch = 'partial'` per route; `npx @next/codemod remove-partial-prefetch ./app` afterwards |
| Static shell vs App Shell | Direct visit → static shell as HTML. Client navigation → App Shell, shared per route across all links to it. **Same route, two different initial UIs.** |
| `cacheLife` prerendering thresholds | `revalidate: 0` or `expire` < 5min → excluded from prerender (dynamic hole). `stale` < 30s → excluded from prerender. `stale` 30s–5min → prerendered but **not** in the App Shell. Of the presets only `seconds` crosses a threshold. |
| Client cache | `x-nextjs-stale-time` response header; 30s client minimum enforced; `revalidateTag`/`updateTag`/`refresh` from a Server Action clears the whole client cache immediately |
| Testing | `@next/playwright` `instant(page, fn, { baseURL })`; `experimental.exposeTestingApiInProductionBuild` to run against `next start` |
| Also new in 16.3 | `catchError` from `next/error` (retryable error boundary), `import.meta.glob` in Turbopack |

## Architecture

### Route tree

Everything lives under `[locale]` so that it sits above the root layout and therefore
qualifies as a root param.

```
app/
  [locale]/
    layout.tsx            root layout, <html lang={await locale()}>, generateStaticParams
    page.tsx              landing / essay
    suspense/page.tsx     chapter 1
    waterfall/page.tsx    chapter 2
    cache/page.tsx        chapter 3
    prefetch/page.tsx     chapter 4
    migration/page.tsx    chapter 5
    lab/
      layout.tsx          bare chrome, iframe-safe
      blocking/           export const instant = false — awaits at the top, really blocks
      streaming/          Suspense boundary — shell + stream
      sequential/         await a; await b
      parallel/           Promise.all
      boundaries/         two independent boundaries, different latencies
      cached/             use cache + cacheLife + cacheTag, with updateTag/revalidateTag actions
      store/[slug]/       mini store for the prefetch chapter
```

`/` → `/en` via `redirects()` in `next.config.ts`. **No middleware, no `headers()` read** — which
is itself the root-params argument: the lazy `headers()` getter that i18n libraries use is what
makes every route request-bound.

### Measurement engine

The core primitive is a marker that rides inside the RSC stream:

```tsx
function Marker({ phase }: { phase: Phase }) {
  return <script dangerouslySetInnerHTML={{ __html: `__lab(${JSON.stringify(phase)})` }} />
}
```

An inline `<script>` inside a streamed chunk executes the moment that chunk reaches the browser —
before hydration, before React does anything. So:

- `<Marker phase="shell" />` outside every boundary fires when the shell HTML lands.
- `<Marker phase="data" />` inside a boundary fires when that boundary's chunk streams in.
- `complete` fires on `window.load`.

What this measures is byte arrival, not hydration. That is the only defensible thing to measure.

Timings are relative to `performance.timeOrigin` of the iframe document and posted to the parent
with `postMessage`. `LabFrame` (client component) owns the iframe, listens, and draws the timeline.

Latency is injected server-side with `await sleep(ms)` inside the loader, where `ms` comes from the
demo route's own `searchParams`. Copy states plainly: the latency is added, the streaming is not.

### Throttle panel

Per-chapter sticky control bar: latency slider (0–2000ms), chapter-specific mode toggles, "Run
both", "Reset". State is client-side and feeds the iframe `src`. The chapter page around it stays a
fully static shell — a claim the repo's own e2e suite verifies.

## Chapters

1. **Suspense — where the await goes.** `/lab/blocking` vs `/lab/streaming`, side by side, real.
   Plus a client-side interactive diagram (labelled as a diagram, not a measurement) for moving the
   boundary through the tree and seeing what lands in the first response.
2. **Sequential vs parallel.** Identical boundaries, only the awaits differ. The lesson that
   survives the migration wrong: a boundary does not make a query faster.
3. **`use cache` + `cacheLife`.** An explorer over `stale`/`revalidate`/`expire` that surfaces the
   documented prerendering thresholds (prerendered? in the App Shell? dynamic hole?), plus a live
   route with a cached server timestamp and two Server Actions: `updateTag()` (changes in the same
   request) vs `revalidateTag()` (changes on the next load).
4. **Partial Prefetching.** `<Link>` vs `<Link prefetch>` vs `<Link prefetch={false}>` in three
   columns, with real request counts and transfer sizes read from
   `performance.getEntriesByType('resource')` inside the frame. Explains static shell vs App Shell.
   Detects `next dev` and says outright that prefetching is disabled there.
5. **Migration — old vs new.** The comparison table, the gotchas, and a route table generated by
   `scripts/build-report.mjs` from a real `next build`. Because `/lab/blocking` and `/lab/streaming`
   are in the same build, that table is a genuine before/after without a second app.

## Design language

Editorial and technical. Near-black ground, one accent for "instant" and a separate warning tone for
"blocking", tabular numerals on every timing, ~68ch measure for prose and full-bleed for demos.
Geist + Geist Mono. shadcn/ui on Tailwind v4 with OKLCH tokens. Honors `prefers-reduced-motion`.

## Testing

`@next/playwright`:

- `/lab/streaming` **is** instant, on both page load and client navigation.
- `/lab/blocking` is **not** — asserted, so the contrast is a tested fact.
- Each chapter page's shell contains its prose and controls before any demo runs.

CI runs `next build` then the suite against `next start` with
`experimental.exposeTestingApiInProductionBuild`.

## Known limits, stated in the UI

- **Prefetching is off in `next dev`.** Chapter 4 is only truthful against `next build && next start`
  or a deployment. The UI detects and says so.
- **`use cache` is per-instance in memory on serverless.** The chapter 3 live demo uses
  `use cache: remote` and explains the distinction rather than hiding it.

## Phases

0. Scaffold, flags, `[locale]` root layout, design system
1. Measurement engine: markers, `LabFrame`, timeline, throttle panel
2. Chapters 1 and 2
3. Chapter 3
4. Chapter 4 and 5, build report script
5. Landing essay, EN/TR content, OG image, e2e, CI, README
