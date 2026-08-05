import type { Dictionary } from "@/lib/dictionaries/en";

export type ChapterSlug =
  | "suspense"
  | "waterfall"
  | "cache"
  | "prefetch"
  | "migration";

export type Chapter = {
  slug: ChapterSlug;
  /** Key into `dictionary.nav`, so the label is translated. */
  navKey: keyof Dictionary["nav"];
  /** Chapter number shown in the rail. */
  index: number;
};

export const chapters: readonly Chapter[] = [
  { slug: "suspense", navKey: "suspense", index: 1 },
  { slug: "waterfall", navKey: "waterfall", index: 2 },
  { slug: "cache", navKey: "cache", index: 3 },
  { slug: "prefetch", navKey: "prefetch", index: 4 },
  { slug: "migration", navKey: "migration", index: 5 },
] as const;
