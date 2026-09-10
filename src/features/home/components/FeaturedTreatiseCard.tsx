import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";

export function FeaturedTreatiseCard() {
  return (
    <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-md max-w-container-max mx-auto">
      <div className="w-full bg-surface-container-lowest p-space-lg shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-surface-container-high/60 flex flex-col gap-space-md overflow-hidden rounded-[26px]">
        <div className="relative w-full h-48 sm:h-60 overflow-hidden bg-primary-container rounded-[18px]">
          <Image
            src="/images/haseeb-standing.jpg"
            alt="The Charter of Medina Treatise by Dr. Hafiz Haseeb"
            fill
            className="object-cover object-top opacity-85 hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-surface">
            <span className="font-label-sm uppercase tracking-widest text-tertiary-fixed text-[10px] font-bold block mb-1">
              Featured Treatise
            </span>
            <p className="font-headline-sm sm:font-headline-md leading-tight text-surface-bright font-serif font-bold">
              The Charter of Medina: Civic Constitutionalism in Early Islam
            </p>
          </div>
        </div>

        <p className="font-body-md text-on-surface leading-relaxed italic font-serif">
          “Justice without wisdom is sterile; wisdom without rigorous textual lineage is rudderless.”
        </p>

        <div className="flex items-center justify-between pt-space-xs border-t border-surface-container-high">
          <span className="font-body-sm text-[12px] text-on-surface-variant">
            Dr. Hafiz Haseeb • Legal Treatises
          </span>
          <Link
            href="/articles/charter-of-medina"
            className="min-h-[38px] px-space-md py-space-2xs bg-primary text-on-primary font-label-sm uppercase tracking-wider rounded-full flex items-center gap-space-2xs hover:bg-primary-container transition-colors shadow-sm"
          >
            <span>Read Treatise</span>
            <BookOpen className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
