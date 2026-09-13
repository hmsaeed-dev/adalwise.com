import React from "react";
import { ArrowDown, BookOpen, MessageCircle, PenLine } from "lucide-react";
import { IntakeForm } from "@/features/fellowship";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
	title: "Join Adlwise",
	description:
		"Join the Adlwise Circle for serious study, thoughtful discourse, research, and meaningful contribution.",
	canonicalUrl: "/join",
});

export default function JoinPage() {
	return (
		<div className="w-full overflow-hidden pb-space-3xl">
			{/* Hero */}
			
			<section className="relative min-h-[70vh] flex items-center border-b border-surface-container-highest/50 bg-surface-container-low/40">
				<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-3xl">
					<div className="max-w-4xl">


						<h1 className="font-display-lg text-[36px] sm:text-[64px] lg:text-[82px] text-primary font-bold leading-[0.98] tracking-tight max-w-4xl">
							Ideas become stronger
							<br />
							when examined together.
						</h1>

						<div className="mt-space-lg flex flex-col sm:flex-row sm:items-end gap-space-lg">
							<p className="font-body-lg text-on-surface-variant max-w-xl leading-relaxed">
								A space for students, professionals, and independent learners committed
								to serious study, thoughtful discourse, and meaningful contribution.
							</p>

							<a
								href="#join-form"
								className="shrink-0 inline-flex items-center justify-center gap-2 px-space-md py-space-sm rounded-full bg-primary text-on-primary font-label-md font-semibold hover:bg-primary-container transition-colors shadow-sm"
							>
								Join Now
								<ArrowDown className="w-4 h-4" />
							</a>
						</div>
					</div>
				</div>

			</section>

			{/* What joining means */}
			<section className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-3xl">
				<div className="mt-space-3xl grid grid-cols-1 md:grid-cols-3 ">
					<div className="py-space-lg md:pr-space-lg md:border-r border-surface-container-high">
						<BookOpen className="w-5 h-5 text-secondary mb-space-md" />

						<p className="font-label-sm uppercase tracking-wider text-secondary font-semibold">
							01
						</p>

						<h3 className="mt-1 font-headline-md text-primary font-bold">
							Study
						</h3>

						<p className="mt-space-xs font-body-sm text-on-surface-variant leading-relaxed">
							Learn, investigate, and examine ideas with depth.
						</p>
					</div>

					<div className="py-space-lg md:px-space-lg md:border-r border-surface-container-high">
						<MessageCircle className="w-5 h-5 text-secondary mb-space-md" />

						<p className="font-label-sm uppercase tracking-wider text-secondary font-semibold">
							02
						</p>

						<h3 className="mt-1 font-headline-md text-primary font-bold">
							Dialogue
						</h3>

						<p className="mt-space-xs font-body-sm text-on-surface-variant leading-relaxed">
							Question, discuss, challenge, and refine.
						</p>
					</div>

					<div className="py-space-lg md:pl-space-lg">
						<PenLine className="w-5 h-5 text-secondary mb-space-md" />

						<p className="font-label-sm uppercase tracking-wider text-secondary font-semibold">
							03
						</p>

						<h3 className="mt-1 font-headline-md text-primary font-bold">
							Contribute
						</h3>

						<p className="mt-space-xs font-body-sm text-on-surface-variant leading-relaxed">
							Write, research, build, organize, and participate.
						</p>
					</div>
				</div>
			</section>

			{/* Form introduction */}
			<section
				id="join-form"
				className="w-full bg-surface-container-low/40"
			>
				<div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-3xl">
					<div className="max-w-2xl mx-auto text-center mb-space-2xl">


						<h2 className="mt-space-sm font-display-md text-3xl sm:text-4xl text-primary font-bold">
							Tell us a little about yourself.
						</h2>


					</div>

					<IntakeForm />
				</div>
			</section>


		</div>
	);
}
