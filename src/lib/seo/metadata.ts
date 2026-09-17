import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface MetadataProps {
	title?: string;
	description?: string;
	image?: string;
	canonicalUrl?: string;
	noIndex?: boolean;
}

export function constructMetadata({
	title,
	description = siteConfig.description,
	image = "/images/assets/mountain-mark.png",
	canonicalUrl,
	noIndex = false,
}: MetadataProps = {}): Metadata {
	const fullTitle = title
		? `${title} | ${siteConfig.name}`
		: `${siteConfig.tagline}`;
	const url = canonicalUrl
		? `${siteConfig.url}${canonicalUrl}`
		: siteConfig.url;

	return {
		title: fullTitle,
		description,
		metadataBase: new URL(siteConfig.url),
		alternates: {
			canonical: url,
		},
		openGraph: {
			title: fullTitle,
			description,
			url,
			siteName: siteConfig.name,
			images: [
				{
					url: image,
					width: 1200,
					height: 630,
					alt: fullTitle,
				},
			],
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description,
			images: [image],
			creator: "@Adlwise",
		},
		robots: {
			index: !noIndex,
			follow: !noIndex,
			googleBot: {
				index: !noIndex,
				follow: !noIndex,
			},
		},
	};
}
