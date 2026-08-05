import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { chapters } from "@/lib/chapters";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function HomePage() {
  // Both are cached, and neither depends on the other. Starting them together
  // costs the slower of the two rather than the sum — the lesson from chapter 2,
  // applied to this page.
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <div className="mx-auto max-w-[1400px] px-5">
      <section className="border-border/60 border-b py-20 sm:py-28">
        <p className="text-lab-instant mb-5 font-mono text-xs tracking-[0.14em] uppercase">
          {dict.home.eyebrow}
        </p>
        <h1 className="max-w-[18ch] text-4xl font-medium tracking-[-0.03em] text-balance sm:text-6xl">
          {dict.home.title}
        </h1>
        <p className="text-muted-foreground measure mt-7 text-[17px] leading-[1.65]">
          {dict.home.lede}
        </p>

        <Link
          href={`/${locale}/suspense`}
          className="bg-foreground text-background hover:bg-foreground/90 mt-10 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-[color,background-color,scale] active:scale-[0.96]"
        >
          {dict.home.start}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>

      <section className="border-border/60 border-b py-12">
        <div className="measure">
          <h2 className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
            {dict.home.method.title}
          </h2>
          <p className="text-muted-foreground mt-4 text-[15px] leading-[1.7]">
            {dict.home.method.body}
          </p>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-muted-foreground mb-2 font-mono text-xs tracking-[0.14em] uppercase">
          {dict.home.chaptersTitle}
        </h2>

        <ul className="divide-border/60 divide-y">
          {chapters.map((chapter) => {
            const copy = dict.home.chapters[chapter.slug];

            return (
              <li key={chapter.slug}>
                <Link
                  href={`/${locale}/${chapter.slug}`}
                  className="group hover:bg-muted/30 -mx-4 flex items-baseline gap-5 rounded-lg px-4 py-7 transition-colors sm:gap-8"
                >
                  <span className="text-muted-foreground/50 w-6 shrink-0 font-mono text-xs tabular-nums">
                    {String(chapter.index).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="group-hover:text-lab-instant block text-lg font-medium tracking-[-0.01em] transition-colors sm:text-xl">
                      {copy.title}
                    </span>
                    <span className="text-muted-foreground mt-2 block max-w-[62ch] text-[15px] leading-[1.65]">
                      {copy.body}
                    </span>
                  </span>

                  <ArrowRight
                    className="text-muted-foreground/40 group-hover:text-lab-instant mt-1 size-4 shrink-0 transition-[color,translate] group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
