import React from "react";
import { getAllMajlisSessions } from "@/lib/content/client";
import {
	MajlisHero,
	MajlisChrono,
} from "@/features/majlis";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Majlis — Study Gatherings",
  description:
    "Fortnightly gatherings convened in Dr. Hafiz Haseeb's Lahore library over tea, text, and candid jurisprudential inquiry.",
  canonicalUrl: "/majlis",
});

export default async function MajlisPage() {
  const sessions = await getAllMajlisSessions();

  return (
		<div className="flex flex-col w-full pb-space-2xl">
			<MajlisHero />
			<MajlisChrono sessions={sessions} />
		</div>
  );
}
