import React from "react";
import {
	HeroSection,
	StatsMarquee,
	StreamsSection,
	SynthesisSection,
} from "@/features/home";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
	title: `${siteConfig.name} — ${siteConfig.tagline} | ${siteConfig.urduTagline}`,
	description:
		"An academic initiative dedicated to justice and wisdom (Adl wa Hikmah) through Quranic hermeneutics, classical Islamic jurisprudence, and constitutional statecraft.",
	canonicalUrl: "/",
});


export default function HomePage() {
	return (
		<div className="flex flex-col w-full pb-space-2xl">
			<HeroSection />
			<StatsMarquee />
			<StreamsSection />
			<SynthesisSection />
		</div>
	);
}
