import React from "react";
import Link from "next/link";
import { Scale, Video, Users, BookOpen } from "lucide-react";

interface StreamCard {
  title: string;
  urduTitle: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const streams: StreamCard[] = [
  {
    title: "Twasi al-Haq",
    urduTitle: "تواصِی بالحَق",
    description: "Deliberative constitutional critique, statecraft, and contemporary jurisprudence.",
    href: "/twasi-al-haq",
    icon: Scale,
  },
  {
    title: "Archival Repository",
    urduTitle: "دروس و خطابات",
    description: "Systematic Quranic exegesis, Seerat, and classical Usul al-Fiqh video catalog.",
    href: "/media",
    icon: Video,
  },
  {
    title: "Scholarly Majlis",
    urduTitle: "مجلسِ علم",
    description: "Fortnightly in-person seminars convening jurists, fellows, and students in Lahore.",
    href: "/majlis",
    icon: Users,
  },
  {
    title: "Legal Treatises",
    urduTitle: "مقالات و فتاویٰ",
    description: "Rigorous academic monographs on contractual equity and classical legal maxims.",
    href: "/articles",
    icon: BookOpen,
  },
];

export function StreamsSection() {
  return (
    <section className="w-full px-gutter-mobile md:px-gutter-desktop pt-space-2xl pb-space-xl flex flex-col gap-space-lg max-w-container-max mx-auto">
      <div className="flex items-baseline justify-between border-b border-surface-container-high pb-space-xs">
        <h2 className="font-headline-lg text-primary font-bold font-serif">
          Academic Streams
        </h2>
        <span className="font-urdu text-[18px] text-primary font-bold">
          چهار شعبہ جات
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {streams.map((stream) => {
          const IconComponent = stream.icon;
          return (
            <Link
              key={stream.title}
              href={stream.href}
              className="group block w-full p-space-md bg-surface-container-low transition-all hover:bg-surface-container hover:shadow-sm rounded-[22px] border border-surface-container-high/40"
            >
              <div className="flex items-start justify-between gap-space-sm">
                <div className="w-10 h-10 bg-primary text-tertiary-fixed rounded-full flex items-center justify-center shrink-0 shadow-sm">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-space-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-urdu text-[13px] text-primary font-bold">
                      {stream.urduTitle}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-primary font-semibold font-serif group-hover:text-primary-container transition-colors">
                    {stream.title}
                  </h3>
                  <p className="font-body-sm text-on-surface-variant line-clamp-2">
                    {stream.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
