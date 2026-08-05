import { cn } from "@/lib/utils";

export function ChapterHeader({
  index,
  eyebrow,
  title,
  lede,
}: {
  index: number;
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="border-border/60 border-b py-14 sm:py-20">
      <p className="text-muted-foreground mb-5 font-mono text-xs tracking-[0.14em] uppercase">
        <span className="text-lab-instant">
          {String(index).padStart(2, "0")}
        </span>
        <span className="text-muted-foreground/40 mx-2.5">/</span>
        {eyebrow}
      </p>
      <h1 className="max-w-[20ch] text-3xl font-medium tracking-[-0.03em] text-balance sm:text-5xl">
        {title}
      </h1>
      <p className="text-muted-foreground measure mt-6 text-[16.5px] leading-[1.65]">
        {lede}
      </p>
    </header>
  );
}

export function Section({
  title,
  lede,
  children,
  bleed = false,
}: {
  title?: string;
  lede?: string;
  children: React.ReactNode;
  /** Demos break the prose measure; prose does not. */
  bleed?: boolean;
}) {
  return (
    <section className="border-border/60 border-b py-14">
      {title ? (
        <h2 className="mb-4 text-xl font-medium tracking-[-0.02em] sm:text-2xl">
          {title}
        </h2>
      ) : null}
      {lede ? (
        <p className="text-muted-foreground measure mb-8 text-[15.5px] leading-[1.7]">
          {lede}
        </p>
      ) : null}
      <div className={cn(bleed ? undefined : "measure")}>{children}</div>
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground measure space-y-5 text-[15.5px] leading-[1.7]">
      {children}
    </div>
  );
}

/**
 * The disclosure that keeps the demos honest. Deliberately not a footnote.
 */
export function MethodNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground/80 border-border/60 mt-5 border-l-2 py-1 pl-4 text-[12.5px] leading-[1.6]">
      {children}
    </p>
  );
}
