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
import { SNIPPET_BLOCKING, SNIPPET_STREAMING } from "@/lib/lab/snippets";

export default async function SuspenseChapter() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.suspense;

  const phases = basePhases(dict);
  const labels = labLabels(dict);

  return (
    <div className="mx-auto max-w-[1400px] px-5">
      <ChapterHeader
        index={1}
        eyebrow={t.eyebrow}
        title={t.title}
        lede={t.lede}
      />

      <Section title={t.demo.title} lede={t.demo.lede} bleed>
        <LabComparison
          labels={labels}
          panes={[
            {
              id: "blocking",
              path: `/${locale}/lab/blocking`,
              title: t.demo.blocking.title,
              caption: t.demo.blocking.caption,
              tone: "blocking",
              phases,
            },
            {
              id: "streaming",
              path: `/${locale}/lab/streaming`,
              title: t.demo.streaming.title,
              caption: t.demo.streaming.caption,
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
            filename="app/[locale]/lab/blocking/page.tsx"
            code={SNIPPET_BLOCKING}
            caption={t.code.blockingCaption}
          />
          <CodeBlock
            filename="app/[locale]/lab/streaming/page.tsx"
            code={SNIPPET_STREAMING}
            caption={t.code.streamingCaption}
          />
        </div>
        <MethodNote>{t.code.note}</MethodNote>
      </Section>

      <Section title={t.reading.title}>
        <Prose>
          <p>{t.reading.body1}</p>
          <p>{t.reading.body2}</p>
          <p>{t.reading.body3}</p>
        </Prose>
      </Section>

      <Section title={t.placement.title}>
        <Prose>
          <p>{t.placement.body1}</p>
          <p>{t.placement.body2}</p>
          <p>{t.placement.body3}</p>
        </Prose>
      </Section>

      <Section title={t.shell.title}>
        <Prose>
          <p>{t.shell.body}</p>
        </Prose>
      </Section>
    </div>
  );
}
