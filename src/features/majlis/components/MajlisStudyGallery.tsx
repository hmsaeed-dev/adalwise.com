import React from "react";
import Image from "next/image";

export function MajlisStudyGallery() {
  return (
    <section className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop flex flex-col gap-space-md pt-space-lg">
      <div className="relative w-full overflow-hidden rounded-[24px] shadow-sm bg-surface-container border border-surface-container-high">
        <div className="relative w-full h-64 sm:h-80 overflow-hidden">
          <Image
            src="/images/haseeb-sitting.jpg"
            alt="Dr. Hafiz Haseeb in scholarly majlis assembly at Bait al-Hikmah in Lahore"
            fill
            className="object-cover object-center transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
        </div>

        <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-xs border-t border-surface-container-high">
          <div className="flex flex-col">
            <span className="font-label-sm text-tertiary-container font-bold tracking-wider uppercase text-[11px]">
              The Lahore Bait al-Hikmah
            </span>
            <span className="font-urdu text-[13px] text-primary font-bold dir-rtl">
              نشست در دولت کدہ، ماڈل ٹاؤن، لاہور
            </span>
          </div>
          <span className="font-label-sm px-space-sm py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] uppercase tracking-wider font-semibold">
            Fortnightly Assembly
          </span>
        </div>
      </div>
    </section>
  );
}
