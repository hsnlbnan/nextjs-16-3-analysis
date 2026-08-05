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

type SearchParams = PageProps<"/[locale]/lab/parallel">["searchParams"];

/** Same boundary as `/lab/sequential`. Same queries. Different awaits. */
export default function ParallelPage({
  searchParams,
}: PageProps<"/[locale]/lab/parallel">) {
  return (
    <DashboardShell>
      <LabMarker phase="shell" />
      <DashboardHeader />
      <DashboardFilters />
      <Suspense fallback={<Fallback />}>
        <Region searchParams={searchParams} />
      </Suspense>
    </DashboardShell>
  );
}

function Fallback() {
  return (
    <>
      <StatsRowSkeleton />
      <MembersTableSkeleton />
    </>
  );
}

async function Region({ searchParams }: { searchParams: SearchParams }) {
  const { latency } = await searchParams;
  const ms = parseLatency(latency);

  // Both queries are in flight before either is awaited, so this region costs
  // the slower of the two rather than the sum.
  const [stats, members] = await Promise.all([
    loadStats(Math.round(ms * SECONDARY_LATENCY_RATIO)),
    loadMembers(ms),
  ]);

  return (
    <>
      <StatsRow stats={stats} />
      <MembersTable members={members} />
      <LabMarker phase="data" />
    </>
  );
}
