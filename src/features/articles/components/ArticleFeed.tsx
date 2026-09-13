import React from "react";
import { ArticleDoc } from "@/lib/content/schemas";
import { ArticleCard } from "./ArticleCard";

interface ArticleFeedProps {
	articles: ArticleDoc[];
	title?: string;
}

export function ArticleFeed({
	articles,
	title = "Treatises & Monographs",
}: ArticleFeedProps) {
	if (!articles || articles.length === 0) {
		return null;
	}

	return (
		<section className="w-full px-gutter-mobile md:px-gutter-desktop flex flex-col gap-space-md max-w-container-max mx-auto py-space-md">
			<div className="flex items-baseline justify-between border-b border-surface-container-high pb-space-xs">
				<h2 className="font-headline-md text-primary font-bold font-serif">
					{title}
				</h2>
				<span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">
					{articles.length} {articles.length === 1 ? "Publication" : "Publications"}
				</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
				{articles.map((article) => (
					<ArticleCard key={article.slug} article={article} />
				))}
			</div>
		</section>
	);
}
