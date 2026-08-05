import report from "@/data/build-report.json";

export type RouteKind = "static" | "partial" | "dynamic";

export type BuildReportRoute = {
  path: string;
  kind: RouteKind;
  revalidate: string | null;
  expire: string | null;
  /**
   * Set on the rows `next build` prints as "[+6 more paths]" when a
   * `generateStaticParams` list is long enough to abbreviate.
   */
  aggregate?: number;
};

export type BuildReport = {
  generatedAt: string;
  totals: Record<RouteKind, number>;
  routes: BuildReportRoute[];
};

/**
 * The route table from a real `next build`, regenerated with
 * `pnpm report:build`. Imported statically rather than read from disk so it
 * survives bundling and deploys with the app.
 */
export const buildReport = report as BuildReport;
