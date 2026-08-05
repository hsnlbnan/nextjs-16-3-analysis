/**
 * Cache profile data and the prerendering rules that follow from it.
 *
 * The three numbers are documented and easy to find. What is not obvious from
 * the API surface is that they also decide whether cached content reaches the
 * prerender and the App Shell at all — which is what the explorer surfaces.
 *
 * Source: `cacheLife` API reference, "Preset cache profiles" and
 * "Prerendering behavior".
 */

export const NEVER = null;

export type CacheProfile = {
  name: string;
  /** Seconds the client reuses its copy without contacting the server. */
  stale: number;
  /** Seconds until the server refreshes in the background. */
  revalidate: number;
  /** Seconds until a stale value stops being served. `null` means never. */
  expire: number | null;
  /** True for profiles defined in this repo's next.config.ts. */
  custom?: boolean;
};

export const CACHE_PROFILES: readonly CacheProfile[] = [
  { name: "default", stale: 300, revalidate: 900, expire: NEVER },
  { name: "seconds", stale: 30, revalidate: 1, expire: 60 },
  { name: "minutes", stale: 300, revalidate: 60, expire: 3600 },
  { name: "hours", stale: 300, revalidate: 3600, expire: 86400 },
  { name: "days", stale: 300, revalidate: 86400, expire: 604800 },
  { name: "weeks", stale: 300, revalidate: 604800, expire: 2592000 },
  { name: "max", stale: 300, revalidate: 2592000, expire: 31536000 },
  { name: "realtime", stale: 30, revalidate: 5, expire: 60, custom: true },
];

/** Thresholds from the "Prerendering behavior" section, in seconds. */
const CLIENT_STALE_MINIMUM = 30;
const SHELL_STALE_MINIMUM = 300;
const PRERENDER_EXPIRE_MINIMUM = 300;

export type PrerenderVerdict = {
  prerendered: boolean;
  inAppShell: boolean;
  /** Which rule decided it, as a key the dictionary translates. */
  reason:
    | "revalidateZero"
    | "expireTooShort"
    | "staleTooShort"
    | "staleUnderShellMinimum"
    | "included";
};

export function prerenderVerdict(profile: CacheProfile): PrerenderVerdict {
  if (profile.revalidate === 0) {
    return { prerendered: false, inAppShell: false, reason: "revalidateZero" };
  }

  if (profile.expire !== null && profile.expire < PRERENDER_EXPIRE_MINIMUM) {
    return { prerendered: false, inAppShell: false, reason: "expireTooShort" };
  }

  if (profile.stale < CLIENT_STALE_MINIMUM) {
    return { prerendered: false, inAppShell: false, reason: "staleTooShort" };
  }

  if (profile.stale < SHELL_STALE_MINIMUM) {
    return {
      prerendered: true,
      inAppShell: false,
      reason: "staleUnderShellMinimum",
    };
  }

  return { prerendered: true, inAppShell: true, reason: "included" };
}

export type ServedFrom = "clientCache" | "serverCache" | "staleRefresh" | "blocking";

/** What a request that arrives `atSeconds` after the entry was written gets. */
export function serveOutcome(
  profile: CacheProfile,
  atSeconds: number,
): { client: "reuse" | "check"; server: ServedFrom } {
  const client = atSeconds < profile.stale ? "reuse" : "check";

  let server: ServedFrom;
  if (atSeconds < profile.revalidate) {
    server = "serverCache";
  } else if (profile.expire === null || atSeconds < profile.expire) {
    server = "staleRefresh";
  } else {
    server = "blocking";
  }

  // While the client is still inside its stale window it does not ask at all,
  // so whatever the server would have done is irrelevant to this request.
  return { client, server: client === "reuse" ? "clientCache" : server };
}

/** Log-spaced checkpoints for the request-arrival slider. */
export const TIME_STOPS: readonly number[] = [
  5, 15, 30, 60, 300, 900, 3600, 21600, 86400, 604800, 2592000, 31536000,
];

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return "never";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.round(seconds / 86400)}d`;
  if (seconds < 2592000) return `${Math.round(seconds / 604800)}w`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)}mo`;
  return `${Math.round(seconds / 31536000)}y`;
}
