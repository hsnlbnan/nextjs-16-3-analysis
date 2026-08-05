/**
 * Locale primitives with no server-only imports, so Client Components can use
 * them. Anything that touches `next/root-params` lives in `lib/i18n.ts`, which
 * fails to build if a Client Component imports it.
 */

export const locales = ["en", "tr"] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Rewrites `/en/suspense` to `/tr/suspense`. */
export function swapLocale(pathname: string, next: Locale): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    segments[1] = next;
    return segments.join("/");
  }
  return `/${next}${pathname}`;
}
