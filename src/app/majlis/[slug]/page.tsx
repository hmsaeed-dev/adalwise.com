import React from "react";
import { notFound } from "next/navigation";
import { getAllMajlisSessions, getMajlisSessionBySlug } from "@/lib/content/client";
import { getLectureBySlug } from "@/lib/lectures/client";
import { constructMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";
import {
	MajlisDetailHeader,
	MajlisDetailBriefing,
	MajlisDetailChronicle,
	MajlisDetailFooter,
} from "@/features/majlis";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const sessions = await getAllMajlisSessions();
	return sessions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params;
	const doc = await getMajlisSessionBySlug(slug);
	if (!doc) return {};

	return constructMetadata({
		title: `${doc.session.title} — Majlis ${doc.session.number || ""}`,
		description:
			doc.session.objective ||
			doc.session.thesis ||
			doc.session.description ||
			"Adlwise Majlis Gathering",
		canonicalUrl: `/majlis/${slug}`,
	});
}

export default async function MajlisSessionDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const doc = await getMajlisSessionBySlug(slug);

	if (!doc) {
		notFound();
	}

	const { session, content } = doc;
	const inquiries =
		session.keyInquiries && session.keyInquiries.length > 0
			? session.keyInquiries
			: session.discussionPoints || [];

	// Hydrate cross-referenced lectures from catalogue
	const relatedSlugs = Array.from(
		new Set([
			...(session.recordingSlug ? [session.recordingSlug] : []),
			...(session.relatedLectureSlugs || []),
		])
	);
	const lectureResults = await Promise.all(
		relatedSlugs.map((s) => getLectureBySlug(s))
	);
	const relatedLectures = lectureResults.filter(
		(l): l is NonNullable<typeof l> => Boolean(l)
	);

	const isUpcoming = session.status === "upcoming";

	// All sessions for previous/next navigation
	const allSessions = await getAllMajlisSessions();
	const currentIndex = allSessions.findIndex((s) => s.slug === slug);
	const prevSession = currentIndex > 0 ? allSessions[currentIndex - 1] : null;
	const nextSession =
		currentIndex < allSessions.length - 1 ? allSessions[currentIndex + 1] : null;

	return (
		<article className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 flex flex-col gap-10 sm:gap-14 md:gap-16">
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: siteConfig.url },
					{ name: "Majlis", url: `${siteConfig.url}/majlis` },
					{
						name: session.title,
						url: `${siteConfig.url}/majlis/${slug}`,
					},
				]}
			/>

			{/* Act 1: Unified Masthead & Video Dispatch */}
			<MajlisDetailHeader session={session} />

			{/* Act 2: The Core Deliberation Briefing (Inquiries + Takeaways) */}
			<MajlisDetailBriefing
				takeaways={session.keyTakeaways}
				inquiries={inquiries}
			/>

			{/* Act 3: Living Chronicle & Companion Resources */}
			<MajlisDetailChronicle
				session={session}
				content={content}
				relatedLectures={relatedLectures}
			/>

			{/* Act 4: Colophon & Session Navigation */}
			<MajlisDetailFooter
				prevSession={prevSession}
				nextSession={nextSession}
				isUpcoming={isUpcoming}
				registrationUrl={session.registrationUrl}
			/>
		</article>
	);
}
