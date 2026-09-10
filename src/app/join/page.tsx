import React from "react";
import { IntakeForm } from "@/features/fellowship";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Join Adalwise & Fellowship Intake",
  description:
    "Intake portal for scholars, researchers, and serious students of Islamic jurisprudence to join the Adalwise Fellowship Circle.",
  canonicalUrl: "/join",
});

export default function JoinPage() {
  return (
    <div className="flex flex-col w-full pb-space-2xl">
      {/* Header Banner */}
      <section className="relative overflow-hidden pt-8 pb-10 px-gutter-mobile md:px-gutter-desktop border-b border-surface-container-highest/60 bg-gradient-to-b from-surface-container-low/70 via-surface to-surface text-center">
        <div className="relative z-10 flex flex-col items-center gap-space-xs max-w-container-max mx-auto">
          <span className="font-label-sm uppercase tracking-widest text-secondary font-bold text-[11px]">
            Circle of Inquirers
          </span>
          <h1 className="font-display-lg text-[32px] sm:text-display-lg text-primary font-bold font-serif leading-tight">
            Join the Circle
          </h1>
          <span className="font-urdu text-[22px] text-tertiary-container font-bold dir-rtl">
            انضمام مجلسِ رفقاء
          </span>
          <p className="font-body-md text-on-surface-variant max-w-lg leading-relaxed mt-space-xs">
            Join an academic fellowship dedicated to intellectual rigor, classical Usul, and constructive constitutional discourse.
          </p>
        </div>
      </section>

      <section className="w-full px-gutter-mobile md:px-gutter-desktop">
        <IntakeForm />
      </section>
    </div>
  );
}
