import React from "react";
import { notFound } from "next/navigation";
import { getAllMajlisSessions, getMajlisSessionBySlug } from "@/lib/content/client";
import { getLectureBySlug } from "@/lib/lectures/client";
import { constructMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";
import {
	MajlisDetailHeader,
	MajlisDetailMedia,
	MajlisDetailCharter,
	MajlisDetailExperience,
	MajlisDetailGallery,
	MajlisDetailSpeakers,
	MajlisDetailTakeaways,
	MajlisDetailMaterials,
	MajlisDetailProceedings,
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

	const hasRetreatSchedule =
		session.number === "03" ||
		Boolean(session.format?.toLowerCase().includes("retreat"));

	return (
		<article className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 flex flex-col gap-10 sm:gap-14 md:gap-16">
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

			{/* 1. Header & Navigation */}
			<MajlisDetailHeader session={session} />

			{/* 2. Media Masthead & Video Dispatch */}
			<MajlisDetailMedia session={session} />

			{/* 3. Charter of Deliberation */}
			{session.objective && (
				<MajlisDetailCharter objective={session.objective} />
			)}

			{/* 4. The Experience (Retreat Anatomy) */}
			{hasRetreatSchedule && <MajlisDetailExperience />}

			{/* 5. Photographic Chronicle */}
			{session.gallery && session.gallery.length > 0 && (
				<MajlisDetailGallery gallery={session.gallery} />
			)}

			{/* 6. Speakers & Deliberation Panel */}
			{session.speakers && session.speakers.length > 0 && (
				<MajlisDetailSpeakers speakers={session.speakers} />
			)}

			{/* 7. Key Points & Juristic Takeaways */}
			{((session.keyTakeaways && session.keyTakeaways.length > 0) ||
				inquiries.length > 0) && (
				<MajlisDetailTakeaways
					takeaways={session.keyTakeaways}
					inquiries={inquiries}
				/>
			)}

			{/* 8. Deliberation Materials & Video Lectures */}
			{(session.slidesUrl ||
				session.workingPaperUrl ||
				relatedLectures.length > 0) && (
				<MajlisDetailMaterials
					session={session}
					relatedLectures={relatedLectures}
				/>
			)}

			{/* 9. Full Proceedings Text */}
			{content && content.trim().length > 0 && (
				<MajlisDetailProceedings content={content} />
			)}

			{/* 10. Footer Navigation */}
			<MajlisDetailFooter
				prevSession={prevSession}
				nextSession={nextSession}
				isUpcoming={isUpcoming}
				registrationUrl={session.registrationUrl}
			/>
		</article>
	);
}
