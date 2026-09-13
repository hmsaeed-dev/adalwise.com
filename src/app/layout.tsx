import type { Metadata } from "next";
import { ebGaramond, inter, notoUrdu, amiri } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrganizationJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${inter.variable} ${notoUrdu.variable} ${amiri.variable}`}
    >
      <body className="bg-surface text-on-surface font-sans antialiased flex flex-col min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-surface focus:rounded-full focus:shadow-lg focus:outline-none font-label-md uppercase tracking-wider"
        >
          Skip to main content
        </a>
        <OrganizationJsonLd />
        <Header />
        <main id="main-content" className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
