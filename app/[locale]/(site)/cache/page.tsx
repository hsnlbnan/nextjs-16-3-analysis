import {
  ChapterHeader,
  MethodNote,
  Prose,
  Section,
} from "@/components/chapter";
import { CodeBlock } from "@/components/code-block";
import { CacheExplorer } from "@/components/lab/cache-explorer";
import { LabComparison } from "@/components/lab/lab-comparison";
import { getDictionary, getLocale } from "@/lib/i18n";
import { basePhases, labLabels } from "@/lib/lab/labels";
import { SNIPPET_CACHED } from "@/lib/lab/snippets";

export default async function CacheChapter() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.cache;

  return (
    <div className="mx-auto max-w-[1400px] px-5">
      <ChapterHeader
        index={3}
        eyebrow={t.eyebrow}
        title={t.title}
        lede={t.lede}
      />

      <Section title={t.inversion.title}>
        <Prose>
          <p>{t.inversion.body1}</p>
          <p>{t.inversion.body2}</p>
          <p>{t.inversion.body3}</p>
        </Prose>
      </Section>

      <Section title={t.explorer.title} lede={t.explorer.lede} bleed>
        <div className="max-w-3xl">
          <CacheExplorer copy={t.explorer.copy} />
        </div>
      </Section>

      <Section title={t.live.title} lede={t.live.lede} bleed>
        <LabComparison
          labels={labLabels(dict)}
          panes={[
            {
              id: "cached",
              path: `/${locale}/lab/cached`,
              title: t.live.paneTitle,
              caption: t.live.caption,
              tone: "cached",
              phases: basePhases(dict),
            },
          ]}
        />

        <CodeBlock
          className="mt-4 max-w-3xl"
          filename="app/[locale]/lab/cached/page.tsx"
          code={SNIPPET_CACHED}
          caption={t.code.caption}
        />

        <MethodNote>{dict.common.honesty}</MethodNote>
      </Section>

      <Section title={t.serverless.title}>
        <Prose>
          <p>{t.serverless.body}</p>
        </Prose>
      </Section>
    </div>
  );
}
