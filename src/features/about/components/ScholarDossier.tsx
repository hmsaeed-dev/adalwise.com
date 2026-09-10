import React from "react";
import Image from "next/image";

export function ScholarDossier() {
  return (
    <section className="px-gutter-mobile md:px-gutter-desktop mt-space-lg max-w-container-max mx-auto w-full">
      <div className="relative flex flex-col items-center text-center">
        {/* Scholar Portrait with Gold Ring */}
        <div className="relative w-52 h-72 sm:w-64 sm:h-80 rounded-full overflow-hidden shadow-xl ring-4 ring-tertiary-container/30 bg-primary-container">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLlbsqyjLjAFXV8VbFmf-3URZrINAklfWnrMHxtKQhEj7bDaw0VKiAqf06BXIblNJRqSQQXinMGPT8Y-K-5jNEqP8gWleWtjetxKhkrpt5D5TtXxIsuPWUxshY_fLAW4zAR8XalfxGUfCLF1y0d9RT2EODxHUXl0qZ8wNpKByIFRFjIimjPaO7JWSCxp8kEK2LoiU1UAl8RzU8JE15rUPAhMHoOV59VuaDnEyqAhaibRCyEbFfYdQbokRdudpIRn5kIA"
            alt="Dr. Hafiz Haseeb, Founding Director of Adalwise Institute"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="mt-space-lg flex flex-col items-center">
          <h1 className="font-display-lg text-[32px] sm:text-display-lg text-primary font-bold font-serif leading-tight">
            Dr. Hafiz Haseeb
          </h1>
          <span className="font-urdu text-[24px] text-tertiary font-bold dir-rtl leading-relaxed mt-1">
            ڈاکٹر حافظ حسیب
          </span>
          <span className="font-label-sm text-[11px] uppercase tracking-widest text-secondary font-bold mt-1">
            Founding Director &amp; Senior Jurist
          </span>
          <p className="font-body-md text-on-surface-variant mt-space-sm leading-relaxed max-w-md">
            Scholar of classical Islamic jurisprudence (Fiqh), constitutional theory, and hermeneutic legal maxims. 
            Convener of the Lahore Bait al-Hikmah Majlis.
          </p>
        </div>
      </div>

      {/* Narrative Dossier: Intellectual Ethos */}
      <div className="mt-space-xl p-space-lg rounded-[24px] bg-surface-container-low/80 border border-surface-container-high flex flex-col gap-space-md">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-space-xs">
          <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold flex items-center gap-space-2xs">
            <span className="text-tertiary-container">♦</span> Intellectual Mandate
          </span>
          <span className="font-urdu text-body-sm text-on-surface-variant dir-rtl font-semibold">
            منہجِ فکر و تحقیق
          </span>
        </div>

        <p className="font-body-md text-on-surface leading-relaxed">
          Adalwise re-anchors contemporary legal and constitutional inquiry inside classical methodologies—interrogating textual jurisprudence with constitutional precision rather than modern ideological expediency.
        </p>

        <div className="pt-space-xs flex flex-col gap-space-xs border-l-2 border-tertiary-container pl-space-md my-space-xs">
          <p className="font-headline-sm text-primary italic font-serif leading-relaxed text-[17px]">
            “Justice without wisdom is sterile; wisdom without rigorous textual lineage is rudderless.”
          </p>
          <span className="font-urdu text-[14px] text-tertiary dir-rtl mt-space-2xs font-semibold">
            — عدل بغیر حکمت کے ناقص ہے، اور حکمت بغیر مستند اسناد کے بے بنیاد۔
          </span>
        </div>
      </div>
    </section>
  );
}
