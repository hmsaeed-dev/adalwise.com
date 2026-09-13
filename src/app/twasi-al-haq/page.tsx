import React from "react";
import { getAllArticles } from "@/lib/content/client";
import {
	TwasiHero,
	LeadArticleCard,
	ArticleFeed,
} from "@/features/articles";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
	title: "Twasi al-Haq — Treatises & Academic Inquiries",
	description:
		"Deliberative critique and contemporary constitutional inquiries examined through classical jurisprudence and ethical maxims.",
	canonicalUrl: "/twasi-al-haq",
});

export default async function TwasiAlHaqPage() {
	const articles = await getAllArticles();
	const leadArticle = articles[0];
	const feedArticles = articles.slice(1);

	return (
		<div className="flex flex-col w-full pb-space-2xl bg-surface text-on-surface">
			<TwasiHero />

			{leadArticle && <LeadArticleCard article={leadArticle} />}

			{feedArticles.length > 0 && (
				<ArticleFeed articles={feedArticles} title="Archived Monographs & Treatises" />
			)}
		</div>
	);
}
