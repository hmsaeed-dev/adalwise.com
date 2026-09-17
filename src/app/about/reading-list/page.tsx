import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Download, ExternalLink, ArrowRight } from "lucide-react";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
	title: "The Reading List — Foundational Classical References",
	description:
		"The primary classical texts, legal treatises, and historical masterworks Dr. Hafiz Haseeb returns to across his lectures.",
	canonicalUrl: "/about/reading-list",
});

interface BookEntry {
	title: string;
	urduTitle?: string;
	author: string;
	note: string;
	downloadUrl?: string;
	externalUrl?: string;
	lectureSeriesUrl?: string;
	lectureSeriesLabel?: string;
}

interface Section {
	heading: string;
	urduHeading?: string;
	books: BookEntry[];
}

const READING_SECTIONS: Section[] = [
	{
		heading: "On the Prophetic Movement & Statecraft",
		urduHeading: "سیرتِ نبوی اور نظامِ ریاست",
		books: [
			{
				title: "The Sealed Nectar",
				urduTitle: "الرحیق المختوم",
				author: "Safi-ur-Rahman Mubarakpuri (1942–2006)",
				note: "The reliable chronological anchor for the historical milestones, expeditions, and dawah phases of the prophetic mission.",
				downloadUrl: "/reading-list/the-sealed-nectar.pdf",
				lectureSeriesUrl: "/lectures?domain=seerah",
				lectureSeriesLabel: "Online Seerat Sessions",
			},
			{
				title: "Muhaziraat-e-Seerat",
				urduTitle: "محاضراتِ سیرت",
				author: "Dr. Mahmood Ahmad Ghazi (1950–2010)",
				note: "An indispensable contemporary inquiry into the constitutional covenants, institutional diplomacy, and legal foundations of the state in Medina.",
				downloadUrl: "/reading-list/muhaziraat-e-seerat.pdf",
				lectureSeriesUrl: "/lectures?domain=seerah",
				lectureSeriesLabel: "Online Seerat Sessions",
			},
		],
	},
	{
		heading: "On Jurisprudence & Ethical Purpose (Maqasid)",
		urduHeading: "فقہ، اصول اور مقاصدِ شریعت",
		books: [
			{
				title: "Al-Muwafaqat fi Usul al-Shariah",
				urduTitle: "الموافقات فی اصول الشریعہ",
				author: "Imam Abu Ishaq al-Shatibi (d. 790 AH)",
				note: "The definitive classical work examining Islamic legal injunctions through their overarching ethical objectives (Maqasid) and the preservation of public welfare.",
				lectureSeriesUrl: "/lectures?domain=usul",
				lectureSeriesLabel: "Usul & Hermeneutics Discourses",
			},
			{
				title: "Hujjat Allah al-Baligha",
				urduTitle: "حجۃ اللہ البالغہ",
				author: "Shah Waliullah Dehlawi (1703–1762)",
				note: "The landmark 18th-century synthesis connecting divine legislative wisdom with human psychological needs, civilizational rise, and socio-economic justice.",
				lectureSeriesUrl: "/lectures?domain=civilization",
				lectureSeriesLabel: "Civilizational Lectures",
			},
		],
	},
	{
		heading: "On the Renewal of Thought & Modernity",
		urduHeading: "فکرِ نو اور تفہیمِ عصر",
		books: [
			{
				title: "The Reconstruction of Religious Thought in Islam",
				urduTitle: "تشکیلِ جدید الٰہیاتِ اسلامیہ",
				author: "Allama Muhammad Iqbal (1877–1938)",
				note: "Seven landmark philosophical lectures confronting modern Western empiricism, the necessity of Ijtihad, and the spiritual democratic ideal in Islam.",
				lectureSeriesUrl: "/lectures?domain=philosophy",
				lectureSeriesLabel: "Iqbalian Inquiries",
			},
			{
				title: "The Muqaddimah",
				urduTitle: "مقدمہ ابن خلدون",
				author: "Ibn Khaldun (1332–1406)",
				note: "The classical masterwork on Asabiyyah (social solidarity), state formation, urban economics, and the organic cycles of civilizational decay.",
				lectureSeriesUrl: "/lectures?domain=civilization",
				lectureSeriesLabel: "Civilizational Lectures",
			},
		],
	},
	{
		heading: "On Political Economy & Constitutional Justice",
		urduHeading: "معاشی انصاف اور دستوری میثاق",
		books: [
			{
				title: "Third Way Economics: An Islamic Critique",
				urduTitle: "تیسرا معاشی راستہ",
				author: "Dr. Hafiz Haseeb",
				note: "A published research treatise examining sovereign debt, public equity, central banking, and the structural Quranic alternative to debt-based capitalism.",
				downloadUrl: "/study-notes/treatises/third-way-economics-article-urdu.pdf",
				lectureSeriesUrl: "/lectures?domain=statecraft",
				lectureSeriesLabel: "Statecraft & Economy Discourses",
			},
			{
				title: "The Constitution of Pakistan (1973)",
				urduTitle: "دستورِ پاکستان مع قراردادِ مقاصد",
				author: "Parliament of Pakistan (with Objectives Resolution, 1949)",
				note: "The foundational social compact establishing the trichotomy of powers, fundamental human rights, and the constitutional guarantee of social justice.",
				lectureSeriesUrl: "/lectures?domain=statecraft",
				lectureSeriesLabel: "Constitutional Law Lectures",
			},
		],
	},
];

