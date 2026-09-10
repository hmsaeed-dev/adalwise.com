import React from "react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full px-gutter-mobile md:px-gutter-desktop pt-space-2xl pb-space-3xl overflow-hidden bg-primary text-on-primary">
      {/* Background Graphic Atmosphere */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida/AEtjO1Xk-0pDNXzFI2CL53f7d6AHfYWTDtBv68u3I-GidefdS4g97lt9QqAmve4F6kGeOlTCcr8zd4VvB4qQ14X3HlMrkM_KWDzDnp0MYftyUren2xaXg2Q82NuKgkBJLoYUvghc9dp9C9takBuB6EFHDI96UmeEu909_IhRPIfCWMXjo06L4zqIUvmVGyNCx_0q-X9SUY7gD9jhVN2SKQA75sRMJh4q7p4w8ZhljZwOzKgml0vNEKl5G9dfRZ0")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/95 to-primary pointer-events-none" />

      <div className="relative z-10 max-w-container-max mx-auto flex flex-col items-center text-center py-space-xl">
        <div className="w-16 h-16 mb-space-md relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-tertiary-container/20 blur-md" />
          <div className="w-12 h-12 rounded-full border border-tertiary-container/60 flex items-center justify-center text-tertiary-fixed">
            <span className="material-symbols-outlined text-[26px]">balance</span>
          </div>
        </div>

        <div className="font-urdu text-[32px] sm:text-[38px] text-tertiary-fixed font-bold leading-normal mb-space-md select-none">
          عدل و حکمت
        </div>

        <h1 className="font-headline-sm sm:font-headline-md text-surface-container-highest max-w-md mx-auto leading-relaxed mb-space-2xl italic font-serif">
          Classical Jurisprudence &amp; Civic Constitutionalism
        </h1>

        <div className="flex flex-col sm:flex-row w-full gap-space-sm max-w-xs justify-center">
          <Link
            href="/twasi-al-haq"
            className="w-full min-h-[46px] px-space-md py-space-xs bg-tertiary-container text-on-tertiary-container font-label-md uppercase tracking-wider flex items-center justify-center gap-space-xs rounded-full shadow-md hover:bg-tertiary-fixed transition-colors font-semibold"
          >
            <span>Explore</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
          <Link
            href="/join"
            className="w-full min-h-[46px] px-space-md py-space-xs bg-surface-container/15 text-surface-bright font-label-md uppercase tracking-wider flex items-center justify-center gap-space-2xs rounded-full backdrop-blur-sm hover:bg-surface-container/25 transition-colors font-semibold border border-surface-container/20"
          >
            Join Fellowship
          </Link>
        </div>
      </div>
    </section>
  );
}
