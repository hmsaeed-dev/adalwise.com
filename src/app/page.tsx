import React from "react";
import {
	HeroSection,
	DiscourseHighlight,
	StreamsSection,
	FeaturedTreatiseCard,
	SynthesisSection,
} from "@/features/home";
import { AudioPlayerWidget } from "@/components/media/AudioPlayerWidget";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
	title: "Adlwise",
	description:
		"An academic initiative dedicated to justice and wisdom (Adl wa Hikmah)",
	canonicalUrl: "/",
});

export default function HomePage() {
	return (
		<div className="flex flex-col w-full pb-space-2xl">
			<HeroSection />
			<DiscourseHighlight />
			<StreamsSection />
			<FeaturedTreatiseCard />

			{/* Exegesis Audio Widget Section */}
			<section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-md max-w-container-max mx-auto">
				<AudioPlayerWidget
					title="Surah al-An'am — Divine Justice and Ontological Order"
					urduTag="تفسیرِ قرآن"
					totalDurationSeconds={1480}
					initialSeconds={255}
				/>
			</section>

			<SynthesisSection />
		</div>
	);
}
