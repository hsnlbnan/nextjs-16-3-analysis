import { cacheLife } from "next/cache";
import { codeToHtml } from "shiki";

import { cn } from "@/lib/utils";

/**
 * Highlighting is pure work over a constant input, so it is cached with the
 * longest lifetime available and lands in the static shell. Nothing about a
 * code sample varies per request.
 */
async function highlight(code: string, lang: string): Promise<string> {
  "use cache";
  cacheLife("max");

  return codeToHtml(code, {
    lang,
    theme: "vesper",
  });
}

export async function CodeBlock({
  code,
  lang = "tsx",
  filename,
  caption,
  className,
}: {
  code: string;
  lang?: string;
  filename?: string;
  caption?: string;
  className?: string;
}) {
  const html = await highlight(code.trim(), lang);

  return (
    <figure
      className={cn(
        "border-border/60 bg-card/40 flex h-full flex-col overflow-hidden rounded-lg border",
        className,
      )}
    >
      {filename ? (
        <div className="border-border/50 text-muted-foreground border-b px-3.5 py-2 font-mono text-[11.5px]">
          {filename}
        </div>
      ) : null}

      <div
        className="shiki-host min-h-0 flex-1 overflow-x-auto px-3.5 py-3 text-[12.5px] leading-[1.65]"
        // Shiki output, generated at build time from a string literal in this repo.
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {caption ? (
        <figcaption className="border-border/50 text-muted-foreground border-t px-3.5 py-2 text-[12.5px]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
