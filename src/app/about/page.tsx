import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Scale, Compass } from "lucide-react";
import { AboutHero } from "@/features/about";
import { constructMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
	title: "About Us — Intellectual Mandate",
	description: siteConfig.description,
	canonicalUrl: "/about",
});

export default function AboutPage() {
	return (
		<div className="flex flex-col w-full pb-space-2xl bg-surface text-on-surface">
			<AboutHero />

			<div className="w-full max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-16 flex flex-col gap-12 sm:gap-16">
				{/* Section 1: The Mandate */}
				<section className="flex flex-col gap-4">
					<h2 className="font-serif text-3xl sm:text-4xl text-primary font-normal leading-tight">
						Restoring the Union of Justice and Wisdom
					</h2>
					<p className="font-serif italic text-lg text-secondary leading-relaxed">
						“Adl wa Hikmah” — Grounding contemporary civic, legal,
						and constitutional discourse in the timeless
						epistemological traditions of classical jurisprudence.
					</p>
					<div className="font-body-md text-on-surface-variant leading-relaxed space-y-4 pt-2">
						<p>
							Adlwise is an independent intellectual initiative
							dedicated to reviving substantive legal reasoning,
							constitutional equity, and public philosophy. We
							interrogate the deep tensions between classical
							legal theory (*Usul al-Fiqh*) and contemporary
							statutory codification, examining how modern
							statecraft can authentically embody moral order and
							civic pluralism.
						</p>
						<p>
							Through systematic lecture series, published
							monographs in *Twasi al-Haq*, and fortnightly
							*Majlis* gatherings, Adlwise convenes scholars,
							jurists, researchers, and serious students to engage
							enduring questions of state authority,
							constitutional covenants, contractual justice, and
							ethical limits of statutory law.
						</p>
					</div>
				</section>

				{/* Section 2: Three Pillars */}
				<section className="flex flex-col gap-6 pt-4">
					<div className="flex items-center gap-2 text-xl text-headline-lg uppercase tracking-widest text-brand-gold font-semibold gap-4">
						<Scale className="w-6 h-6" />
						<span>Core Pillars</span>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high flex flex-col gap-3">
							<span className="font-serif text-2xl text-tertiary-container font-bold">
								I.
							</span>
							<h3 className="font-serif text-lg text-primary font-semibold">
								Classical Jurisprudence
							</h3>
							<p className="font-body-sm text-on-surface-variant text-sm leading-relaxed">
								Rigorous textual hermeneutics, extraction of
								operative legal rationale (*‘Ilal*), and
								universal higher objectives (*Maqasid
								al-Shari’ah*).
							</p>
						</div>

						<div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high flex flex-col gap-3">
							<span className="font-serif text-2xl text-tertiary-container font-bold">
								II.
							</span>
							<h3 className="font-serif text-lg text-primary font-semibold">
								Constitutional Statecraft
							</h3>
							<p className="font-body-sm text-on-surface-variant text-sm leading-relaxed">
								Juristic examination of constitutional
								covenants, public welfare (*Maslahah Mursalah*),
								sovereignty, and institutional accountability.
							</p>
						</div>

						<div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-high flex flex-col gap-3">
							<span className="font-serif text-2xl text-tertiary-container font-bold">
								III.
							</span>
							<h3 className="font-serif text-lg text-primary font-semibold">
								Civic Covenant &amp; Ethics
							</h3>
							<p className="font-body-sm text-on-surface-variant text-sm leading-relaxed">
								Pluralistic civic equity modeled upon
								constitutional precedents such as the Charter of
								Medina (*Kitab al-Madinah*) and classical adab.
							</p>
						</div>
					</div>
				</section>

				{/* Section 3: Founding Director */}
				<section className="p-8 rounded-3xl bg-surface-container-low border border-surface-container-high flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
					<div className="flex flex-col gap-2 max-w-lg">
						<span className="font-sans text-xs uppercase tracking-widest text-secondary font-semibold">
							Academic Directorship
						</span>
						<h3 className="font-serif text-2xl text-primary font-semibold">
							{siteConfig.author.name}
						</h3>
						<span className="font-urdu text-lg text-tertiary font-bold dir-rtl">
							{siteConfig.author.urduName}
						</span>
						<p className="font-body-sm text-on-surface-variant leading-relaxed text-sm">
							Scholar of classical Islamic jurisprudence (*Fiqh*),
							legal theory (*Usul*), and constitutional
							philosophy. Founding Director of Adlwise Institute
							and convener of the Majlis gatherings.
						</p>
					</div>

					<div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
						<Link
							href="/lectures"
							className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-container text-surface rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-colors shadow-sm"
						>
							<BookOpen className="w-4 h-4" />
							<span>Explore Lectures</span>
						</Link>
						<Link
							href="/twasi-al-haq"
							className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-container hover:bg-surface-container-high text-primary rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-colors border border-surface-container-high"
						>
							<span>Read Articles</span>
							<ArrowRight className="w-3.5 h-3.5" />
						</Link>
					</div>
				</section>
			</div>
		</div>
	);
}
