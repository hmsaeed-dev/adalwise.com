import React from "react";
import Link from "next/link";
import { MajlisDoc } from "@/lib/content/schemas";
import { MajlisUpcoming } from "./MajlisUpcoming";
import { MajlisFeaturedArchive } from "./MajlisFeaturedArchive";
import { MajlisArchive } from "./MajlisArchive";
import { ArrowRight, BookOpen, Coffee, Users } from "lucide-react";

interface MajlisChronoProps {
	sessions: MajlisDoc[];
}

export function MajlisChrono({ sessions }: MajlisChronoProps) {
	if (!sessions || sessions.length === 0) {
		return null;
	}

	const upcomingSession = sessions.find(
		(s) => s.session.status === "upcoming"
	);

	const latestCompleted =
		sessions.find((s) => s.session.status === "completed") || sessions[0];

	return (
		<div className="w-full text-brand-charcoal py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16 selection:bg-brand-primary selection:text-brand-warm-white">
			<div className="max-w-6xl mx-auto space-y-16 sm:space-y-20">
				{/* Top Feature: Upcoming Session or Latest Documented Landmark Archive */}
				{upcomingSession ? (
					<MajlisUpcoming doc={upcomingSession} />
				) : (
					latestCompleted && <MajlisFeaturedArchive doc={latestCompleted} />
				)}

				{/* Complete Chronological Archive of All Gatherings */}
				<MajlisArchive sessions={sessions} />

				{/* Institutional Manifesto: The Spirit of Majlis */}
				<section
					aria-labelledby="spirit-of-majlis-heading"
					className="relative rounded-3xl overflow-hidden bg-surface-container-low border border-surface-container-high/80 p-8 sm:p-10 md:p-12"
				>
					<div className="max-w-3xl space-y-5">

						<div className="flex items-baseline justify-between gap-4 flex-wrap">
							<h3
								id="spirit-of-majlis-heading"
								className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-primary leading-tight"
							>
								Reviving the Classical Suhbah: Deliberation, Text &amp; Shared Bread
							</h3>
						</div>

						<p className="font-serif italic text-base sm:text-lg text-primary/80 leading-relaxed">
							&ldquo;A Majlis is neither a passive lecture hall nor an academic formality. It is an authentic return to the classical tradition of living companionship—where scholars, legal minds, students, and youth break bread together on the dastarkhwan, examine primary texts, and deliberate the structural renewal of society.&rdquo;
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-container-high">
							<div className="flex items-start gap-3">
								<Coffee className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
								<div>
									<h4 className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
										Hospitality &amp; Suhbah
									</h4>
									<p className="text-xs text-on-surface-variant mt-1 leading-normal">
										Shared meals and unpretentious gatherings dissolve barriers between teachers and youth.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<BookOpen className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
								<div>
									<h4 className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
										Textual Rigor
									</h4>
									<p className="text-xs text-on-surface-variant mt-1 leading-normal">
										Direct engagement with classical Usul, primary historical covenants, and constitutional law.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Users className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
								<div>
									<h4 className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
										Candid Shura
									</h4>
									<p className="text-xs text-on-surface-variant mt-1 leading-normal">
										Direct, fearless inquiry into contemporary Pakistani statecraft and institutional reform.
									</p>
								</div>
							</div>
						</div>

						<div className="pt-3">
							<Link
								href="/join"
								className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:text-brand-gold transition-colors"
							>
								<span>Join Us</span>
								<ArrowRight className="w-4 h-4" />
							</Link>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
