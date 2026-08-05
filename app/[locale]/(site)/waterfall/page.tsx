import {
  ChapterHeader,
  MethodNote,
  Prose,
  Section,
} from "@/components/chapter";
import { CodeBlock } from "@/components/code-block";
import { LabComparison } from "@/components/lab/lab-comparison";
import { getDictionary, getLocale } from "@/lib/i18n";
import { basePhases, labLabels } from "@/lib/lab/labels";
import {
  SNIPPET_BOUNDARIES,
  SNIPPET_PARALLEL,
  SNIPPET_SEQUENTIAL,
} from "@/lib/lab/snippets";

export default async function WaterfallChapter() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.waterfall;

  const phases = basePhases(dict);
  const labels = labLabels(dict);

  return (
    <div className="mx-auto max-w-[1400px] px-5">
      <ChapterHeader
        index={2}
        eyebrow={t.eyebrow}
        title={t.title}
        lede={t.lede}
      />

      <Section title={t.demo.title} lede={t.demo.lede} bleed>
        <LabComparison
          labels={labels}
          panes={[
            {
              id: "sequential",
              path: `/${locale}/lab/sequential`,
              title: t.demo.sequential.title,
              caption: t.demo.sequential.caption,
              tone: "blocking",
              phases,
            },
            {
              id: "parallel",
              path: `/${locale}/lab/parallel`,
              title: t.demo.parallel.title,
              caption: t.demo.parallel.caption,
              tone: "instant",
              phases,
            },
          ]}
        />
        <MethodNote>{dict.common.honesty}</MethodNote>
      </Section>

      <Section title={t.code.title} bleed>
        <div className="grid items-stretch gap-4 lg:grid-cols-2">
          <CodeBlock
            filename="app/[locale]/lab/sequential/page.tsx"
            code={SNIPPET_SEQUENTIAL}
            caption={t.code.sequentialCaption}
          />
          <CodeBlock
            filename="app/[locale]/lab/parallel/page.tsx"
            code={SNIPPET_PARALLEL}
            caption={t.code.parallelCaption}
          />
        </div>
      </Section>

      <Section title={t.reading.title}>
        <Prose>
          <p>{t.reading.body1}</p>
          <p>{t.reading.body2}</p>
        </Prose>
      </Section>

      <Section title={t.independent.title} lede={t.independent.lede} bleed>
        <LabComparison
          labels={labels}
          panes={[
            {
              id: "boundaries",
              path: `/${locale}/lab/boundaries`,
              title: t.independent.paneTitle,
              caption: t.independent.caption,
              tone: "instant",
              phases: [
                { id: "shell", label: dict.common.shellPainted },
                { id: "stats", label: t.phases.stats },
                { id: "table", label: t.phases.table },
                { id: "complete", label: dict.common.complete },
              ],
            },
          ]}
        />

        <CodeBlock
          className="mt-4 max-w-3xl"
          filename="app/[locale]/lab/boundaries/page.tsx"
          code={SNIPPET_BOUNDARIES}
          caption={t.independent.codeCaption}
        />

        <div className="measure mt-10">
          <Prose>
            <p>{t.independent.body}</p>
          </Prose>
        </div>
      </Section>
    </div>
  );
}
