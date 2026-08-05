/**
 * Reading versions of the demo routes. Timing markers are stripped so the
 * shape is legible; every snippet's `filename` points at the real file, and
 * every demo pane links to the running route.
 */

export const SNIPPET_BLOCKING = `export const instant = false;

export default async function Page({ searchParams }) {
  const { latency } = await searchParams;
  const members = await loadMembers(latency);

  return (
    <DashboardShell>
      <DashboardHeader />
      <DashboardFilters />
      <MembersTable members={members} />
    </DashboardShell>
  );
}`;

export const SNIPPET_STREAMING = `export default function Page({ searchParams }) {
  return (
    <DashboardShell>
      <DashboardHeader />
      <DashboardFilters />
      <Suspense fallback={<MembersTableSkeleton />}>
        {/* searchParams is passed down, not awaited here */}
        <MembersRegion searchParams={searchParams} />
      </Suspense>
    </DashboardShell>
  );
}

async function MembersRegion({ searchParams }) {
  const { latency } = await searchParams;
  const members = await loadMembers(latency);

  return <MembersTable members={members} />;
}`;

export const SNIPPET_SEQUENTIAL = `async function Region({ searchParams }) {
  const { latency } = await searchParams;

  // The second query does not start until the first resolves.
  const stats = await loadStats(latency * 0.55);
  const members = await loadMembers(latency);

  return (
    <>
      <StatsRow stats={stats} />
      <MembersTable members={members} />
    </>
  );
}`;

export const SNIPPET_PARALLEL = `async function Region({ searchParams }) {
  const { latency } = await searchParams;

  // Both are in flight before either is awaited.
  const [stats, members] = await Promise.all([
    loadStats(latency * 0.55),
    loadMembers(latency),
  ]);

  return (
    <>
      <StatsRow stats={stats} />
      <MembersTable members={members} />
    </>
  );
}`;

export const SNIPPET_CACHED = `async function getCachedClock() {
  'use cache';
  cacheLife('minutes');
  cacheTag('lab-clock');

  // Legal here, and meaningful: inside a cache scope this evaluates once,
  // when the entry is written.
  return new Date().toISOString();
}

// ---- actions.ts ----
'use server';

export async function updateClock() {
  updateTag('lab-clock');
}

export async function revalidateClock() {
  revalidateTag('lab-clock', 'max');
}`;

export const SNIPPET_BOUNDARIES = `export default function Page({ searchParams }) {
  return (
    <DashboardShell>
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
}`;
