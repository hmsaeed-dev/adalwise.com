import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllArticles } from "@/lib/content/client";
import {
  DiscourseHeader,
  LeadDispatchCard,
  DispatchFeed,
} from "@/features/discourse";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Twasi al-Haq",
  description:
    "Deliberative critique and contemporary constitutional inquiries examined through classical jurisprudence and ethical maxims.",
  canonicalUrl: "/twasi-al-haq",
});

export default async function TwasiAlHaqPage() {
  const articles = await getAllArticles();
  const leadArticle = articles[0];
  const feedArticles = articles.slice(1);

  return (
    <div className="flex flex-col w-full pb-space-2xl">
      <DiscourseHeader />

      {leadArticle && <LeadDispatchCard article={leadArticle} />}

      {feedArticles.length > 0 && <DispatchFeed articles={feedArticles} />}

      {/* Interactive Deliberation & Scholarly Circle Invitation */}
      <section className="px-gutter-mobile md:px-gutter-desktop pt-space-xl pb-space-lg flex flex-col gap-space-md max-w-container-max mx-auto w-full">
        <div className="bg-primary-container text-surface rounded-[24px] p-space-lg shadow-md flex flex-col gap-space-sm border border-primary/40">
          <div className="flex flex-col gap-space-2xs">
            <h3 className="font-headline-md text-surface font-bold">
              Join the Circle
            </h3>
            <p className="font-body-sm text-surface-container leading-relaxed">
              A moderated circle for thoughtful dialogue, and scholarly exchange.
            </p>
          </div>
          <div className="pt-space-xs">
            <Link
              href="/join"
              className="w-full sm:w-auto inline-flex py-space-sm px-space-md bg-tertiary-container text-on-tertiary-container font-label-md uppercase tracking-wider font-bold rounded-full shadow transition-all hover:bg-tertiary-fixed items-center justify-center gap-space-xs"
            >
              <span>Join Circle</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-surface-container p-space-md rounded-[20px] flex items-center justify-between gap-space-md border border-surface-container-highest">
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-primary font-bold">
              Classical Archives
            </span>
            <span className="font-body-sm text-on-surface-variant text-[12px]">
              Reference texts, glosses, video lectures, and treatises.
            </span>
          </div>
          <Link
            href="/media"
            className="shrink-0 font-label-sm text-primary flex items-center gap-space-2xs font-semibold hover:underline"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
