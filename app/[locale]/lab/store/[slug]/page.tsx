import { Suspense } from "react";
import { notFound } from "next/navigation";

import { NavBeacon } from "@/components/lab/nav-beacon";
import { getInventory, getProduct, PRODUCTS } from "@/lib/lab/data";
import { getDictionary } from "@/lib/i18n";

type Params = PageProps<"/[locale]/lab/store/[slug]">["params"];

/**
 * The shape from the instant-navigation guide: product details are cached and
 * ride along in the App Shell, inventory has to be fresh and stays behind its
 * own boundary. Both await `params`, so both suspend — neither is allowed to
 * tie the shared shell to one URL.
 */
export default function ProductPage(
  props: PageProps<"/[locale]/lab/store/[slug]">,
) {
  return (
    <div className="space-y-4">
      <Suspense fallback={<InfoSkeleton />}>
        <ProductInfo params={props.params} />
      </Suspense>
      <Suspense fallback={<InventorySkeleton />}>
        <Inventory params={props.params} />
      </Suspense>
    </div>
  );
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

async function ProductInfo({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-xl font-medium tracking-[-0.01em]">{product.name}</h1>
      <p className="text-lab-cached mt-1 font-mono text-[15px] tabular-nums">
        {product.price}
      </p>
      <p className="text-muted-foreground mt-2 max-w-[48ch] text-[13px] leading-[1.6]">
        {product.blurb}
      </p>
      <NavBeacon phase="product" />
    </div>
  );
}

async function Inventory({ params }: { params: Params }) {
  const [{ slug }, dict] = await Promise.all([params, getDictionary()]);
  const count = await getInventory(slug, 900);

  return (
    <p className="border-border/60 text-lab-instant rounded-lg border px-3 py-2 text-[13px]">
      {dict.lab.store.inStock.replace("{count}", String(count))}
      <NavBeacon phase="inventory" />
    </p>
  );
}

function InfoSkeleton() {
  return (
    <div className="space-y-2">
      <div className="bg-muted h-6 w-40 rounded" />
      <div className="bg-muted/60 h-4 w-16 rounded" />
      <div className="bg-muted/50 h-3 w-72 rounded" />
    </div>
  );
}

async function InventorySkeleton() {
  const dict = await getDictionary();

  return (
    <p className="border-border/60 text-muted-foreground rounded-lg border px-3 py-2 text-[13px]">
      {dict.lab.store.checking}
    </p>
  );
}
