import { Suspense } from "react";

import {
  DashboardFilters,
  DashboardHeader,
  DashboardShell,
  MembersTable,
  MembersTableSkeleton,
} from "@/components/lab/dashboard";
import { LabMarker } from "@/components/lab/markers";
import { loadMembers } from "@/lib/lab/data";
import { parseLatency } from "@/lib/lab/latency";

type SearchParams = PageProps<"/[locale]/lab/streaming">["searchParams"];

/**
 * Same page, same query, one difference: the await happens inside the
 * boundary instead of above it.
 *
 * Note that `searchParams` is passed down as a promise rather than awaited
 * here. Awaiting it in the page body would tie this route's shell to one URL,
 * and Next.js would surface the `instant-shell-url-data` insight in dev.
 */
export default function StreamingPage({
  searchParams,
}: PageProps<"/[locale]/lab/streaming">) {
  return (
    <DashboardShell>
      <LabMarker phase="shell" />
      <DashboardHeader />
      <DashboardFilters />
      <Suspense fallback={<MembersTableSkeleton />}>
        <MembersRegion searchParams={searchParams} />
      </Suspense>
    </DashboardShell>
  );
}

async function MembersRegion({ searchParams }: { searchParams: SearchParams }) {
  const { latency } = await searchParams;
  const members = await loadMembers(parseLatency(latency));

  return (
    <>
      <MembersTable members={members} />
      <LabMarker phase="data" />
    </>
  );
}
