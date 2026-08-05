import { Suspense } from "react";

import { LabMarker } from "@/components/lab/markers";
import { getLocale } from "@/lib/i18n";
import { StoreLinks } from "./store-links";

/**
 * The product nav lives in the layout on purpose. A client navigation between
 * two products only re-renders below the layout they share, so this header and
 * these links never re-render — which is exactly the boundary that decides what
 * a navigation can show instantly.
 */
export default async function StoreLayout({
  children,
}: LayoutProps<"/[locale]/lab/store">) {
  const locale = await getLocale();

  return (
    <div className="flex min-h-dvh flex-col">
      <LabMarker phase="shell" />

      <header className="border-border/60 space-y-3 border-b px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-foreground/90 size-4 rounded-[5px]" aria-hidden />
          <span className="text-[13px] font-medium tracking-tight">
            Northwind Supply
          </span>
        </div>

        <Suspense fallback={<div className="h-[30px]" />}>
          <StoreLinks locale={locale} />
        </Suspense>
      </header>

      <div className="flex-1 p-5">{children}</div>
    </div>
  );
}
