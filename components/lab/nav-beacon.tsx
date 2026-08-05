"use client";

import { useEffect } from "react";

import { LAB_MESSAGE_SOURCE } from "@/lib/lab/protocol";

/**
 * The soft-navigation counterpart to `<LabMarker>`.
 *
 * Inline `<script>` markers only run when the HTML parser reaches them, which
 * makes them right for page loads and useless for client navigations — the
 * router commits an RSC payload and never evaluates inline scripts. On a soft
 * navigation the meaningful moment is the commit, so this reports from an
 * effect instead.
 */
export function NavBeacon({ phase }: { phase: string }) {
  useEffect(() => {
    try {
      window.parent.postMessage(
        {
          source: LAB_MESSAGE_SOURCE,
          runId: new URLSearchParams(window.location.search).get("run") ?? "",
          phase,
          t: performance.now(),
        },
        window.location.origin,
      );
    } catch {
      // A cross-origin embed would throw; there is nothing useful to do.
    }
  }, [phase]);

  return null;
}
