import React from "react";
import { constructMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";
import { StudyNotesArchiveView } from "@/features/lectures";

export const metadata = constructMetadata({
	title: "Study Notes & Reference Archive",
	description:
		"A permanent library of linguistic infographics, prophetic chronologies, and research monographs accompanying Dr. Hafiz Haseeb's discourses.",
	canonicalUrl: "/lectures/notes",
});

export default function StudyNotesArchivePage() {
	return (
		<>
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: siteConfig.url },
					{ name: "Listen", url: `${siteConfig.url}/lectures` },
					{ name: "Study Notes", url: `${siteConfig.url}/lectures/notes` },
				]}
			/>
			<StudyNotesArchiveView />
		</>
	);
}

