import React from "react";
import Image from "next/image";

export function MediaHero() {
  return (
    <section className="relative w-full overflow-hidden rounded-b-[2.5rem] shadow-md bg-primary">
      <div className="absolute inset-0">
        <Image
          src="https://lh3.googleusercontent.com/aida/AEtjO1Xk-0pDNXzFI2CL53f7d6AHfYWTDtBv68u3I-GidefdS4g97lt9QqAmve4F6kGeOlTCcr8zd4VvB4qQ14X3HlMrkM_KWDzDnp0MYftyUren2xaXg2Q82NuKgkBJLoYUvghc9dp9C9takBuB6EFHDI96UmeEu909_IhRPIfCWMXjo06L4zqIUvmVGyNCx_0q-X9SUY7gD9jhVN2SKQA75sRMJh4q7p4w8ZhljZwOzKgml0vNEKl5G9dfRZ0"
          alt="Classical library hall with antique books and manuscripts"
          fill
          className="object-cover opacity-35 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/85 to-primary/80 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 w-full px-gutter-mobile md:px-gutter-desktop pt-16 pb-16 max-w-container-max mx-auto flex flex-col justify-center items-center text-center gap-space-xs">
        <div className="flex items-center gap-space-2xs mb-1">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse" />
          <span className="font-label-sm text-tertiary-fixed uppercase tracking-widest text-[11px] font-bold">
            Archival Repository
          </span>
        </div>
        <h1 className="font-display-lg text-[34px] sm:text-display-lg text-surface tracking-tight font-bold font-serif">
          Lectures &amp; Discourses
        </h1>
        <p className="font-body-md text-surface-variant max-w-md leading-relaxed opacity-90">
          Curated exegesis, jurisprudential treatises, and recorded seminars from Dr. Hafiz Haseeb.
        </p>
        <span className="font-urdu text-[16px] text-tertiary-fixed font-semibold mt-1">
          دروس، خطابات و علمی مباحث
        </span>
      </div>
    </section>
  );
}
