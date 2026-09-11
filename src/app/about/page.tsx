import React from "react";
import {
  ScholarDossier,
  ResearchFellows,
  AcademicConsultationSection,
} from "@/features/about";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "About Us — Credibility Hub",
  description:
    "Intellectual mandate, faculty dossier of Dr. Hafiz Haseeb, and research methodologies of the Adalwise Institute.",
  canonicalUrl: "/about",
});

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full pb-space-2xl">
      {/* Page Opening Heading */}
      <div className="px-gutter-mobile md:px-gutter-desktop pt-space-xl pb-space-md flex flex-col items-center text-center max-w-container-max mx-auto">
        <span className="font-label-sm uppercase tracking-widest text-secondary font-bold text-[11px]">
          Institutional Credibility Hub
        </span>
        <h1 className="font-headline-lg text-primary font-bold font-serif tracking-tight mt-space-2xs">
          Academic Mandate &amp; Faculty
        </h1>
        <p className="font-body-sm text-on-surface-variant max-w-md mt-space-xs italic leading-relaxed">
          An academy established to interrogate textual jurisprudence with constitutional precision.
        </p>
      </div>

      <ScholarDossier />
      <ResearchFellows />
      <AcademicConsultationSection />
    </div>
  );
}
