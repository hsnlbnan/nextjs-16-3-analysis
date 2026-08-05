export const MIN_LATENCY = 0;
export const MAX_LATENCY = 2000;
export const DEFAULT_LATENCY = 700;

/** A deliberately slower second query, for the waterfall chapter. */
export const SECONDARY_LATENCY_RATIO = 0.55;

export const LATENCY_PRESETS = [
  { label: "Fast", value: 200 },
  { label: "Typical", value: 700 },
  { label: "Slow", value: 1400 },
] as const;

export function clampLatency(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_LATENCY;
  return Math.min(MAX_LATENCY, Math.max(MIN_LATENCY, Math.round(value)));
}

type SearchParamValue = string | string[] | undefined;

export function parseLatency(raw: SearchParamValue): number {
  const first = Array.isArray(raw) ? raw[0] : raw;
  if (first === undefined) return DEFAULT_LATENCY;
  return clampLatency(Number.parseInt(first, 10));
}

/**
 * The only thing that is faked in this entire app. The delay is added on the
 * server so the difference between the two rendering shapes is visible at
 * normal speed — a 12ms query would make every pane look identical. The
 * streaming, the boundaries and the timings are all real.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
