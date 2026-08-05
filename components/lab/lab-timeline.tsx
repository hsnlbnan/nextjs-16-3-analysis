"use client";

import type { LabEvent } from "@/lib/lab/protocol";
import { TONE_BAR, TONE_TEXT, type LabTone } from "@/lib/lab/tone";
import { cn } from "@/lib/utils";

export type LabPhaseSpec = {
  /** Matches the `phase` string passed to `<LabMarker>`. */
  id: string;
  label: string;
};

export function formatSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

export function LabTimeline({
  phases,
  events,
  scaleMs,
  tone,
}: {
  phases: readonly LabPhaseSpec[];
  events: readonly LabEvent[];
  scaleMs: number;
  tone: LabTone;
}) {
  return (
    <ol className="space-y-2" aria-live="polite">
      {
        phases.map((phase) => {
          const event = events.find((candidate) => candidate.phase === phase.id);
          const width = event
            ? Math.max(1.5, Math.min(100, (event.t / scaleMs) * 100))
            : 0;

          return (
            <li key={phase.id} className="flex items-center gap-3">
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full transition-colors",
                  event ? TONE_BAR[tone] : "bg-muted-foreground/30",
                )}
                aria-hidden
              />

              <span
                className={cn(
                  "w-[9.5rem] shrink-0 text-[12.5px] transition-colors",
                  event ? "text-foreground" : "text-muted-foreground/50",
                )}
              >
                {phase.label}
              </span>

              <span className="bg-lab-track relative h-[3px] min-w-0 flex-1 overflow-hidden rounded-full">
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-out",
                    TONE_BAR[tone],
                  )}
                  style={{ width: `${width}%` }}
                />
              </span>

              <span
                data-timing
                className={cn(
                  "w-14 shrink-0 text-right font-mono text-[12px]",
                  event ? TONE_TEXT[tone] : "text-muted-foreground/40",
                )}
              >
                {event ? formatSeconds(event.t) : "—"}
              </span>
            </li>
          );
        })
      }
    </ol>
  );
}
