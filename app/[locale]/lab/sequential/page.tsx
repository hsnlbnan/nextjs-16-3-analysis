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

type SearchParams = PageProps<"/[locale]/lab/sequential">["searchParams"];

/**
 * The boundary here is identical to the one in `/lab/parallel`. Only the
 * awaits differ, and that is the entire point of the chapter.
 */
export default function SequentialPage({
  searchParams,
}: PageProps<"/[locale]/lab/sequential">) {
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

  // The second query does not start until the first resolves, so this region
  // costs the sum of both.
  const stats = await loadStats(Math.round(ms * SECONDARY_LATENCY_RATIO));
  const members = await loadMembers(ms);

  return (
    <>
      <StatsRow stats={stats} />
      <MembersTable members={members} />
      <LabMarker phase="data" />
    </>
  );
}
