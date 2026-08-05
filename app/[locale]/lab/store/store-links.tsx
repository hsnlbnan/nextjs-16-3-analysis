"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { PRODUCTS, type LinkMode } from "@/lib/lab/products";

function parseMode(value: string | null): LinkMode {
  return value === "eager" || value === "off" ? value : "auto";
}

/**
 * The three `<Link>` behaviours, side by side.
 *
 * `useSearchParams()` suspends during server rendering because the params are
 * not known at build time, which is why the page wraps this in `<Suspense>`.
 * On a client navigation the router already has them and it resolves
 * synchronously — the same component, two different initial states.
 */
export function StoreLinks({ locale }: { locale: string }) {
  const mode = parseMode(useSearchParams().get("mode"));

  return (
    <nav className="flex flex-wrap gap-2">
      {PRODUCTS.map((product) => {
        const href = `/${locale}/lab/store/${product.slug}`;
        const className =
          "border-border/70 hover:border-lab-instant/50 hover:text-lab-instant rounded-md border px-3 py-1.5 text-[12.5px] transition-colors";

        // Written out rather than computed, so the three call sites read the
        // way they would in your own code.
        if (mode === "eager") {
          return (
            <Link key={product.slug} href={href} className={className} prefetch>
              {product.name}
            </Link>
          );
        }

        if (mode === "off") {
          return (
            <Link
              key={product.slug}
              href={href}
              className={className}
              prefetch={false}
            >
              {product.name}
            </Link>
          );
        }

        return (
          <Link key={product.slug} href={href} className={className}>
            {product.name}
          </Link>
        );
      })}
    </nav>
  );
}
