import {
  DashboardFilters,
  DashboardHeader,
  DashboardShell,
  MembersTable,
} from "@/components/lab/dashboard";
import { LabMarker } from "@/components/lab/markers";
import { loadMembers } from "@/lib/lab/data";
import { parseLatency } from "@/lib/lab/latency";

/**
 * This route genuinely blocks, and this export is the honest way to say so.
 *
 * `instant = false` opts the segment out of instant-navigation validation. It
 * does not make the route slow — the `await` below does that. What it does is
 * stop the dev overlay flagging a route whose whole purpose is to be the
 * "before" picture, and declare the intent in the file itself.
 */
export const instant = false;

export default async function BlockingPage({
  searchParams,
}: PageProps<"/[locale]/lab/blocking">) {
  // Awaited at the top, so nothing below renders until the query resolves —
  // including the header and the filters, which never read `members`.
  const { latency } = await searchParams;
  const members = await loadMembers(parseLatency(latency));

  return (
    <DashboardShell>
      <LabMarker phase="shell" />
      <DashboardHeader />
      <DashboardFilters />
      <MembersTable members={members} />
      <LabMarker phase="data" />
    </DashboardShell>
  );
}
