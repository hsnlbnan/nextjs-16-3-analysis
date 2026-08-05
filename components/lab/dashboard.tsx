import type { Member, Stat } from "@/lib/lab/data";
import { cn } from "@/lib/utils";

/**
 * The demo page's chrome. Everything in this file renders without touching the
 * query — which is the entire point of the chapters that use it. When a route
 * awaits at the top, all of this waits too, for data it never reads.
 */

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <DashboardTopBar />
      <div className="flex flex-1 flex-col gap-5 p-5">{children}</div>
    </div>
  );
}

function DashboardTopBar() {
  return (
    <header className="border-border/60 flex h-11 shrink-0 items-center gap-3 border-b px-5">
      <div className="bg-foreground/90 size-4 rounded-[5px]" aria-hidden />
      <span className="text-[13px] font-medium tracking-tight">Northwind</span>
      <nav className="text-muted-foreground ml-3 flex items-center gap-3 text-[12px]">
        <span className="text-foreground">Members</span>
        <span>Billing</span>
        <span>Settings</span>
      </nav>
      <div className="bg-muted ml-auto size-6 rounded-full" aria-hidden />
    </header>
  );
}

export function DashboardHeader() {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div>
        <h1 className="text-[19px] font-medium tracking-[-0.01em]">Members</h1>
        <p className="text-muted-foreground mt-1 text-[12px]">
          Everyone with access to this workspace.
        </p>
      </div>
      <div className="bg-foreground text-background rounded-md px-2.5 py-1.5 text-[12px] font-medium">
        Invite
      </div>
    </div>
  );
}

export function DashboardFilters() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {["All", "Admins", "Active", "Invited", "Suspended"].map((filter, i) => (
        <span
          key={filter}
          className={cn(
            "rounded-md px-2 py-1 text-[12px]",
            i === 0
              ? "bg-muted text-foreground"
              : "text-muted-foreground border-border/70 border",
          )}
        >
          {filter}
        </span>
      ))}
      <span className="border-border/70 text-muted-foreground ml-auto rounded-md border px-2 py-1 text-[12px]">
        Search…
      </span>
    </div>
  );
}

const STATUS_STYLES: Record<Member["status"], string> = {
  active: "text-lab-instant bg-lab-instant-muted",
  invited: "text-muted-foreground bg-muted",
  suspended: "text-lab-blocking bg-lab-blocking-muted",
};

export function MembersTable({ members }: { members: readonly Member[] }) {
  return (
    <div className="border-border/60 overflow-hidden rounded-lg border">
      <table className="w-full text-left text-[12px]">
        <thead className="text-muted-foreground border-border/60 border-b">
          <tr>
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Role</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 text-right font-medium">Seats</th>
          </tr>
        </thead>
        <tbody className="divide-border/50 divide-y">
          {members.map((member) => (
            <tr key={member.id}>
              <td className="px-3 py-2">
                <div className="font-medium">{member.name}</div>
                <div className="text-muted-foreground">{member.email}</div>
              </td>
              <td className="text-muted-foreground px-3 py-2">{member.role}</td>
              <td className="px-3 py-2">
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[11px]",
                    STATUS_STYLES[member.status],
                  )}
                >
                  {member.status}
                </span>
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {member.seats}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * The fallback reserves the same space the table will occupy, which is why
 * nothing on the page jumps when the rows land.
 */
export function MembersTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="border-border/60 overflow-hidden rounded-lg border">
      <div className="border-border/60 text-muted-foreground flex border-b px-3 py-2 text-[12px]">
        <span className="flex-1">Name</span>
        <span className="w-16">Role</span>
        <span className="w-20">Status</span>
        <span className="w-12 text-right">Seats</span>
      </div>
      <div className="divide-border/50 divide-y">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2">
            <div className="flex-1 space-y-1.5">
              <div className="bg-muted h-2.5 w-28 rounded" />
              <div className="bg-muted/60 h-2 w-40 rounded" />
            </div>
            <div className="bg-muted/60 h-2.5 w-12 rounded" />
            <div className="bg-muted/60 h-2.5 w-14 rounded" />
            <div className="bg-muted/60 h-2.5 w-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsRow({ stats }: { stats: readonly Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="border-border/60 rounded-lg border px-3 py-2.5"
        >
          <div className="text-muted-foreground text-[11px]">{stat.label}</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[17px] font-medium tabular-nums">
              {stat.value}
            </span>
            <span
              className={cn(
                "text-[11px] tabular-nums",
                stat.direction === "up" && "text-lab-instant",
                stat.direction === "down" && "text-lab-blocking",
                stat.direction === "flat" && "text-muted-foreground",
              )}
            >
              {stat.delta}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="border-border/60 space-y-2 rounded-lg border px-3 py-2.5"
        >
          <div className="bg-muted/60 h-2 w-16 rounded" />
          <div className="bg-muted h-4 w-10 rounded" />
        </div>
      ))}
    </div>
  );
}
