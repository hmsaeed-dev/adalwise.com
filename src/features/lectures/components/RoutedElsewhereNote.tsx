import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export function RoutedElsewhereNote() {
	return (
		<section className="w-full bg-surface text-on-surface py-12 sm:py-16 border-t border-surface-container-high/80">
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				<div className="rounded-2xl bg-surface-container-low border border-surface-container-high p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div className="flex items-start gap-4 max-w-2xl">
						<div className="w-9 h-9 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center shrink-0 mt-0.5">
							<BookOpen className="w-4 h-4" />
						</div>

						<div>

							<h4 className="font-serif text-xl font-semibold text-primary">
								Looking for Friday Sermons (Khutbat) or State Critiques?
							</h4>

							<p className="mt-1.5 font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
								Dr. Haseeb’s weekly Friday discourses (<em>Khutba-e-Jumma</em>) and detailed
								critiques on contemporary political and constitutional developments are
								transcribed and preserved as long-form monographs within the{" "}
								<strong>Twasi al-Haq</strong>.
							</p>
						</div>
					</div>

					<Link
						href="/twasi-al-haq"
						className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-brand-warm-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm group"
					>
						<span>Twasi al-Haq</span>
						<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>
			</div>
		</section>
	);
}
