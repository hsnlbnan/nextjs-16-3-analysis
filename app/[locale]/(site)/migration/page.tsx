import { ChapterHeader, Prose, Section } from "@/components/chapter";
import { BuildReportTable } from "@/components/lab/build-report-table";
import { getDictionary } from "@/lib/i18n";

export default async function MigrationChapter() {
  const dict = await getDictionary();
  const t = dict.migration;

  const rows = [t.modes.rows.static, t.modes.rows.dynamic, t.modes.rows.partial];

  return (
    <div className="mx-auto max-w-[1400px] px-5">
      <ChapterHeader
        index={5}
        eyebrow={t.eyebrow}
        title={t.title}
        lede={t.lede}
      />

      <Section title={t.modes.title} bleed>
        <div className="border-border/60 max-w-5xl overflow-hidden rounded-lg border">
          <table className="w-full text-left text-[13.5px]">
            <thead className="text-muted-foreground border-border/60 border-b">
              <tr>
                <th className="w-28 px-4 py-2.5 font-medium">
                  {t.modes.headers.mode}
                </th>
                <th className="px-4 py-2.5 font-medium">
                  {t.modes.headers.before}
                </th>
                <th className="px-4 py-2.5 font-medium">
                  {t.modes.headers.after}
                </th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              {rows.map((row) => (
                <tr key={row.mode} className="align-top">
                  <td className="px-4 py-4 font-medium">{row.mode}</td>
                  <td className="text-muted-foreground px-4 py-4 leading-[1.6]">
                    {row.before}
                  </td>
                  <td className="px-4 py-4 leading-[1.6]">{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={t.report.title} lede={t.report.lede} bleed>
        <div className="max-w-5xl">
          <BuildReportTable copy={t.report.copy} />
        </div>
      </Section>

      <Section title={t.gotchas.title} lede={t.gotchas.lede} bleed>
        <ol className="divide-border/60 max-w-4xl divide-y">
          {t.gotchas.items.map((item, index) => (
            <li key={item.title} className="flex gap-5 py-7 sm:gap-8">
              <span className="text-muted-foreground/50 w-6 shrink-0 pt-1 font-mono text-xs tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <span className="border-border/70 text-muted-foreground rounded-full border px-2 py-0.5 font-mono text-[10.5px]">
                  {item.tag}
                </span>
                <h3 className="mt-3 text-[17px] font-medium tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-2.5 max-w-[68ch] text-[14.5px] leading-[1.65]">
                  {item.body}
                </p>
                <p className="border-lab-instant/40 mt-3.5 max-w-[68ch] border-l-2 py-0.5 pl-3.5 text-[14px] leading-[1.6]">
                  {item.fix}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title={t.order.title}>
        <Prose>
          <p>{t.order.body1}</p>
          <p>{t.order.body2}</p>
        </Prose>
      </Section>
    </div>
  );
}
