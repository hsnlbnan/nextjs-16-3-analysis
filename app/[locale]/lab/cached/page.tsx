import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";

import { DashboardShell } from "@/components/lab/dashboard";
import { LabMarker } from "@/components/lab/markers";
import { getDictionary } from "@/lib/i18n";
import { CLOCK_TAG } from "@/lib/lab/tags";
import { revalidateClock, updateClock } from "./actions";

/**
 * `new Date()` is normally an error under Cache Components, because the same
 * render would produce a different answer next time. Inside a cache scope it
 * is fine, and it means something useful: it evaluates once, when the entry is
 * written. So this is a readout of *when this cache entry was created*.
 */
async function getCachedClock(): Promise<string> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CLOCK_TAG);

  return new Date().toISOString();
}

export default async function CachedPage() {
  const dict = await getDictionary();
  const t = dict.lab.cached;

  return (
    <DashboardShell>
      <LabMarker phase="shell" />

      <div className="grid gap-3 sm:grid-cols-2">
        <Panel
          label={t.cachedLabel}
          hint={t.cachedHint}
          tone="cached"
          value={await getCachedClock()}
          meta={[
            `${t.profile}: minutes`,
            `${t.tag}: ${CLOCK_TAG}`,
          ]}
        />

        <Suspense fallback={<PanelSkeleton label={t.liveLabel} />}>
          <LivePanel label={t.liveLabel} hint={t.liveHint} />
        </Suspense>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ActionCard
          action={updateClock}
          name="updateTag()"
          hint={t.updateHint}
          tone="instant"
        />
        <ActionCard
          action={revalidateClock}
          name="revalidateTag(…, 'max')"
          hint={t.revalidateHint}
          tone="cached"
        />
      </div>
    </DashboardShell>
  );
}

async function LivePanel({ label, hint }: { label: string; hint: string }) {
  // Defers to request time, which is what makes the clock below legal.
  await connection();

  return (
    <>
      <Panel
        label={label}
        hint={hint}
        tone="instant"
        value={new Date().toISOString()}
      />
      <LabMarker phase="data" />
    </>
  );
}

function Panel({
  label,
  hint,
  value,
  tone,
  meta,
}: {
  label: string;
  hint: string;
  value: string;
  tone: "cached" | "instant";
  meta?: string[];
}) {
  return (
    <div className="border-border/60 rounded-lg border p-3.5">
      <p className="text-muted-foreground text-[11px]">{label}</p>
      <p
        data-timing
        className={`mt-1.5 font-mono text-[13px] ${
          tone === "cached" ? "text-lab-cached" : "text-lab-instant"
        }`}
      >
        {value.replace("T", " ").replace("Z", "")}
      </p>
      <p className="text-muted-foreground mt-2 text-[11px] leading-[1.5]">
        {hint}
      </p>
      {meta ? (
        <p className="text-muted-foreground/60 mt-2 font-mono text-[10.5px]">
          {meta.join("  ·  ")}
        </p>
      ) : null}
    </div>
  );
}

function PanelSkeleton({ label }: { label: string }) {
  return (
    <div className="border-border/60 rounded-lg border p-3.5">
      <p className="text-muted-foreground text-[11px]">{label}</p>
      <div className="bg-muted mt-2 h-3.5 w-40 rounded" />
      <div className="bg-muted/60 mt-2.5 h-2.5 w-full rounded" />
    </div>
  );
}

function ActionCard({
  action,
  name,
  hint,
  tone,
}: {
  action: () => Promise<void>;
  name: string;
  hint: string;
  tone: "cached" | "instant";
}) {
  return (
    <form action={action} className="border-border/60 rounded-lg border p-3.5">
      <button
        type="submit"
        className={`rounded-md px-2.5 py-1.5 font-mono text-[12px] transition-colors ${
          tone === "cached"
            ? "bg-lab-cached-muted text-lab-cached hover:brightness-125"
            : "bg-lab-instant-muted text-lab-instant hover:brightness-125"
        }`}
      >
        {name}
      </button>
      <p className="text-muted-foreground mt-2.5 text-[11px] leading-[1.5]">
        {hint}
      </p>
    </form>
  );
}
