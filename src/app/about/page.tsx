import React from "react";
import {
	AboutHero,
	MethodSection,
	BioSection,
	CircleSection,
	WorkSection,
	MoharClose,
} from "@/features/about";
import { constructMetadata } from "@/lib/seo/metadata";
import { PersonJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
	title: "About Us",
	description:
		"A physician’s inquiry into the Quran, living jurisprudence, and constitutional statecraft. The intellectual mandate, lineage, and background of Dr. Hafiz Haseeb.",
	canonicalUrl: "/about",
	image: "/images/haseeb-02.jpg",
});

export default function AboutPage() {
	return (
		<div className="flex flex-col w-full bg-surface text-on-surface">
			{/* Structured Data for E-E-A-T Authority */}
			<PersonJsonLd
				name={siteConfig.author.name}
				alternateName={siteConfig.author.urduName}
				jobTitle="Consultant Hematologist & Quranic Researcher"
				description="Consultant Hematologist (FCPS) and researcher in classical Islamic jurisprudence, Quranic hermeneutics, and constitutional statecraft. Student of Dr. Israr Ahmed and founder of Peaceful Quranic Revival Society (PQRS)."
				image={`${siteConfig.url}/images/haseeb-02.jpg`}
				sameAs={[siteConfig.links.youtube, siteConfig.links.twitter]}
			/>

			{/* Section 1: Hero (Asymmetric Nastaliq Anchor) */}
			<AboutHero />

			{/* Section 2: The Method (Thesis: Adl + Hikmah Indivisibility) */}
			<MethodSection />

			{/* Section 3: The Person (Dr. Hafiz Haseeb: Matn & Hashiya Split) */}
			<BioSection />

			{/* Section 4: The Circle (Collegiate Inquiries: Minimal Typographic List) */}
			<CircleSection />

			{/* Section 5: The Work (The Four Streams Gateway Outward) */}
			<WorkSection />

			{/* Section 6: Close (Single Stamped Mohar Seal & Colophon) */}
			<MoharClose />
		</div>
	);
}
