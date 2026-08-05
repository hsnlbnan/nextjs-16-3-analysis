# Code Block and Common Controls Polish Design

**Date:** 2026-08-05

## Goal

Fix the excessive vertical spacing and mismatched heights in side-by-side code samples, then review and safely polish the shared controls used throughout the Turkish chapter routes.

The work preserves the existing dark visual language, Tailwind styling system, component library, content hierarchy, routes, and application behavior.

## Scope

### Implement

- Correct Shiki line rendering so source lines occupy one line box instead of two.
- Make paired code blocks the same height on multi-column layouts.
- Keep filenames aligned at the top and captions aligned at the bottom.
- Preserve natural, content-driven heights when code blocks stack on narrow screens.
- Apply confirmed low-risk, systemic polish fixes to shared controls when they do not change layout structure or product behavior.

### Review

- Site header and horizontally scrollable chapter navigation.
- Locale switcher and repository link.
- Primary and chapter navigation calls to action.
- Lab comparison toolbar, sliders, links, and run controls.
- Shared `CodeBlock`, button, toggle, tabs, badge, switch, and select surfaces.
- Hover, focus, active, disabled, loading, and reduced-motion states where present.

### Exclude

- New features, routes, dependencies, or visual themes.
- Copy changes unrelated to a visual defect.
- Large layout redesigns or product behavior changes.
- Accessibility or color-system remediation beyond noting an issue that materially affects the UI-polish review.
- Staging or committing the user's existing untracked application files.

## Confirmed Root Cause

Shiki emits every highlighted source line as a `.line` span and also emits newline text nodes between those spans. The global rule that changes `.shiki-host .line` to `display: block` causes both the block boundary and the preserved newline to consume vertical space. In the current Waterfall comparison, the first two code figures consequently render at approximately 653 px and 735 px at a 1478 px viewport.

The comparison grid also uses `items-start`, so its children keep those different intrinsic heights instead of stretching to the shared row height.

## Design

### Code rendering

Remove the rule that turns Shiki line spans into block boxes. Let the `<pre>` element's preserved newlines define the source-code rhythm. Keep the existing monospaced font, syntax theme, horizontal scrolling, readable font size, and compact line-height.

Do not remove intentional blank lines from the snippets. Once the duplicate line boxes are gone, those blank lines again represent a single source line and communicate code grouping correctly.

### Equal-height comparison

Make `CodeBlock` a full-height vertical flex surface. Its filename row remains at the top, the highlighted-code region grows to consume available height, and the caption stays at the bottom.

Change side-by-side code comparison grids from start alignment to stretch alignment. The taller source sample determines the row height; the shorter block expands without inventing a fixed height. In the single-column layout, each grid row retains its own content-driven height.

This behavior applies to both the Suspense and Waterfall paired comparisons through the shared component pattern.

### Shared-control polish

Review shared controls against these rules:

- Preserve existing design tokens, radii, density, and semantic colors.
- Use borders for structural separation and avoid adding decorative elevation without need.
- Replace `transition-all` only where a narrower property list preserves the existing interaction.
- Keep hover, focus, active, disabled, and loading cues distinct and interruptible.
- Add tactile press treatment only to genuine button-like controls and use a restrained `0.96` scale when it does not cause layout or measurement distraction.
- Keep horizontally hidden navigation discoverable at narrow widths.
- Maintain shared alignment edges, logical spacing, readable line-height, and tabular changing values.

Low-risk systemic findings may be fixed in the implementation pass. Findings that require a navigation, hierarchy, density, or component-library decision will remain unchanged and be reported with severity, location, before/after guidance, and rationale.

## Components and Data Flow

`CodeBlock` remains an async Server Component. Its Shiki highlighting, Cache Components behavior, props, and generated HTML do not change. Only the presentation of the existing HTML changes.

Chapter pages continue passing `filename`, `code`, `caption`, and optional `className` values into `CodeBlock`. No dictionary keys, route data, or client state are added.

Shared interactive controls keep their current events and state ownership. UI-polish changes are limited to class names unless a confirmed state defect requires a small component-local adjustment.

## Responsive Behavior

- Large layout: paired editors share one row height; filename and caption rows align.
- Intermediate layout: the pair remains expanded only while each editor retains a usable code width.
- Narrow layout: editors stack and size naturally; code remains horizontally scrollable within its own surface without causing page-level overflow.
- Localized captions may wrap and increase the shared row height; no fixed text height or truncation is introduced.

## Error Handling

The change introduces no new data or runtime error paths. If highlighting fails, the existing Server Component error behavior remains unchanged. UI review findings must not be hidden by suppressing runtime, console, or hydration errors.

## Testing and Verification

Follow a red-green cycle with a Playwright regression test that fails on the current implementation and proves two observable behaviors:

1. At a desktop viewport, paired code blocks have equal heights and aligned caption bottoms.
2. Rendered code height is consistent with the number of source lines and computed line-height, catching the duplicate-line-box regression.

Then verify:

- The focused regression test passes after the minimal layout fix.
- Existing end-to-end tests remain green.
- Turkish routes `/tr`, `/tr/suspense`, `/tr/waterfall`, `/tr/cache`, `/tr/prefetch`, and `/tr/migration` at desktop, intermediate, and mobile widths.
- Shared control hover, focus, active, disabled, loading, and reduced-motion states where applicable.
- No page-level horizontal overflow and no clipped critical controls.
- TypeScript, ESLint, production build, and the full Playwright suite.

The final standalone `better-ui` review uses grouped findings tables and ends with a verification summary and verdict. Implemented findings are identified separately from remaining recommendations.

## Completion Criteria

- Shiki source lines no longer render with duplicate vertical spacing.
- Both paired editors have equal desktop height and aligned captions.
- Mobile editors retain natural heights and internal horizontal scrolling.
- Safe shared-control polish fixes are applied without behavioral changes.
- All required automated and visual checks pass.
- Existing user-owned application files remain unstaged and uncommitted.
