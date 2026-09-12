import React from "react";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
	title: "About Us — Credibility Hub",
	description:
		"Intellectual mandate, faculty dossier of Dr. Hafiz Haseeb, and research methodologies of the Adlwise Institute.",
	canonicalUrl: "/about",
});

export default function AboutPage() {
	return (
		<div className="flex flex-col w-full pb-space-2xl">
			{/* Page Opening Heading */}
			<div className="px-gutter-mobile md:px-gutter-desktop pt-space-xl pb-space-md flex flex-col items-center text-center max-w-container-max mx-auto">
			</div>

		</div>
	);
}
