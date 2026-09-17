import React from "react";
import { siteConfig } from "@/config/site";

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    alternateName: siteConfig.urduName,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/images/assets/mountain-mark.png`,
      width: 512,
      height: 512,
    },
    description: siteConfig.description,
    sameAs: siteConfig.links.socials,
    founder: {
      "@type": "Person",
      name: siteConfig.author.name,
      alternateName: siteConfig.author.urduName,
      jobTitle: siteConfig.author.role,
      url: `${siteConfig.url}/about`,
    },
    knowsAbout: [
      "Quranic Hermeneutics",
      "Islamic Jurisprudence",
      "Constitutional Law",
      "Islamic Political Economy",
      "Maqasid al-Shariah",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.author.email,
      contactType: "academic inquiry",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: [siteConfig.urduName, "Adalwise", "Adl wa Hikmah"],
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: ["en", "ur"],
    publisher: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/images/assets/mountain-mark.png`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

export function PersonJsonLd({
  name,
  alternateName,
  jobTitle,
  description,
  image,
  sameAs,
}: {
  name: string;
  alternateName?: string;
  jobTitle: string;
  description: string;
  image?: string;
  sameAs?: string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    alternateName,
    jobTitle,
    description,
    image,
    sameAs,
    url: `${siteConfig.url}/about`,
    worksFor: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

export function ScholarlyArticleJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  authorName,
  url,
  image,
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
  image?: string;
}) {
  const absoluteImage = image
    ? image.startsWith("http")
      ? image
      : `${siteConfig.url}${image.startsWith("/") ? "" : "/"}${image}`
    : `${siteConfig.url}/images/assets/mountain-mark.png`;

  const canonicalUrl = url.startsWith("http")
    ? url
    : `${siteConfig.url}${url.startsWith("/") ? "" : "/"}${url}`;

  // Ensure ISO 8601 formatting for dates
  let isoPublished = datePublished;
  try {
    isoPublished = new Date(datePublished).toISOString();
  } catch {
    // fallback to provided string
  }

  let isoModified = dateModified || datePublished;
  try {
    isoModified = new Date(isoModified).toISOString();
  } catch {
    // fallback to published
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: title,
    description,
    datePublished: isoPublished,
    dateModified: isoModified,
    author: {
      "@type": "Person",
      name: authorName,
      url: `${siteConfig.url}/about`,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/assets/mountain-mark.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    image: [absoluteImage],
    inLanguage: ["en", "ur"],
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

export function VideoObjectJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  durationSeconds,
  embedUrl,
  watchUrl,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  durationSeconds: number;
  embedUrl: string;
  watchUrl?: string;
}) {
  // Convert duration to ISO 8601 duration: PT[H]H[M]M[S]S
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;
  let isoDuration = "PT";
  if (hours > 0) isoDuration += `${hours}H`;
  if (minutes > 0 || hours > 0) isoDuration += `${minutes}M`;
  isoDuration += `${seconds}S`;

  // Standardize uploadDate to ISO 8601
  let isoUploadDate = uploadDate;
  try {
    isoUploadDate = new Date(uploadDate).toISOString();
  } catch {
    // keep raw if parsing fails
  }

  const absoluteThumb = thumbnailUrl.startsWith("http")
    ? thumbnailUrl
    : `${siteConfig.url}${thumbnailUrl.startsWith("/") ? "" : "/"}${thumbnailUrl}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description: description || siteConfig.description,
    thumbnailUrl: [absoluteThumb],
    uploadDate: isoUploadDate,
    duration: isoDuration,
    embedUrl,
    ...(watchUrl ? { contentUrl: watchUrl } : { contentUrl: embedUrl }),
    publisher: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/assets/mountain-mark.png`,
      },
    },
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: `${siteConfig.url}/about`,
    },
    inLanguage: "ur",
    isFamilyFriendly: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      let canonicalItemUrl = item.url;
      if (!canonicalItemUrl.startsWith("http")) {
        const pathOnly =
          canonicalItemUrl === "/"
            ? ""
            : canonicalItemUrl.startsWith("/")
              ? canonicalItemUrl
              : `/${canonicalItemUrl}`;
        canonicalItemUrl = `${siteConfig.url}${pathOnly.replace(/\/+$/, "")}`;
      } else if (canonicalItemUrl === `${siteConfig.url}/`) {
        canonicalItemUrl = siteConfig.url;
      } else {
        canonicalItemUrl = canonicalItemUrl.replace(/\/+$/, "");
      }

      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: canonicalItemUrl,
      };
    }),
  };


  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}

export function CourseJsonLd({
  name,
  description,
  url,
  numberOfLessons,
}: {
  name: string;
  description: string;
  url: string;
  numberOfLessons?: number;
}) {
  const canonicalUrl = url.startsWith("http")
    ? url
    : `${siteConfig.url}${url.startsWith("/") ? "" : "/"}${url}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: canonicalUrl,
    inLanguage: "ur",
    isAccessibleForFree: true,
    provider: {
      "@type": "EducationalOrganization",
      name: siteConfig.name,
      url: siteConfig.url,
      sameAs: siteConfig.links.socials,
    },
    instructor: {
      "@type": "Person",
      name: siteConfig.author.name,
      jobTitle: siteConfig.author.role,
      url: `${siteConfig.url}/about`,
    },
    ...(numberOfLessons && {
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        instructor: {
          "@type": "Person",
          name: siteConfig.author.name,
        },
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  );
}
