import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MajlisDoc } from "@/lib/content/schemas";

interface MajlisDetailFooterProps {
	prevSession: MajlisDoc | null;
	nextSession: MajlisDoc | null;
	isUpcoming: boolean;
	registrationUrl?: string;
}

export function MajlisDetailFooter({
	prevSession,
	nextSession,
	isUpcoming,
	registrationUrl,
}: MajlisDetailFooterProps) {
	return (
		<footer className="pt-6 sm:pt-8 flex items-center justify-between flex-wrap gap-4 border-t border-surface-container-high/60">
			<Link
				href="/majlis"
				className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-semibold text-primary hover:text-brand-gold transition-colors"
			>
				<ArrowLeft className="w-4 h-4" aria-hidden="true" />
				<span>Back to Majlis</span>
			</Link>

			<div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
				{prevSession && (
					<Link
						href={`/majlis/${prevSession.slug}`}
						className="px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-sans text-primary transition-all shadow-xs"
					>
						← Session {prevSession.session.number}
					</Link>
				)}

				{nextSession && (
					<Link
						href={`/majlis/${nextSession.slug}`}
						className="px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-sans text-primary transition-all shadow-xs"
					>
						Session {nextSession.session.number} →
					</Link>
				)}

				{isUpcoming && (
					<Link
						href={registrationUrl || "/join"}
						className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-primary hover:bg-primary-hover text-brand-warm-white text-xs font-sans uppercase tracking-widest font-semibold rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
					>
						<span>Reserve Your Seat</span>
						<ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
					</Link>
				)}
			</div>
		</footer>
	);
}