export default function ReadingListPage() {
	return (
		<div className="w-full bg-surface text-on-surface py-12 sm:py-16 md:py-20">
			<div className="w-full max-w-3xl mx-auto px-gutter-mobile md:px-gutter-desktop flex flex-col gap-12 sm:gap-16">
				{/* ─── BREADCRUMB & BACK LINK ─── */}
				<header className="flex flex-col gap-4 pb-8 border-b border-surface-container-high/80">
					<div className="flex items-center gap-2 text-xs font-sans">
						<Link
							href="/about"
							className="text-on-surface-variant hover:text-primary transition-colors font-medium inline-flex items-center gap-1 group"
						>
							<ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
							<span>About &amp; Lineage</span>
						</Link>
						<span className="text-outline-variant">/</span>
						<span className="text-secondary font-semibold">The Reading List</span>
					</div>

					<div className="pt-2">
						<div className="flex items-center gap-3 mb-3">
							<div className="w-8 h-8 rounded-lg bg-primary text-brand-warm-white flex items-center justify-center p-1.5 shadow-sm shrink-0">
								<Image
									src="/images/assets/mountain-mark.svg"
									alt="Mohar"
									width={20}
									height={20}
									className="w-full h-full object-contain filter invert"
								/>
							</div>
							<span className="font-sans text-[11px] uppercase tracking-[0.22em] text-secondary font-bold">
								Curated Bibliography
							</span>
						</div>

						<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary font-bold tracking-tight leading-[1.15]">
							The Reading List
						</h1>

						<span className="font-urdu text-base sm:text-lg text-tertiary font-bold dir-rtl block mt-1.5">
							کتب و مراجعِ فکر
						</span>

						<p className="mt-4 font-serif italic text-base sm:text-lg text-secondary font-medium leading-relaxed max-w-2xl">
							The primary masterworks and historical texts Dr. Hafiz Haseeb returns to across his lectures, offered quietly for those who wish to read along.
						</p>
					</div>
				</header>

				{/* ─── LITERARY LEDGER: THEMATIC INQUIRIES ─── */}
				<main className="flex flex-col gap-12 sm:gap-16">
					{READING_SECTIONS.map((section, sIdx) => (
						<section key={section.heading} className="flex flex-col gap-6">
							{/* Section Header */}
							<div className="pb-3 border-b border-surface-container-high/60 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
								<h2 className="font-serif text-lg sm:text-xl text-primary font-semibold tracking-tight">
									{section.heading}
								</h2>
								{section.urduHeading && (
									<span className="font-urdu text-xs text-tertiary font-bold dir-rtl">
										{section.urduHeading}
									</span>
								)}
							</div>

							{/* Section Book Entries */}
							<div className="divide-y divide-surface-container-high/40">
								{section.books.map((book) => (
									<article
										key={book.title}
										className="py-5 first:pt-1 last:pb-1 flex flex-col gap-2 group"
									>
										<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
											<div className="flex items-baseline gap-2 flex-wrap">
												<h3 className="font-serif text-lg sm:text-xl font-bold text-primary leading-snug">
													{book.title}
												</h3>
												{book.urduTitle && (
													<span className="font-urdu text-sm text-tertiary font-semibold dir-rtl">
														({book.urduTitle})
													</span>
												)}
											</div>
										</div>

										<span className="font-serif italic text-xs sm:text-sm text-secondary font-medium">
											{book.author}
										</span>

										<p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-2xl mt-0.5">
											{book.note}
										</p>

										{/* Subtle, Dignified Actions */}
										<div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-sans">
											{book.downloadUrl && (
												<a
													href={book.downloadUrl}
													download
													className="font-bold text-primary hover:text-secondary inline-flex items-center gap-1 transition-colors"
												>
													<Download className="w-3.5 h-3.5" />
													<span>Download Reference PDF</span>
												</a>
											)}

											{book.lectureSeriesUrl && (
												<Link
													href={book.lectureSeriesUrl}
													className="text-on-surface-variant hover:text-primary inline-flex items-center gap-1 transition-colors"
												>
													<span>Taught in {book.lectureSeriesLabel}</span>
													<ArrowRight className="w-3 h-3" />
												</Link>
											)}
										</div>
									</article>
								))}
							</div>
						</section>
					))}
				</main>

				{/* ─── QUIET CLOSING COLOPHON ─── */}
				<footer className="pt-8 border-t border-surface-container-high/80 flex flex-col gap-4 text-xs font-sans text-on-surface-variant leading-relaxed">
					<p>
						These texts form the intellectual background of the systematic exegesis delivered in the{" "}
						<Link href="/lectures" className="text-primary font-bold hover:underline">
							Lectures Library
						</Link>{" "}
						and the deliberative assemblies of the{" "}
						<Link href="/majlis" className="text-primary font-bold hover:underline">
							Majlis
						</Link>
						. For visual syntax charts and companion timelines, consult the{" "}
						<Link href="/lectures/notes" className="text-primary font-bold hover:underline">
							Study Notes &amp; Reference Archive
						</Link>
						.
					</p>

					<div className="pt-2">
						<Link
							href="/about"
							className="font-bold text-primary hover:text-secondary inline-flex items-center gap-1 transition-colors"
						>
							<ArrowLeft className="w-3.5 h-3.5" />
							<span>Return to Dr. Hafiz Haseeb&apos;s Lineage &amp; Background</span>
						</Link>
					</div>
				</footer>
			</div>
		</div>
	);
}
