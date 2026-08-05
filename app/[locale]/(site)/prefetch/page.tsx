import { ChapterHeader, Prose, Section } from "@/components/chapter";
import { PrefetchLab } from "@/components/lab/prefetch-lab";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function PrefetchChapter() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.prefetch;

  return (
    <div className="mx-auto max-w-[1400px] px-5">
      <ChapterHeader
        index={4}
        eyebrow={t.eyebrow}
        title={t.title}
        lede={t.lede}
      />

      <Section title={t.shells.title}>
        <Prose>
          <p>{t.shells.body1}</p>
          <p>{t.shells.body2}</p>
        </Prose>
      </Section>

      <Section title={t.demo.title} lede={t.demo.lede} bleed>
        <div className="max-w-5xl">
          <PrefetchLab
            path={`/${locale}/lab/store`}
            copy={t.demo.copy}
            isDev={process.env.NODE_ENV === "development"}
          />
        </div>
      </Section>

      <Section title={t.reading.title}>
        <Prose>
          <p>{t.reading.body1}</p>
          <p>{t.reading.body2}</p>
          <p>{t.reading.body3}</p>
        </Prose>
      </Section>
    </div>
  );
}
