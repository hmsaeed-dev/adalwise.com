import React from "react";
import {
	HeroSection,
	StatsMarquee,
	StreamsSection,
	SynthesisSection,
} from "@/features/home";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
	title: "Home",
	description:
		"An academic initiative dedicated to justice and wisdom (Adl wa Hikmah)",
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
