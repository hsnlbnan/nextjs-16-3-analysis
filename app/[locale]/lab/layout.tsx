import { LabBootstrap } from "@/components/lab/markers";

/**
 * Bare chrome. These routes are real pages — you can open any of them
 * directly — but they are usually rendered inside an iframe on a chapter page,
 * so they carry no site header and no navigation.
 *
 * `LabBootstrap` comes first in document order so `window.__lab` exists before
 * any marker downstream can fire.
 */
export default function LabLayout({
  children,
}: LayoutProps<"/[locale]/lab">) {
  return (
    <div className="bg-background min-h-dvh">
      <LabBootstrap />
      {children}
    </div>
  );
}
