import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { locale } from "next/root-params";

import "../globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { getDictionary, locales } from "@/lib/i18n";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * Required, not optional. With Cache Components enabled every root param must
 * have at least one value here or the build fails — the root param has to be
 * knowable at build time for the shell to be prerenderable at all.
 */
export function generateStaticParams() {
  return locales.map((value) => ({ locale: value }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();

  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

/**
 * The root layout. It deliberately holds nothing but the document shell —
 * chrome lives in `(site)/layout.tsx` so the lab routes, which render inside
 * iframes, do not inherit a site header they should not have.
 */
export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  return (
    <html
      lang={await locale()}
      className={`dark ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-dvh font-sans antialiased">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
