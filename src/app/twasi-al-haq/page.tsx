import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllArticles } from "@/lib/content/client";
import {
	DiscourseHeader,
	LeadDispatchCard,
	DispatchFeed,
} from "@/features/discourse";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
	title: "Twasi al-Haq",
	description:
		"Deliberative critique and contemporary constitutional inquiries examined through classical jurisprudence and ethical maxims.",
	canonicalUrl: "/twasi-al-haq",
});

export default async function TwasiAlHaqPage() {
	const articles = await getAllArticles();
	const leadArticle = articles[0];
	const feedArticles = articles.slice(1);

	return (
		<div className="flex flex-col w-full pb-space-2xl">
			<DiscourseHeader />
		</div>
	);
}
