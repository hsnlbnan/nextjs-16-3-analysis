import { Suspense } from "react";

import {
  DashboardFilters,
  DashboardHeader,
  DashboardShell,
  MembersTable,
  MembersTableSkeleton,
  StatsRow,
  StatsRowSkeleton,
} from "@/components/lab/dashboard";
import { LabMarker } from "@/components/lab/markers";
import { loadMembers, loadStats } from "@/lib/lab/data";
import { SECONDARY_LATENCY_RATIO, parseLatency } from "@/lib/lab/latency";

type SearchParams = PageProps<"/[locale]/lab/boundaries">["searchParams"];

/**
 * Two regions, two boundaries, two deliberately different query speeds. The
 * fast one does not queue behind the slow one, and neither queues behind the
 * shell — each boundary swaps its own fallback as its own data resolves.
 */
export default function BoundariesPage({
  searchParams,
}: PageProps<"/[locale]/lab/boundaries">) {
  return (
    <DashboardShell>
      <LabMarker phase="shell" />
      <DashboardHeader />

      <Suspense fallback={<StatsRowSkeleton />}>
        <StatsRegion searchParams={searchParams} />
      </Suspense>

      <DashboardFilters />

      <Suspense fallback={<MembersTableSkeleton />}>
        <MembersRegion searchParams={searchParams} />
      </Suspense>
    </DashboardShell>
  );
}

async function StatsRegion({ searchParams }: { searchParams: SearchParams }) {
  const { latency } = await searchParams;
  const ms = parseLatency(latency);
  const stats = await loadStats(Math.round(ms * SECONDARY_LATENCY_RATIO));

  return (
    <>
      <StatsRow stats={stats} />
      <LabMarker phase="stats" />
    </>
  );
}

async function MembersRegion({ searchParams }: { searchParams: SearchParams }) {
  const { latency } = await searchParams;
  const members = await loadMembers(parseLatency(latency));

  return (
    <>
      <MembersTable members={members} />
      <LabMarker phase="table" />
    </>
  );
}
