import { LAB_BOOTSTRAP_SCRIPT } from "@/lib/lab/protocol";

/**
 * Defines `window.__lab` and reports `complete` on load. Rendered first in the
 * lab layout so it is in the document before any marker can fire.
 */
export function LabBootstrap() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: LAB_BOOTSTRAP_SCRIPT }}
    />
  );
}

/**
 * A timing marker. Put one outside every Suspense boundary to catch the shell,
 * and one inside each boundary to catch that region's chunk.
 *
 * This is a plain inline `<script>` on purpose. It executes as the HTML parser
 * reaches it — the instant the containing chunk arrives — rather than waiting
 * for React to hydrate. A `useEffect` here would measure hydration and report
 * a much later, much less interesting number.
 */
export function LabMarker({ phase }: { phase: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__lab&&window.__lab(${JSON.stringify(phase)})`,
      }}
    />
  );
}
