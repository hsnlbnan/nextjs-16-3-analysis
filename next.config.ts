import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The two opt-ins this whole site is about. They are separate flags:
  // `cacheComponents` turns on `use cache` and makes Partial Prerendering the
  // App Router default; `partialPrefetching` changes what a <Link> downloads.
  cacheComponents: true,
  partialPrefetching: true,

  cacheLife: {
    // Used by the cache chapter to show a profile that sits deliberately under
    // the 5-minute `expire` threshold, so it becomes a dynamic hole.
    realtime: {
      stale: 30, // 30s — at the enforced client minimum
      revalidate: 5, // 5s
      expire: 60, // 1m — under 5min, so it is excluded from prerenders
    },
  },

  experimental: {
    // Lets the @next/playwright `instant()` helper run against `next start` in
    // CI, not just `next dev`.
    exposeTestingApiInProductionBuild: true,
  },

  async redirects() {
    // `[locale]` sits above the root layout so it can be a root param, which
    // means there is no route for `/`. Redirecting here rather than in a
    // proxy/middleware keeps every route free of a `headers()` read — which is
    // the entire argument for root params.
    return [{ source: "/", destination: "/en", permanent: false }];
  },
};

export default nextConfig;
