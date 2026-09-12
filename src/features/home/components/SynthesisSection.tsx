import React from "react";
import Link from "next/link";
import { GraduationCap, ChevronRight } from "lucide-react";

export function SynthesisSection() {
  const pillars = [
    {
      num: "I.",
      title: "Kalma",
      desc: "Adipisicing esse et in sint sunt. Non enim est tempor adipisicing. Deserunt voluptate non eu ex minim dolor anim. Labore exercitation nostrud nulla eiusmod.",
    },
    {
      num: "II.",
      title: "Concept of ('Illah)",
      desc: "Labore esse quis non et culpa ullamco ut aliquip dolore incididunt. Deserunt cillum commodo cillum sunt commodo consectetur ea sit.",
    },
    {
      num: "III.",
      title: "Socio-political",
      desc: "Sit laboris anim anim tempor Lorem reprehenderit magna et adipisicing. Ea quis tempor dolor sunt esse anim velit amet cupidatat occaecat do aute excepteur.",
    },
  ];

  return (
    <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-lg flex flex-col gap-space-md max-w-container-max mx-auto">
      <div className="flex flex-col gap-space-xs pb-space-xs">
        <h3 className="font-headline-lg mx-auto text-4xl text-primary font-bold">
          Synthesis of Adl &amp; Hikmah
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
        {pillars.map((p) => (
          <div
            key={p.num}
            className="p-space-md bg-surface-container-low flex items-start gap-space-sm rounded-[20px] border border-surface-container-high/40"
          >
            <span className="font-headline-md text-tertiary-container font-bold">
              {p.num}
            </span>
            <div className="flex flex-col">
              <h4 className="font-headline-sm text-primary font-semibold">
                {p.title}
              </h4>
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
            <GraduationCap className="w-4 h-4" />
            <span className="font-label-sm uppercase tracking-wider font-bold text-[11px]">
              Join Us
            </span>
          </div>
          <h3 className="font-headline-md text-primary font-bold">
            Circle of Fellows
          </h3>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Join a dedicated fellowship of learners convening regularly in Lahore and through moderated digital discourse.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm w-full md:w-auto shrink-0">
          <Link
            href="/join"
            className="px-space-md py-space-xs bg-primary text-on-primary font-label-md uppercase tracking-wider rounded-full hover:bg-primary-container transition-colors shadow-sm font-semibold text-center"
          >
            Apply Now
          </Link>
          <Link
            href="/about"
            className="px-space-sm py-space-xs text-primary font-label-md uppercase tracking-wider flex items-center justify-center gap-1 hover:text-secondary font-semibold"
          >
            <span>Our Method</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
