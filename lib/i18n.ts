import { cacheLife } from "next/cache";
import { locale } from "next/root-params";

import type { Dictionary } from "@/lib/dictionaries/en";
import { isLocale, type Locale } from "@/lib/locales";

export { locales, localeNames, isLocale, swapLocale } from "@/lib/locales";
export type { Locale } from "@/lib/locales";

/**
 * Loads the dictionary for the current root param.
 *
 * Two things here are the whole argument for `next/root-params`:
 *
 * 1. Nothing passed `locale` in. This function sits in `lib/`, nowhere near a
 *    layout, and still knows which locale it is rendering for. The alternatives
 *    are prop-drilling a string through every component that needs one, or
 *    reading `headers()` — and that second one makes every route in the app
 *    request-bound, which costs you the prerender. That is the exact cost
 *    `next-intl`'s `requestLocale` used to impose.
 *
 * 2. The `locale()` call is *inside* the `use cache` scope. Next.js tracks
 *    which root param getters a cached function calls, so this cache key
 *    includes `locale` and nothing else. Without root params you would have to
 *    await `params` outside the cached function and pass the value in.
 */
export async function getDictionary(): Promise<Dictionary> {
  "use cache";
  cacheLife("max");

  const resolved = await getLocale();
  const mod = (await import(`@/lib/dictionaries/${resolved}`)) as Record<
    string,
    Dictionary
  >;

  return mod[resolved];
}

export async function getLocale(): Promise<Locale> {
  const current = await locale();
  return isLocale(current) ? current : "en";
}
