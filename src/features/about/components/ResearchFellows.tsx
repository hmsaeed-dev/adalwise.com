import React from "react";
import Image from "next/image";

export function ResearchFellows() {
  const pillars = [
    {
      icon: "verified",
      title: "Sanad Authentication",
      urdu: "تحقیقِ اسناد",
      desc: "Manuscript cross-referencing across authenticated classical codices and commentaries.",
    },
    {
      icon: "balance",
      title: "Jurisprudential Synthesis",
      urdu: "تطبیقِ فقہی",
      desc: "Extracting operative legal rationale ('Ilal) to resolve contemporary statutory ambiguities.",
    },
    {
      icon: "gavel",
      title: "Constitutional Dialectic",
      urdu: "سیاستِ عادلہ",
      desc: "Harmonizing civic constitutionalism with universal higher objectives (Maqasid).",
    },
  ];

  return (
    <section className="px-gutter-mobile md:px-gutter-desktop mt-space-2xl max-w-container-max mx-auto w-full flex flex-col gap-space-md">
      <div className="flex items-baseline justify-between border-b border-surface-container-high pb-space-xs">
        <div className="flex flex-col">
          <h2 className="font-headline-md text-primary font-bold font-serif">
            Scholarly Fellows &amp; Methodology
          </h2>
        </div>
        <span className="font-urdu text-[16px] text-primary dir-rtl font-bold">
          مجلسِ محققین
        </span>
      </div>

      <div className="rounded-[24px] overflow-hidden shadow-sm flex flex-col bg-surface-container-low/70 border border-surface-container-high">
        <div className="relative w-full h-64 sm:h-80 overflow-hidden bg-primary-container">
          <Image
            src="https://lh3.googleusercontent.com/aida/AEtjO1UYyf5h3OXcj7rGb2VD-xJWGei3ZxFpSfvPduFnM_ooKjocLxNjGZUNpcS7gEcYMwWFt5ARBPxNaKX2D5Uw4o_cnYXT6DgqT4hkpD41cTvDMOJ1FJmVWjbIh1EhECMkutZmwB7tEk_ssXSiipOcl24_ZC0zRWTDFNm7xF4dPhFpm0V3sdiLzlhztWvTfRT9fKPuIqxsXS-AFp4yDMU6cnxLLFZaTpKbBNhhYGMMyQ22pzd02df3dRGf7Qo"
            alt="Adalwise Research Fellows examining classical codices and legal manuscripts in an archival library"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-surface">
            <span className="font-label-sm uppercase tracking-widest text-tertiary-fixed text-[10px] font-bold">
              Archival Council
            </span>
            <p className="font-headline-sm text-surface font-semibold mt-0.5 font-serif">
              Council for Textual Verification &amp; Glosses
            </p>
          </div>
        </div>

        <div className="p-space-lg flex flex-col gap-space-md">
          <p className="font-body-sm text-on-surface-variant leading-relaxed">
            Our fellows conduct rigorous comparative jurisprudence, cross-examining classical treatises against contemporary legal frameworks in public law, constitutionalism, and commerce.
          </p>

          <div className="flex flex-col gap-space-sm">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="p-space-sm rounded-xl bg-surface-container flex items-start gap-space-sm border border-surface-container-high/60"
              >
                <span className="material-symbols-outlined text-tertiary-container text-[20px] shrink-0 mt-0.5">
                  {p.icon}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-primary font-bold uppercase tracking-wider">
                      {p.title}
                    </span>
                    <span className="font-urdu text-[11px] text-secondary font-bold">
                      ({p.urdu})
                    </span>
                  </div>
                  <span className="font-body-sm text-on-surface-variant text-[12px] mt-0.5">
                    {p.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
