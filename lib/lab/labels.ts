import type { LabLabels } from "@/components/lab/lab-comparison";
import type { Dictionary } from "@/lib/dictionaries/en";

/** Shared control labels, so every chapter's demo toolbar reads the same. */
export function labLabels(dict: Dictionary): LabLabels {
  return {
    run: dict.common.run,
    runBoth: dict.common.runBoth,
    running: dict.common.running,
    reset: dict.common.reset,
    latency: dict.common.latency,
    waiting: dict.common.waiting,
    openRoute: dict.common.openRoute,
  };
}

/** The default three-phase timeline: shell, the one data region, load. */
export function basePhases(dict: Dictionary) {
  return [
    { id: "shell", label: dict.common.shellPainted },
    { id: "data", label: dict.common.dataStreamed },
    { id: "complete", label: dict.common.complete },
  ];
}
