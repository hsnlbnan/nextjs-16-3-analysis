"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, RotateCcw, TriangleAlert } from "lucide-react";

import type { LinkMode } from "@/lib/lab/products";
import { isLabEvent } from "@/lib/lab/protocol";
import { cn } from "@/lib/utils";

export type PrefetchCopy = {
  modes: Record<LinkMode, string>;
  modeHints: Record<LinkMode, string>;
  requests: string;
  transferred: string;
  clickHint: string;
  toProduct: string;
  toInventory: string;
  devWarning: string;
  reload: string;
  openRoute: string;
  pending: string;
};

const MODES: readonly LinkMode[] = ["auto", "eager", "off"];

export function PrefetchLab({
  path,
  copy,
  isDev,
}: {
  path: string;
  copy: PrefetchCopy;
  isDev: boolean;
}) {
  const [mode, setMode] = useState<LinkMode>("auto");
  const [runId, setRunId] = useState("r0");
  const [stats, setStats] = useState<{ count: number; bytes: number } | null>(
    null,
  );
  const [nav, setNav] = useState<{ product?: number; inventory?: number }>({});

  const frameRef = useRef<HTMLIFrameElement>(null);
  const clickAt = useRef<number | null>(null);
  const runCount = useRef(0);

  const reload = useCallback((next?: LinkMode) => {
    runCount.current += 1;
    if (next) setMode(next);
    setStats(null);
    setNav({});
    clickAt.current = null;
    setRunId(`r${runCount.current}`);
  }, []);

  // Timings arrive on the iframe's clock, so the click has to be stamped with
  // the iframe's clock too — `performance.now()` in the parent starts from a
  // different origin and the delta would be meaningless.
  const handleLoad = useCallback(() => {
    const frame = frameRef.current;
    const win = frame?.contentWindow;
    const doc = frame?.contentDocument;
    if (!win || !doc) return;

    doc.addEventListener(
      "click",
      (event) => {
        const anchor = (event.target as HTMLElement | null)?.closest("a");
        if (anchor) {
          clickAt.current = win.performance.now();
          setNav({});
        }
      },
      true,
    );

    // Prefetches are `fetch` requests; assets are not. Sampling a moment after
    // load lets the visible links issue theirs first.
    const timer = win.setTimeout(() => {
      const entries = win.performance
        .getEntriesByType("resource")
        .filter(
          (entry): entry is PerformanceResourceTiming =>
            (entry as PerformanceResourceTiming).initiatorType === "fetch",
        );

      setStats({
        count: entries.length,
        bytes: entries.reduce(
          (total, entry) =>
            total + (entry.transferSize || entry.encodedBodySize || 0),
          0,
        ),
      });
    }, 1500);

    return () => win.clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handle(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (!isLabEvent(event.data) || event.data.runId !== runId) return;
      if (clickAt.current === null) return;

      const delta = event.data.t - clickAt.current;
      if (delta < 0) return;

      if (event.data.phase === "product") {
        setNav((previous) => ({ ...previous, product: previous.product ?? delta }));
      }
      if (event.data.phase === "inventory") {
        setNav((previous) => ({
          ...previous,
          inventory: previous.inventory ?? delta,
        }));
      }
    }

    window.addEventListener("message", handle);
    return () => window.removeEventListener("message", handle);
  }, [runId]);

  const src = `${path}?mode=${mode}&run=${runId}`;

  return (
    <div className="space-y-4">
      {isDev ? (
        <p className="border-lab-blocking/40 text-lab-blocking flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-[12.5px] leading-[1.6]">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {copy.devWarning}
        </p>
      ) : null}

      <div className="border-border/60 bg-card/40 flex flex-wrap items-center gap-2 rounded-lg border px-4 py-3">
        <div className="flex items-center gap-1" role="group">
          {MODES.map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => reload(candidate)}
              aria-pressed={candidate === mode}
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-[12px] transition-colors",
                candidate === mode
                  ? "bg-lab-instant-muted text-lab-instant"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {copy.modes[candidate]}
            </button>
          ))}
        </div>

        <p className="text-muted-foreground min-w-0 flex-1 text-[12.5px]">
          {copy.modeHints[mode]}
        </p>

        <button
          type="button"
          onClick={() => reload()}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12.5px] transition-colors"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          {copy.reload}
        </button>

        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          title={copy.openRoute}
          className="text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          <ExternalLink className="size-3.5" aria-hidden />
          <span className="sr-only">{copy.openRoute}</span>
        </a>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_18rem]">
        <div
          className="border-border/60 bg-background overflow-hidden rounded-lg border"
          style={{ height: 320 }}
        >
          <iframe
            key={runId}
            ref={frameRef}
            src={src}
            onLoad={handleLoad}
            title={copy.modes[mode]}
            className="size-full border-0"
          />
        </div>

        <dl className="border-border/60 divide-border/50 divide-y rounded-lg border px-4">
          <Metric
            label={copy.requests}
            value={stats ? String(stats.count) : null}
            pending={copy.pending}
          />
          <Metric
            label={copy.transferred}
            value={stats ? `${(stats.bytes / 1024).toFixed(1)} kB` : null}
            pending={copy.pending}
          />
          <Metric
            label={copy.toProduct}
            value={nav.product ? `${Math.round(nav.product)}ms` : null}
            pending={copy.clickHint}
            tone="instant"
          />
          <Metric
            label={copy.toInventory}
            value={nav.inventory ? `${Math.round(nav.inventory)}ms` : null}
            pending={copy.clickHint}
            tone="blocking"
          />
        </dl>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  pending,
  tone,
}: {
  label: string;
  value: string | null;
  pending: string;
  tone?: "instant" | "blocking";
}) {
  return (
    <div className="py-3">
      <dt className="text-muted-foreground text-[12px]">{label}</dt>
      <dd
        data-timing
        className={cn(
          "mt-1 font-mono text-[15px] tabular-nums",
          value === null && "text-muted-foreground/50 text-[11.5px]",
          value !== null && tone === "instant" && "text-lab-instant",
          value !== null && tone === "blocking" && "text-lab-blocking",
        )}
      >
        {value ?? pending}
      </dd>
    </div>
  );
}
