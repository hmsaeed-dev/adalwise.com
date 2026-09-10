import React from "react";
import Image from "next/image";

export function MajlisHero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[340px] flex flex-col justify-end px-gutter-mobile md:px-gutter-desktop pt-space-3xl pb-space-xl shadow-sm bg-primary">
      <Image
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4MVE9_1If0u3IyrXxuZjDAhx3hYICQq_y9rwlORVR4_O7ybb9orb7Q2PjaIU4eCyPWNFSsSt9iWr7NOe0FtvzWbm9XLIsDUGF3UaIREfwPdk7GsHT3-kff7uy0KFAQl9fYEQ-YZ8oamSwf_W6aLpI-MzdCRyhxLRWE2aM8oYTv1u6NXqyvqup9IjbsM24_7NZ8WXDa9jxuVS4DN1WqdfnocZNSUmYrUnFjT5wj1_faOQcofNnevuM"
        alt="Gathering in open field and scholarly courtyard"
        fill
        className="object-cover object-center opacity-40 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-primary/30 pointer-events-none" />

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
