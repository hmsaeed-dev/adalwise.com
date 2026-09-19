import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, MapPin, Video } from "lucide-react";
import { getAllMajlisSessions, getMajlisSessionBySlug } from "@/lib/content/client";
import { getLectureBySlug } from "@/lib/lectures/client";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { constructMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const sessions = await getAllMajlisSessions();
  return sessions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getMajlisSessionBySlug(slug);
  if (!doc) return {};

  return constructMetadata({
    title: `${doc.session.title} — Majlis ${doc.session.number || ""}`,
    description: doc.session.thesis || doc.session.description,
    canonicalUrl: `/majlis/${slug}`,
  });
}

function formatSessionDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default async function MajlisSessionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getMajlisSessionBySlug(slug);

  if (!doc) {
    notFound();
  }

  const { session, content } = doc;
  const inquiries =
    session.keyInquiries.length > 0
      ? session.keyInquiries
      : session.discussionPoints;
  const formattedDate = formatSessionDate(session.date);

  // Hydrate cross-referenced lectures from catalogue
  const relatedSlugs = Array.from(
    new Set([
      ...(session.recordingSlug ? [session.recordingSlug] : []),
      ...(session.relatedLectureSlugs || []),
    ])
  );
  const lectureResults = await Promise.all(
    relatedSlugs.map((s) => getLectureBySlug(s))
  );
  const relatedLectures = lectureResults.filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <article className="w-full max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-16 flex flex-col gap-10">
      <BreadcrumbJsonLd
        items={[
          { name: "Majlis", url: `${siteConfig.url}/majlis` },
          {
            name: session.title,
            url: `${siteConfig.url}/majlis/${slug}`,
          },
        ]}
      />
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-brand-primary/60"
      >
        <Link href="/majlis" className="hover:text-brand-primary transition-colors">
          Majlis
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-brand-primary font-semibold truncate max-w-[200px] sm:max-w-none">
          Session {session.number || "01"}
        </span>
      </nav>

      {/* Header Cartouche */}
      <header className="flex flex-col gap-4 pb-8">
        <div className="flex items-center justify-between flex-wrap gap-3 text-xs font-sans tracking-wide text-brand-primary/70">
          <div className="flex items-center gap-3">

            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-gold shrink-0" aria-hidden="true" />
              <span>{formattedDate}</span>
            </span>
          </div>

          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" aria-hidden="true" />
            <span>
              {session.venue ? `${session.venue} · ` : ""}
              {session.location}
            </span>
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-4 flex-wrap mt-2">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-brand-primary tracking-tight">
            {session.title}
          </h1>
          {session.urduTitle && (
            <span className="font-urdu text-2xl sm:text-3xl text-brand-primary/80 font-bold select-none dir-rtl">
              {session.urduTitle}
            </span>
          )}
        </div>

        {(session.thesis || session.description) && (
          <p className="font-serif italic text-lg sm:text-xl text-brand-primary/85 leading-relaxed mt-2">
            &ldquo;{session.thesis || session.description}&rdquo;
          </p>
        )}
      </header>

      {/* Primary Inquiries Section */}
      {inquiries.length > 0 && (
        <section aria-labelledby="inquiries-heading" className="bg-brand-parchment/60 border-l-2 border-brand-gold p-6 sm:p-7 rounded-r-lg space-y-3">
          <h2 id="inquiries-heading" className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary/70">
            Inquiries
          </h2>
          <ul className="space-y-2.5 font-sans text-sm sm:text-[15px] text-brand-primary/85 leading-relaxed">
            {inquiries.map((q, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="font-serif text-xs text-brand-primary font-medium mt-0.5 select-none">
                  0{idx + 1}
                </span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Recorded Discourses & Archive Links */}
      {relatedLectures.length > 0 && (
        <section aria-labelledby="related-discourses-heading" className="space-y-4 p-6 rounded-2xl bg-surface-container border border-surface-container-high">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Video className="w-5 h-5 text-brand-primary" aria-hidden="true" />
              <h2 id="related-discourses-heading" className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary/80">
                Related Recorded Discourses ({relatedLectures.length})
              </h2>
            </div>
            <span className="text-[11px] text-on-surface-variant font-sans">
              Video Archive Cross-References
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {relatedLectures.map((lec) => (
              <Link
                key={lec.slug}
                href={`/lectures/${lec.slug}`}
                className="p-3.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low border border-surface-container-high hover:border-brand-gold/40 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <h3 className="font-headline-sm text-sm font-semibold text-brand-primary group-hover:text-brand-primary-hover truncate">
                    {lec.title}
                  </h3>
                  {lec.urduTitle && (
                    <p className="font-urdu text-xs text-on-surface-variant dir-rtl truncate mt-0.5">
                      {lec.urduTitle}
                    </p>
                  )}
                </div>
                <ArrowUpRight className="w-4 h-4 text-brand-gold shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main Prose Content */}
      {content && content.trim().length > 0 && (
        <div className="prose max-w-none pt-4">
          <MDXRenderer content={content} />
        </div>
      )}

      {/* Footer Navigation */}
      <footer className="pt-8 mt-8 flex items-center justify-between flex-wrap gap-4">
        <Link
          href="/majlis"
          className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-semibold text-brand-primary hover:text-brand-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Majlis</span>
        </Link>

        {session.status === "upcoming" && (
          <Link
            href={session.registrationUrl || "/join"}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-brand-warm-white text-xs font-sans uppercase tracking-widest font-medium rounded-full shadow-sm transition-all"
          >
            <span>Reserve your Seat</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        )}
      </footer>
    </article>
  );
}
