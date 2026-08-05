/**
 * The measurement protocol.
 *
 * Every lab route embeds inline `<script>` markers inside its RSC stream. An
 * inline script runs the moment its chunk reaches the browser — before
 * hydration, before React has done anything with the page. That makes it a
 * measurement of *byte arrival*, which is the only thing here worth measuring:
 * "when did React finish hydrating" would tell you about React, not about the
 * rendering model.
 *
 * A marker outside every Suspense boundary reports when the shell landed. A
 * marker inside a boundary reports when that boundary's chunk streamed in. The
 * iframe posts both to the parent page, which draws the timeline.
 */

export const LAB_MESSAGE_SOURCE = "instant-lab";

/** `"shell"`, `"complete"`, or a region id such as `"table"`. */
export type LabPhase = string;

export type LabEvent = {
  source: typeof LAB_MESSAGE_SOURCE;
  /** Ties an event to one run, so a stale frame cannot pollute a new timeline. */
  runId: string;
  phase: LabPhase;
  /** Milliseconds since the iframe document's navigation started. */
  t: number;
};

export function isLabEvent(data: unknown): data is LabEvent {
  if (typeof data !== "object" || data === null) return false;
  const candidate = data as Record<string, unknown>;
  return (
    candidate.source === LAB_MESSAGE_SOURCE &&
    typeof candidate.runId === "string" &&
    typeof candidate.phase === "string" &&
    typeof candidate.t === "number"
  );
}

/**
 * Runs first in every lab document, before any marker.
 *
 * `performance.now()` inside an iframe is measured from that document's own
 * navigation start, so t=0 is the moment the browser began the request. The
 * run id is read from `location.search` in the browser rather than from
 * `searchParams` on the server — a server-side read would tie the route's
 * shell to one URL and defeat the point of the demo.
 */
export const LAB_BOOTSTRAP_SCRIPT = `(function(){
var o=location.origin;
var r=new URLSearchParams(location.search).get('run')||'';
function s(p){try{parent.postMessage({source:${JSON.stringify(
  LAB_MESSAGE_SOURCE,
)},runId:r,phase:p,t:performance.now()},o)}catch(e){}}
window.__lab=s;
addEventListener('load',function(){s('complete')});
})();`;
