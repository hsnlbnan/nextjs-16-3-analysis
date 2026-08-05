"use client";

import { useEffect, useRef } from "react";

import { isLabEvent, type LabEvent } from "@/lib/lab/protocol";

/**
 * Hosts one real route in an iframe and forwards its timing markers up.
 *
 * The iframe is keyed by `runId` so every run gets a brand new document, and
 * therefore a brand new `performance.timeOrigin` — t=0 is always the moment
 * this particular navigation started.
 */
export function LabFrame({
  src,
  runId,
  onEvent,
  title,
  placeholder,
  height = 380,
}: {
  src: string | null;
  runId: string | null;
  onEvent: (event: LabEvent) => void;
  title: string;
  placeholder: React.ReactNode;
  height?: number;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  });

  useEffect(() => {
    if (!runId) return;

    function handle(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (!isLabEvent(event.data) || event.data.runId !== runId) return;
      // Both panes post to the same window; only take our own frame's events.
      if (frameRef.current && event.source !== frameRef.current.contentWindow) {
        return;
      }
      onEventRef.current(event.data);
    }

    window.addEventListener("message", handle);
    return () => window.removeEventListener("message", handle);
  }, [runId]);

  return (
    <div
      className="border-border/60 bg-background relative overflow-hidden rounded-lg border"
      style={{ height }}
    >
      {src && runId ? (
        <iframe
          key={runId}
          ref={frameRef}
          src={src}
          title={title}
          className="size-full border-0"
        />
      ) : (
        <div className="text-muted-foreground/70 flex size-full items-center justify-center px-6 text-center text-[13px]">
          {placeholder}
        </div>
      )}
    </div>
  );
}
