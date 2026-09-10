import React from "react";
import Image from "next/image";

export function MajlisHero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[340px] flex flex-col justify-end px-gutter-mobile md:px-gutter-desktop pt-space-3xl pb-space-xl shadow-sm bg-primary">
      <Image
        src="/images/haseeb-chair.jpg"
        alt="Library Study of Dr. Hafiz Haseeb at Bait al-Hikmah"
        fill
        className="object-cover object-center opacity-30 mix-blend-luminosity"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/70 to-primary/40 pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-space-xs max-w-container-max mx-auto w-full">
        <h1 className="font-display-lg text-[34px] sm:text-display-lg leading-tight text-surface tracking-tight font-serif flex items-center gap-space-xs">
          <span>Majlis</span>{" "}
          <span className="font-urdu text-[32px] sm:text-[38px] font-normal text-secondary-container">
            مجلس
          </span>
        </h1>
        <p className="font-body-md text-surface/90 leading-relaxed max-w-md">
          Chai, text, and candid deliberation in Dr. Hafiz Haseeb’s Lahore library.
        </p>
      </div>
    </section>
  );
}
