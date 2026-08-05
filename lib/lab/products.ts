/**
 * Pure product data, with no server-only imports, so the Client Components in
 * the store can use it. The cached loaders live in `lib/lab/data.ts` — pulling
 * a `use cache` function into a Client Component is a build error.
 */

export type Product = {
  slug: string;
  name: string;
  price: string;
  blurb: string;
};

export type LinkMode = "auto" | "eager" | "off";

export const PRODUCTS: readonly Product[] = [
  {
    slug: "shoes",
    name: "Trail Runner",
    price: "$148",
    blurb: "A neutral trail shoe with a rock plate and a 6mm drop.",
  },
  {
    slug: "hats",
    name: "Baseball Cap",
    price: "$32",
    blurb: "Six panel, unstructured, garment-dyed cotton twill.",
  },
  {
    slug: "socks",
    name: "Merino Crew",
    price: "$21",
    blurb: "Mid-weight merino with a reinforced heel and toe.",
  },
];
