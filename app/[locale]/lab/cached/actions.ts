"use server";

import { revalidateTag, updateTag } from "next/cache";

import { CLOCK_TAG } from "@/lib/lab/tags";

/**
 * Read-your-own-writes. `updateTag` expires the entry immediately, and the
 * render that follows this action already shows the new value — no stale
 * content in between. Server Actions only; it is not available in Route
 * Handlers.
 */
export async function updateClock() {
  updateTag(CLOCK_TAG);
}

/**
 * Stale-while-revalidate. The next request is served the value that is
 * already cached while a fresh one is generated behind it, so the timestamp
 * usually changes on the render *after* this one.
 *
 * The second argument is required: the single-argument `revalidateTag(tag)`
 * is deprecated in Next.js 16 and behaves like `updateTag`.
 */
export async function revalidateClock() {
  revalidateTag(CLOCK_TAG, "max");
}
