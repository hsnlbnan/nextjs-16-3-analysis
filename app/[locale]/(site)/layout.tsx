import { SiteHeader } from "@/components/site-header";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function SiteLayout({
  children,
}: LayoutProps<"/[locale]">) {
  // Both are cached with `cacheLife('max')`, so this whole layout lands in the
  // static shell and the header is never a reason for a route to block.
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <>
      <SiteHeader dict={dict} locale={locale} />
      <main id="content">{children}</main>
    </>
  );
}
