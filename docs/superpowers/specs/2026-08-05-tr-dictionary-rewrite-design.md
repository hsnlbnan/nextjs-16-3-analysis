# Turkish dictionary rewrite — design

**Date:** 2026-08-05
**Status:** approved for planning
**Scope:** `lib/dictionaries/tr.ts`, with narrowly required factual corrections in `lib/dictionaries/en.ts`

## Objective

Rewrite all existing Turkish interface and editorial copy so it reads like a technical article written for Turkish-speaking Next.js developers, not a literal translation from English.

The rewrite must preserve the dictionary schema and the behavior of every demo. Where the Turkish review exposed a factual problem inherited from the English source, correct both languages so they continue to teach the same, accurate model.

## Audience and voice

The reader already writes React and Next.js code. Copy may assume familiarity with JSX, `await`, `<Suspense>`, route segments, caching, streaming, and client navigation.

The voice is:

- direct, technically precise, and conversational;
- compact enough for an interactive lab;
- confident without using unqualified absolutes;
- written in natural Turkish syntax rather than translated English syntax.

The copy addresses the reader as “sen,” matching the current product voice. Buttons and short UI instructions remain concise and action-oriented.

## Terminology contract

Framework concepts that developers recognize primarily by their English names stay in English:

- `Suspense boundary`
- `route`, `layout`, `App Shell`, `static shell`
- `fallback`, `stream`, `cache`, `prefetch`
- `request`, `client navigation`
- API, directive, config, component, and file names exactly as written in code

Natural Turkish words remain Turkish where they are clearer: sorgu, istemci, sunucu, gecikme, zamanlama, bölüm, veri, istek sonucu, önceden oluşturma açıklamaları.

Hybrid adjective constructions such as “cached işaretlemek,” “dynamic hole olmak,” and “static içerik” are rewritten as complete Turkish clauses: “cache’e almak,” “request sırasında çözülen bölge,” and “statik olarak üretilebilen içerik.”

The same concept uses the same term everywhere. In particular, bare “sınır” is not used for a Suspense boundary.

## Conceptual distinctions the copy must preserve

1. `await` placement determines where execution waits. Sequential versus parallel work affects completion time.
2. A `Suspense boundary` determines which UI can render independently and which fallback is shown while async work resolves. It does not make the underlying query faster.
3. Streaming existed before Next.js 16. Next.js 16 did not invent Suspense streaming.
4. Experimental Partial Prerendering existed in Next.js 15. Next.js 16 removed the experimental flags and made PPR part of the Cache Components model.
5. Development-mode prefetch measurements are real measurements, but they do not represent production prefetch behavior because prefetching is disabled in development.
6. `use cache: remote` depends on a deployment platform and configured remote cache provider; the copy must not promise that the directive alone always fixes persistence.
7. Statements about what reaches the first response apply only to UI that is not itself blocked by unresolved async work.

## Rewrite scope

### Turkish dictionary

Review and rewrite every one of the 218 string leaves in `lib/dictionaries/tr.ts`, including:

- metadata and navigation;
- the home page and chapter cards;
- Suspense and waterfall chapters;
- Cache Components explorer and live demo;
- Partial Prefetching chapter;
- migration tables and gotchas;
- lab labels, warnings, actions, and empty states.

Strings that are already correct may remain unchanged, but each must be evaluated against this design rather than assumed correct.

### English dictionary

Do not stylistically rewrite all English copy in this pass. Change English only when needed to keep a shared technical claim accurate or to keep the two dictionaries semantically aligned after a factual correction. At minimum, review the claims about pre-16 streaming, experimental PPR availability, development prefetch measurements, and remote cache persistence.

### Out of scope

- Adding new chapters, routes, demos, or dictionary keys for currently uncovered Next.js 16.3 features
- Refactoring React components or the i18n loader
- Changing demo timings or measurement mechanics
- Redesigning the visual interface

The earlier audit identified missing UI coverage for Root Params, `catchError`, and `import.meta.glob`; that is a separate product-content task because it requires new UI structure rather than a dictionary rewrite.

## Validation

The completed rewrite must pass all of the following:

1. English and Turkish dictionaries have identical key shapes.
2. Placeholder tokens such as `{count}` match across languages.
3. TypeScript and ESLint pass.
4. Relevant technical claims match the bundled Next.js 16.3 documentation in `node_modules/next/dist/docs/`.
5. Every Turkish route renders without runtime errors.
6. Desktop and narrow-width screenshots show no broken labels, unusable wrapping, or overflowing controls.
7. The existing Playwright suite continues to pass because copy changes must not alter demo behavior.

## Acceptance criteria

- A Turkish-speaking Next.js developer can identify every framework concept without reverse-translating it into English.
- No sentence depends on literal English idioms such as “survives the migration,” “security-shaped,” or “holds it hostage.”
- No historical claim says PPR or streaming was unavailable before Next.js 16.
- No warning calls a real development measurement “fake”; it explains that the measurement is not production-representative.
- No claim promises zero cost or a deployment-independent cache fix.
- Existing dictionary types, placeholders, routes, demos, and tests remain intact.
