import React from "react";
import { getAllArticles } from "@/lib/content/client";
import { ArticlesHeader, ArticleCard } from "@/features/articles";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Treatises & Monographs — Classical Jurisprudence",
  description:
    "Rigorous academic research monographs and legal treatises on constitutionalism, contractual equity, and Usul al-Fiqh.",
  canonicalUrl: "/articles",
});

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="flex flex-col w-full pb-space-2xl">
      <ArticlesHeader />

      <section className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl flex flex-col gap-space-lg">
        <div className="flex items-baseline justify-between border-b border-surface-container-high pb-space-xs">
          <span className="font-label-md uppercase tracking-wider text-on-surface-variant font-bold text-[12px]">
            Published Manuscripts ({articles.length})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
