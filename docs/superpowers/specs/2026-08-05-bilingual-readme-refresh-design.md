# Bilingual README Refresh Design

**Date:** 2026-08-05  
**Status:** Approved for specification review

## Goal

Rebuild `README.md` as an accurate, concise, bilingual introduction to Instant Lab. The English section appears first and the Turkish section follows in the same file. Both sections describe the same product and technical claims in their own language, use current production screenshots, and point developers toward running the application rather than duplicating every chapter in the repository.

## Audience

- Developers evaluating the Next.js 16.3 rendering model.
- Developers looking for runnable examples of Suspense, Cache Components, Partial Prerendering, and Partial Prefetching.
- Turkish-speaking developers who should receive the same technical depth as English-speaking readers.

## Information Architecture

The document starts with language jump links:

```text
English · Türkçe
```

The English section comes first, followed by a clear divider and the complete Turkish section. Each language uses the same section order:

1. Product name and one-paragraph value proposition.
2. Localized overview screenshot.
3. Quick start.
4. What the project proves.
5. Localized Waterfall/code comparison screenshot.
6. Five-chapter summary.
7. How timing is measured.
8. One-build/three-rendering-mode summary.
9. Verification and Playwright coverage.
10. Commands, known limits, stack, and licence.

The Turkish section is not a shortened translation. It carries the same facts and actionable instructions as the English section while using the developer-oriented terminology established in `lib/dictionaries/tr.ts`.

## Screenshot Set

Capture four screenshots from a fresh production build at a 1440 px desktop viewport:

- `docs/images/readme/overview-en.png` — `/en`, showing the opening product statement.
- `docs/images/readme/waterfall-en.png` — `/en/waterfall`, focused on the paired code comparison.
- `docs/images/readme/overview-tr.png` — `/tr`, showing the localized opening statement.
- `docs/images/readme/waterfall-tr.png` — `/tr/waterfall`, focused on the paired code comparison.

Screenshots must show the current application UI without browser chrome or development overlays. The Waterfall captures must make the corrected equal-height editors and aligned captions visible. Images use stable relative Markdown paths so GitHub renders them without repository-specific URLs.

## Copy Principles

- Lead with the outcome: real routes, real streaming, and timings read from the arriving stream.
- Prefer developer vocabulary already used by the application; do not translate established API names or framework primitives.
- Keep paragraphs short and remove claims that merely repeat chapter content.
- Use descriptive links and exact commands.
- Keep English and Turkish claims semantically equivalent without forcing sentence-by-sentence literal translation.
- State limitations next to the workflow they affect, especially production-only prefetch measurement.

## Source of Truth

README facts are derived from the current repository:

- `package.json` for scripts and dependency versions.
- `next.config.ts` for active framework features.
- `data/build-report.json` for the 15 static / 17 partial / 2 dynamic distribution.
- `e2e/` for the current 15-test Playwright suite and its coverage.
- `lib/dictionaries/en.ts` and `lib/dictionaries/tr.ts` for product voice and terminology.

The README will say that 15 Playwright tests run against a production build. It will distinguish the original instant-navigation claims from the newer layout and interaction regressions.

## Validation

After implementation:

1. Build and serve the production application used for screenshots.
2. Confirm every screenshot file exists, opens correctly, and has the intended 1440 px width.
3. Verify every relative README link resolves to an existing file.
4. Verify every documented `pnpm` command exists in `package.json`.
5. Compare stated dependency versions, test count, and route-mode totals with their source files.
6. Render or inspect the final Markdown structure to confirm language jump links and image paths work.
7. Run the relevant project verification commands before completion.

## Scope Boundaries

- Do not change application UI or dictionary content as part of the README refresh.
- Do not add repository badges that require an unknown or hard-coded remote URL.
- Do not create a separate `README.tr.md`; both languages remain in `README.md`.
- Do not stage unrelated modified or untracked files.
