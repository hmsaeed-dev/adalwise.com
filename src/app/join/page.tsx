import React from "react";
import { ArrowDown } from "lucide-react";
import { IntakeForm } from "@/features/fellowship";
import { constructMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
	title: "Join the Circle",
	description:
		"Join the Adlwise Circle for serious study, thoughtful discourse, research, and meaningful contribution.",
	canonicalUrl: "/join",
});

export default function JoinPage() {
	return (
		<div className="w-full overflow-hidden pb-space-3xl">
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: siteConfig.url },
					{ name: "Join Us", url: `${siteConfig.url}/join` },
				]}
			/>

			{/* Hero */}

			<section className="relative min-h-[70vh] flex items-center  border-surface-container-highest/50 bg-surface-container-low/40">
				<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-3xl">
					<div className="max-w-4xl">
						<h1 className="font-display-lg text-[36px] sm:text-[64px] lg:text-[82px] text-primary font-bold leading-[0.98] tracking-tight max-w-4xl">
							Ideas become stronger
							<br />
							when examined together.
						</h1>

						<div className="mt-space-lg flex flex-col sm:flex-row sm:items-end gap-space-lg">
							<p className="font-body-lg text-on-surface-variant max-w-xl leading-relaxed">
								A space for students, professionals, and
								independent learners committed to serious study,
								thoughtful discourse, and meaningful
								contribution.
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

			{/* Form introduction */}
			<section
				id="join-form"
				className="w-full bg-surface-container-low/40"
			>
				<div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-3xl">
					<div className="max-w-2xl mx-auto text-center mb-space-2xl">
						<h2 className="mt-space-sm font-display-md text-3xl sm:text-4xl text-primary font-bold">
							Little bit about yourself.
						</h2>
					</div>

					<IntakeForm />
				</div>
			</section>
		</div>
	);
}
