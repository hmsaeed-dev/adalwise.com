import React from "react";
import Link from "next/link";

export function SynthesisSection() {
  const pillars = [
    {
      num: "I.",
      title: "Textual Lineage & Sanad Verification",
      urdu: "تحقیقِ اسناد و نصوص",
      desc: "Interrogating classical codices and commentaries to preserve authentic juristic lineages.",
    },
    {
      num: "II.",
      title: "Operative Cause Extraction ('Illah)",
      urdu: "تخریجِ مناط و تطبیقِ فقہی",
      desc: "Isolating the underlying legal rationale to resolve modern commercial and constitutional crises.",
    },
    {
      num: "III.",
      title: "Civic Constitutional Dialectics",
      urdu: "سیاستِ عادلہ اور دستوری اخلاقیات",
      desc: "Synthesizing divine justice (Adl) and institutional wisdom (Hikmah) for civil society.",
    },
  ];

  return (
    <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-lg flex flex-col gap-space-md max-w-container-max mx-auto">
      <div className="flex flex-col gap-space-xs border-b border-surface-container-high pb-space-xs">
        <h3 className="font-headline-lg text-primary font-bold font-serif">
          Synthesis of Adl &amp; Hikmah
        </h3>
        <p className="font-body-sm text-on-surface-variant">
          The three methodological pillars guiding our intellectual inquiry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
        {pillars.map((p) => (
          <div
            key={p.num}
            className="p-space-md bg-surface-container-low flex items-start gap-space-sm rounded-[20px] border border-surface-container-high/40"
          >
            <span className="font-headline-md text-tertiary-container font-serif font-bold">
              {p.num}
            </span>
            <div className="flex flex-col">
              <h4 className="font-headline-sm text-primary font-semibold font-serif">
                {p.title}
              </h4>
              <span className="font-urdu text-[11px] text-secondary font-bold -mt-0.5">
                {p.urdu}
              </span>
              <p className="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Circle of Inquirers CTA Box */}
      <div className="w-full p-space-lg bg-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md mt-space-sm relative overflow-hidden rounded-[24px] border border-surface-container-high">
        <div className="flex flex-col gap-space-xs max-w-xl">
          <div className="flex items-center gap-space-2xs text-secondary">
            <span className="material-symbols-outlined text-[18px]">school</span>
            <span className="font-label-sm uppercase tracking-wider font-bold text-[11px]">
              Fellowship Intake
            </span>
          </div>
          <h3 className="font-headline-md text-primary font-bold font-serif">
            Circle of Inquirers &amp; Fellows
          </h3>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Join a dedicated fellowship of jurists, researchers, and students convening
            regularly in Lahore and through moderated digital discourse.
          </p>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <Link
            href="/join"
            className="px-space-md py-space-xs bg-primary text-on-primary font-label-md uppercase tracking-wider rounded-full hover:bg-primary-container transition-colors shadow-sm font-semibold"
          >
            Apply Now
          </Link>
          <Link
            href="/about"
            className="px-space-sm py-space-xs text-primary font-label-md uppercase tracking-wider flex items-center gap-1 hover:text-secondary font-semibold"
          >
            <span>Our Method</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
