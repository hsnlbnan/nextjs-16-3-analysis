"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { Slider } from "@/components/ui/slider";
import {
  CACHE_PROFILES,
  TIME_STOPS,
  formatDuration,
  prerenderVerdict,
  serveOutcome,
  type PrerenderVerdict,
  type ServedFrom,
} from "@/lib/lab/cache-profiles";
import { cn } from "@/lib/utils";

export type CacheExplorerCopy = {
  fields: {
    stale: { label: string; body: string };
    revalidate: { label: string; body: string };
    expire: { label: string; body: string };
  };
  requestAt: string;
  client: string;
  server: string;
  outcomes: Record<ServedFrom, string>;
  clientReuse: string;
  clientCheck: string;
  verdict: {
    title: string;
    prerendered: string;
    notPrerendered: string;
    inShell: string;
    notInShell: string;
    reasons: Record<PrerenderVerdict["reason"], string>;
  };
  customBadge: string;
};

export function CacheExplorer({ copy }: { copy: CacheExplorerCopy }) {
  const [profileIndex, setProfileIndex] = useState(0);
  const [stopIndex, setStopIndex] = useState(4);

  const profile = CACHE_PROFILES[profileIndex];
  const at = TIME_STOPS[stopIndex];
  const verdict = prerenderVerdict(profile);
  const outcome = serveOutcome(profile, at);

  const fields = [
    {
      key: "stale" as const,
      value: formatDuration(profile.stale),
      ...copy.fields.stale,
    },
    {
      key: "revalidate" as const,
      value: formatDuration(profile.revalidate),
      ...copy.fields.revalidate,
    },
    {
      key: "expire" as const,
      value: formatDuration(profile.expire),
      ...copy.fields.expire,
    },
  ];

  return (
    <div className="border-border/60 bg-card/30 space-y-6 rounded-xl border p-5">
      <div className="flex flex-wrap items-center gap-1.5">
        {CACHE_PROFILES.map((candidate, index) => (
          <button
            key={candidate.name}
            type="button"
            onClick={() => setProfileIndex(index)}
            aria-pressed={index === profileIndex}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-[12px] transition-colors",
              index === profileIndex
                ? "bg-lab-cached-muted text-lab-cached"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {candidate.name}
            {candidate.custom ? (
              <span className="text-muted-foreground/60 ml-1.5 text-[10px]">
                {copy.customBadge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <dl className="divide-border/50 divide-y">
        {fields.map((field) => (
          <div
            key={field.key}
            className="grid grid-cols-[7rem_4.5rem_1fr] items-baseline gap-3 py-3"
          >
            <dt className="font-mono text-[12.5px]">{field.key}</dt>
            <dd
              data-timing
              className="text-lab-cached font-mono text-[13px] tabular-nums"
            >
              {field.value}
            </dd>
            <dd className="text-muted-foreground text-[12.5px] leading-[1.6]">
              {field.body}
            </dd>
          </div>
        ))}
      </dl>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground shrink-0 text-[12.5px]">
            {copy.requestAt}
          </span>
          <Slider
            value={[stopIndex]}
            onValueChange={([next]) => setStopIndex(next)}
            min={0}
            max={TIME_STOPS.length - 1}
            step={1}
            className="min-w-24 flex-1"
            aria-label={copy.requestAt}
          />
          <span
            data-timing
            className="w-12 shrink-0 text-right font-mono text-[12.5px]"
          >
            {formatDuration(at)}
          </span>
        </div>

        <div className="border-border/50 grid gap-2 rounded-lg border p-3 sm:grid-cols-2">
          <Outcome
            track={copy.client}
            text={
              outcome.client === "reuse" ? copy.clientReuse : copy.clientCheck
            }
            highlight={outcome.client === "reuse"}
          />
          <Outcome
            track={copy.server}
            text={copy.outcomes[outcome.server]}
            highlight={outcome.server !== "blocking"}
          />
        </div>
      </div>

      <div className="border-border/50 space-y-2.5 rounded-lg border p-3.5">
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.12em] uppercase">
          {copy.verdict.title}
        </p>

        <Verdict
          ok={verdict.prerendered}
          text={
            verdict.prerendered
              ? copy.verdict.prerendered
              : copy.verdict.notPrerendered
          }
        />
        <Verdict
          ok={verdict.inAppShell}
          text={
            verdict.inAppShell ? copy.verdict.inShell : copy.verdict.notInShell
          }
        />

        <p className="text-muted-foreground border-border/50 border-t pt-2.5 text-[12.5px] leading-[1.6]">
          {copy.verdict.reasons[verdict.reason]}
        </p>
      </div>
    </div>
  );
}

function Outcome({
  track,
  text,
  highlight,
}: {
  track: string;
  text: string;
  highlight: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground/70 font-mono text-[10.5px] tracking-[0.12em] uppercase">
        {track}
      </p>
      <p
        className={cn(
          "text-[12.5px] leading-[1.55]",
          highlight ? "text-foreground" : "text-lab-blocking",
        )}
      >
        {text}
      </p>
    </div>
  );
}

function Verdict({ ok, text }: { ok: boolean; text: string }) {
  const Icon = ok ? Check : X;

  return (
    <p className="flex items-start gap-2 text-[13px]">
      <Icon
        className={cn(
          "mt-0.5 size-3.5 shrink-0",
          ok ? "text-lab-instant" : "text-lab-blocking",
        )}
        aria-hidden
      />
      <span>{text}</span>
    </p>
  );
}
