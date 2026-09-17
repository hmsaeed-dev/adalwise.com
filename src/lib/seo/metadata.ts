import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface MetadataProps {
	title?: string;
	description?: string;
	image?: string;
	canonicalUrl?: string;
	noIndex?: boolean;
	type?: "website" | "article";
	publishedTime?: string;
	authors?: string[];
	keywords?: string[];
}

export function constructMetadata({
	title,
	description = siteConfig.description,
	image = "/images/assets/mountain-mark.png",
	canonicalUrl,
	noIndex = false,
	type = "website",
	publishedTime,
	authors = [siteConfig.author.name],
	keywords = siteConfig.keywords,
}: MetadataProps = {}): Metadata {
	// Construct full, consistent page title
	const fullTitle = title
		? title.includes(siteConfig.name)
			? title
			: `${title} | ${siteConfig.name}`
		: `${siteConfig.name} — ${siteConfig.tagline}`;

	// Normalize canonical URL to lowercase domain without trailing slash
	const cleanPath = canonicalUrl
		? canonicalUrl.startsWith("/")
			? canonicalUrl === "/"
				? ""
				: canonicalUrl.replace(/\/+$/, "")
			: `/${canonicalUrl.replace(/\/+$/, "")}`
		: "";

	const canonical = `${siteConfig.url}${cleanPath}`;

	// Ensure absolute image URL for OG and Twitter scrapers
	const absoluteImage = image.startsWith("http://") || image.startsWith("https://")
		? image
		: `${siteConfig.url}${image.startsWith("/") ? "" : "/"}${image}`;

	return {
		title: {
			absolute: fullTitle,
		},
		description,
		metadataBase: new URL(siteConfig.url),
		applicationName: siteConfig.name,
		authors: authors.map((name) => ({
			name,
			url: siteConfig.url,
		})),
		creator: siteConfig.author.name,
		publisher: siteConfig.name,
		keywords,
		alternates: {
			canonical,
			languages: {
				"en-US": canonical,
				"ur-PK": canonical,
			},
		},
		openGraph: {
			title: fullTitle,
			description,
			url: canonical,
			siteName: siteConfig.name,
			locale: "en_US",
			alternateLocale: ["ur_PK"],
			images: [
				{
					url: absoluteImage,
					width: 1200,
					height: 630,
					alt: fullTitle,
				},
			],
			type,
			...(type === "article" && {
				publishedTime,
				authors,
			}),
		},
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description,
			images: [absoluteImage],
			creator: "@Adlwise",
			site: "@Adlwise",
		},
		robots: {
			index: !noIndex,
			follow: !noIndex,
			googleBot: {
				index: !noIndex,
				follow: !noIndex,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
	};
}
