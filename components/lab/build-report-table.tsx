import { buildReport, type RouteKind } from "@/lib/lab/build-report";
import { cn } from "@/lib/utils";

const KIND_STYLES: Record<RouteKind, string> = {
  static: "text-lab-instant bg-lab-instant-muted",
  partial: "text-lab-cached bg-lab-cached-muted",
  dynamic: "text-lab-blocking bg-lab-blocking-muted",
};

const KIND_SYMBOL: Record<RouteKind, string> = {
  static: "○",
  partial: "◐",
  dynamic: "ƒ",
};

export type BuildReportCopy = {
  kinds: Record<RouteKind, string>;
  kindHints: Record<RouteKind, string>;
  route: string;
  revalidate: string;
  expire: string;
  generated: string;
  regenerate: string;
};

export function BuildReportTable({ copy }: { copy: BuildReportCopy }) {
  const kinds: RouteKind[] = ["static", "partial", "dynamic"];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {kinds.map((kind) => (
          <div
            key={kind}
            className="border-border/60 rounded-lg border px-4 py-3.5"
          >
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 font-mono text-[12px]",
                  KIND_STYLES[kind],
                )}
                aria-hidden
              >
                {KIND_SYMBOL[kind]}
              </span>
              <span
                data-timing
                className="text-2xl font-medium tabular-nums"
              >
                {buildReport.totals[kind]}
              </span>
              <span className="text-muted-foreground text-[13px]">
                {copy.kinds[kind]}
              </span>
            </div>
            <p className="text-muted-foreground mt-2 text-[12.5px] leading-[1.55]">
              {copy.kindHints[kind]}
            </p>
          </div>
        ))}
      </div>

      <div className="border-border/60 overflow-hidden rounded-lg border">
        <table className="w-full text-left text-[12.5px]">
          <thead className="text-muted-foreground border-border/60 border-b">
            <tr>
              <th className="px-3.5 py-2 font-medium">{copy.route}</th>
              <th className="w-32 px-3.5 py-2 font-medium">&nbsp;</th>
              <th className="w-24 px-3.5 py-2 text-right font-medium">
                {copy.revalidate}
              </th>
              <th className="w-20 px-3.5 py-2 text-right font-medium">
                {copy.expire}
              </th>
            </tr>
          </thead>
          <tbody className="divide-border/50 divide-y">
            {buildReport.routes.map((route) => (
              <tr key={route.path}>
                <td
                  className={cn(
                    "px-3.5 py-1.5 font-mono",
                    route.aggregate && "text-muted-foreground/70 pl-7",
                  )}
                >
                  {route.path}
                </td>
                <td className="px-3.5 py-1.5">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-[11px]",
                      KIND_STYLES[route.kind],
                    )}
                  >
                    {KIND_SYMBOL[route.kind]} {copy.kinds[route.kind]}
                  </span>
                </td>
                <td
                  data-timing
                  className="text-muted-foreground px-3.5 py-1.5 text-right font-mono"
                >
                  {route.revalidate ?? "—"}
                </td>
                <td
                  data-timing
                  className="text-muted-foreground px-3.5 py-1.5 text-right font-mono"
                >
                  {route.expire ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground/70 text-[12px]">
        {copy.generated}{" "}
        <time dateTime={buildReport.generatedAt}>
          {buildReport.generatedAt.replace("T", " ").slice(0, 19)} UTC
        </time>
        {" · "}
        <code className="font-mono">{copy.regenerate}</code>
      </p>
    </div>
  );
}
