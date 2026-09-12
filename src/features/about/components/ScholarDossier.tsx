import React from "react";
import Image from "next/image";

export function ScholarDossier() {
	return (
		<section className="px-gutter-mobile md:px-gutter-desktop mt-space-lg max-w-container-max mx-auto w-full">
			<div className="relative flex flex-col items-center text-center">
				{/* Scholar Portrait with Gold Ring */}
				<div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-2xl ring-4 ring-tertiary-container/50 bg-primary-container">
					<Image
						src="/images/haseeb-chair.jpg"
						alt="Dr. Hafiz Haseeb, Founding Director of Adlwise Institute"
						fill
						className="object-cover object-top hover:scale-105 transition-transform duration-500"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />
				</div>

				<div className="mt-space-lg flex flex-col items-center">
					<h1 className="font-display-lg text-[32px] sm:text-display-lg text-primary font-bold leading-tight">
						Dr. Hafiz Haseeb
					</h1>
					<span className="font-urdu text-[24px] text-tertiary font-bold dir-rtl leading-relaxed mt-1">
						ڈاکٹر حافظ حسیب
					</span>
					<p className="font-body-md text-on-surface-variant mt-space-sm leading-relaxed max-w-md">
						Scholar of classical Islamic jurisprudence (Fiqh),
						constitutional theory. Convener of the Majlis.
					</p>
				</div>
			</div>
		</section>
	);
}
