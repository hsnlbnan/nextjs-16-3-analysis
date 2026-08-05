"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ExternalLink, Play, RotateCcw } from "lucide-react";

import { LabFrame } from "@/components/lab/lab-frame";
import {
  LabTimeline,
  formatSeconds,
  type LabPhaseSpec,
} from "@/components/lab/lab-timeline";
import { Slider } from "@/components/ui/slider";
import {
  LATENCY_PRESETS,
  MAX_LATENCY,
  MIN_LATENCY,
  DEFAULT_LATENCY,
} from "@/lib/lab/latency";
import type { LabEvent } from "@/lib/lab/protocol";
import { TONE_TEXT, type LabTone } from "@/lib/lab/tone";
import { cn } from "@/lib/utils";

export type LabPaneSpec = {
  id: string;
  /** Route path including the locale, e.g. `/en/lab/streaming`. */
  path: string;
  /** Extra query params baked into the demo, e.g. `{ mode: "parallel" }`. */
  params?: Record<string, string>;
  title: string;
  caption: string;
  tone: LabTone;
  phases: readonly LabPhaseSpec[];
};

export type LabLabels = {
  run: string;
  runBoth: string;
  running: string;
  reset: string;
  latency: string;
  waiting: string;
  openRoute: string;
};

export function LabComparison({
  panes,
  labels,
  defaultLatency = DEFAULT_LATENCY,
}: {
  panes: readonly LabPaneSpec[];
  labels: LabLabels;
  defaultLatency?: number;
}) {
  const [latency, setLatency] = useState(defaultLatency);
  const [runToken, setRunToken] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, LabEvent[]>>({});
  const runCount = useRef(0);

  const run = useCallback(() => {
    runCount.current += 1;
    setEvents({});
    setRunToken(`r${runCount.current}`);
  }, []);

  const reset = useCallback(() => {
    setRunToken(null);
    setEvents({});
  }, []);

  const handleEvent = useCallback((paneId: string, event: LabEvent) => {
    setEvents((previous) => {
      const existing = previous[paneId] ?? [];
      // A marker inside a Suspense boundary can run twice if React replays the
      // chunk; keep the first arrival, which is the one that is true.
      if (existing.some((candidate) => candidate.phase === event.phase)) {
        return previous;
      }
      return { ...previous, [paneId]: [...existing, event] };
    });
  }, []);

  const observedMax = useMemo(() => {
    let max = 0;
    for (const list of Object.values(events)) {
      for (const event of list) max = Math.max(max, event.t);
    }
    return max;
  }, [events]);

  // A stable scale beats an accurate one here: rescaling mid-run makes bars
  // shrink while data is still arriving, which reads as a bug.
  const scaleMs = Math.max(latency * 2 + 400, observedMax * 1.06);

  const everyPaneDone = panes.every((pane) =>
    (events[pane.id] ?? []).some((event) => event.phase === "complete"),
  );
  const running = runToken !== null && !everyPaneDone;

  return (
    <div className="space-y-5">
      <div className="border-border/60 bg-card/40 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-lg border px-4 py-3">
        <div className="flex min-w-[15rem] flex-1 items-center gap-3">
          <span className="text-muted-foreground shrink-0 text-[12.5px]">
            {labels.latency}
          </span>
          <Slider
            value={[latency]}
            onValueChange={([next]) => setLatency(next)}
            min={MIN_LATENCY}
            max={MAX_LATENCY}
            step={50}
            className="min-w-24 flex-1"
            aria-label={labels.latency}
          />
          <span
            data-timing
            className="w-14 shrink-0 text-right font-mono text-[12px]"
          >
            {latency}ms
          </span>
        </div>

        <div className="flex items-center gap-1" role="group">
          {LATENCY_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setLatency(preset.value)}
              aria-pressed={latency === preset.value}
              className={cn(
                "rounded-md px-2 py-1 text-[12px] transition-colors",
                latency === preset.value
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {runToken ? (
            <button
              type="button"
              onClick={reset}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12.5px] transition-colors"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              {labels.reset}
            </button>
          ) : null}

          <button
            type="button"
            onClick={run}
            disabled={running}
            className="bg-foreground text-background hover:bg-foreground/90 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-[background-color,opacity,scale] enabled:active:scale-[0.96] disabled:opacity-55"
          >
            <Play className="size-3.5 fill-current" aria-hidden />
            {running
              ? labels.running
              : panes.length > 1
                ? labels.runBoth
                : labels.run}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4",
          panes.length > 1 ? "lg:grid-cols-2" : "max-w-3xl",
        )}
      >
        {panes.map((pane) => {
          const paneEvents = events[pane.id] ?? [];
          const complete = paneEvents.find(
            (event) => event.phase === "complete",
          );

          const query = new URLSearchParams({
            ...pane.params,
            latency: String(latency),
          });
          const directHref = `${pane.path}?${query}`;

          const runId = runToken ? `${runToken}:${pane.id}` : null;
          const src = runId ? `${pane.path}?${query}&run=${runId}` : null;

          return (
            <section
              key={pane.id}
              className="border-border/60 bg-card/30 flex flex-col gap-3 rounded-xl border p-4"
            >
              <header className="flex items-baseline gap-3">
                <h3 className="text-[14px] font-medium tracking-[-0.01em]">
                  {pane.title}
                </h3>
                <a
                  href={directHref}
                  target="_blank"
                  rel="noreferrer"
                  title={labels.openRoute}
                  className="text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  <ExternalLink className="size-3.5" aria-hidden />
                  <span className="sr-only">{labels.openRoute}</span>
                </a>
                <span
                  data-timing
                  className={cn(
                    "ml-auto font-mono text-[13px]",
                    complete ? TONE_TEXT[pane.tone] : "text-muted-foreground/40",
                  )}
                >
                  {complete ? formatSeconds(complete.t) : "—"}
                </span>
              </header>

              <LabFrame
                src={src}
                runId={runId}
                title={pane.title}
                placeholder={labels.waiting}
                onEvent={(event) => handleEvent(pane.id, event)}
              />

              <LabTimeline
                phases={pane.phases}
                events={paneEvents}
                scaleMs={scaleMs}
                tone={pane.tone}
              />

              <p className="text-muted-foreground border-border/50 mt-1 border-t pt-3 text-[12.5px] leading-[1.6]">
                {pane.caption}
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
