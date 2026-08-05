"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Dictionary } from "@/lib/dictionaries/en";
import { chapters } from "@/lib/chapters";
import { cn } from "@/lib/utils";
import { localeNames, locales, swapLocale, type Locale } from "@/lib/locales";

const REPO_URL = "https://github.com/hsnlbnan/instant-lab";

export function SiteHeader({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const pathname = usePathname();

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-6 px-5">
        <Link
          href={`/${locale}`}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="text-[15px] font-medium tracking-tight">
            Instant Lab
          </span>
          <span className="border-border/80 text-muted-foreground rounded-full border px-1.5 py-px font-mono text-[10px] leading-4 tabular-nums">
            16.3
          </span>
        </Link>

        <nav className="scrollbar-none -mx-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1">
          {chapters.map((chapter) => {
            const href = `/${locale}/${chapter.slug}`;
            const active = pathname === href;

            return (
              <Link
                key={chapter.slug}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "hover:text-foreground hover:bg-muted/60 rounded-md px-2.5 py-1.5 text-[13px] whitespace-nowrap transition-colors",
                  active ? "text-foreground bg-muted/70" : "text-muted-foreground",
                )}
              >
                <span className="text-muted-foreground/60 mr-1.5 font-mono text-[11px] tabular-nums">
                  {chapter.index}
                </span>
                {dict.nav[chapter.navKey]}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <div
            className="border-border/70 flex items-center rounded-md border p-0.5"
            role="group"
            aria-label="Language"
          >
            {locales.map((value) => (
              <Link
                key={value}
                href={swapLocale(pathname, value)}
                aria-current={value === locale ? "true" : undefined}
                className={cn(
                  "rounded-[5px] px-1.5 py-0.5 font-mono text-[11px] uppercase transition-colors",
                  value === locale
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="sr-only">{localeNames[value]}</span>
                <span aria-hidden>{value}</span>
              </Link>
            ))}
          </div>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md px-2.5 py-1.5 text-[13px] transition-colors"
          >
            {dict.nav.repo}
          </a>
        </div>
      </div>
    </header>
  );
}
