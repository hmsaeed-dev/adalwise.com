import Link from "next/link";
import { PRIMARY_DOMAINS } from "@/lib/taxonomy/registry";

export function LecturesIntro() {
	return (
		<section className="w-full bg-surface text-on-surface py-16 sm:py-20 md:py-24 border-b border-surface-container-high/80">
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				{/* Matn & Hashiya Split: Prose on the left, Table of Contents in the margin */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
					{/* Matn Column: Wide Main Discursive Prose */}
					<div className="lg:col-span-7 flex flex-col gap-6">

						<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary font-semibold leading-[1.18] tracking-tight">
							One Integrated Body of Teaching
						</h2>

						<div className="font-serif text-lg sm:text-[19px] text-[#121915] leading-[1.8] space-y-6 max-w-[65ch]">
							<p>
								This archive is not an arbitrary feed of video uploads, but a structured
								curriculum developed over two decades. It operates from a single premise:
								that classical Quranic exegesis (<em>Tafsir</em>), prophetic statecraft (
								<em>Seerah</em>), legal theory (<em>Usul al-Fiqh</em>), and philosophical
								critique (<em>Fikr-e-Iqbal</em>) are not isolated subjects, but interdependent
								facets of one continuous intellectual discipline.
							</p>
							<p>
								A student cannot fully grasp the constitutional philosophy of the Charter of
								Medina without the foundational textual hermeneutics of the Quran.
								Similarly, modern debates over state sovereignty, public welfare (
								<em>Maslahah</em>), and legal reform remain hollow without understanding
								how classical jurists extracted operative rationale (<em>‘Ilal</em>) from
								prophetic precedents.
							</p>
							<p className="font-sans text-xs sm:text-sm text-on-surface-variant italic">
								Explore the foundational masterclasses below, commit to the sequential
								324-part Translation Course, or search the complete 600+ session archive by
								thematic domain.
							</p>
						</div>
					</div>

					{/* Hashiya Column: Manuscript Table of Contents (Quiet Jump-Links) */}
					<aside className="lg:col-span-5 lg:border-l lg:border-surface-container-high lg:pl-8 lg:py-2">
						<div className="flex flex-col gap-3">
							{PRIMARY_DOMAINS.map((domain, index) => (
								<Link
									key={domain.id}
									href={`/lectures?domain=${domain.slug}#archive`}
									className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container-lowest border border-surface-container-high/80 hover:border-brand-gold/60 transition-all flex items-baseline justify-between group shadow-sm"
								>
									<div className="flex items-baseline gap-2.5">
										<span className="font-serif text-xs font-bold text-secondary">
											0{index + 1}
										</span>
										<span className="font-serif text-base font-semibold text-primary group-hover:text-secondary transition-colors">
											{domain.title}
										</span>
									</div>

									<span className="font-urdu text-sm text-tertiary font-bold dir-rtl">
										{domain.urduTitle}
									</span>
								</Link>
							))}
						</div>
					</aside>
				</div>
			</div>
		</section>
	);
}
