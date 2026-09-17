import assert from "node:assert";

// 1. Test siteConfig
const { siteConfig } = await import("../src/config/site.ts");
console.log("Testing siteConfig...");
assert.strictEqual(siteConfig.url, "https://adlwise.com", "siteConfig.url must be lowercase 'https://adlwise.com'");
assert.ok(siteConfig.links.socials.length >= 2, "siteConfig must include social links");
assert.ok(siteConfig.keywords.length >= 10, "siteConfig must include rich keywords");
console.log("✓ siteConfig verified.");

// 2. Test robots.ts
const robotsModule = await import("../src/app/robots.ts");
const robotsConfig = robotsModule.default();
console.log("Testing robots.ts...");
assert.strictEqual(robotsConfig.sitemap, "https://adlwise.com/sitemap.xml", "Sitemap URL in robots.ts must match canonical domain");
const starRule = robotsConfig.rules.find((r) => r.userAgent === "*");
assert.ok(starRule, "Must have '*' userAgent rule");
assert.ok(starRule.disallow.includes("/search"), "robots.txt must disallow /search to protect crawl budget");
console.log("✓ robots.ts verified.");

// 3. Test sitemap.ts
const sitemapModule = await import("../src/app/sitemap.ts");
const sitemapItems = await sitemapModule.default();
console.log(`Testing sitemap.ts (${sitemapItems.length} items)...`);

// Verify no query strings or /search in sitemap
for (const item of sitemapItems) {
	assert.ok(!item.url.includes("?"), `Sitemap must not contain query parameters: ${item.url}`);
	assert.ok(!item.url.endsWith("/search"), `Sitemap must not contain /search: ${item.url}`);
	assert.ok(item.url.startsWith("https://adlwise.com"), `Sitemap URL must start with canonical base: ${item.url}`);
	assert.ok(item.lastModified instanceof Date, `lastModified must be Date object: ${item.url}`);
	assert.ok(!isNaN(item.lastModified.getTime()), `lastModified must be valid date: ${item.url}`);
}

const staticUrls = [
	"https://adlwise.com",
	"https://adlwise.com/lectures",
	"https://adlwise.com/lectures/tarjuma-e-quran",
	"https://adlwise.com/lectures/notes",
	"https://adlwise.com/twasi-al-haq",
	"https://adlwise.com/majlis",
	"https://adlwise.com/about",
	"https://adlwise.com/about/reading-list",
	"https://adlwise.com/join",
];

for (const url of staticUrls) {
	const found = sitemapItems.find((i) => i.url === url);
	assert.ok(found, `Static canonical URL ${url} must be present in sitemap`);
}

// Count dynamic items
const lectureEntries = sitemapItems.filter((i) => i.url.startsWith("https://adlwise.com/lectures/"));
const articleEntries = sitemapItems.filter((i) => i.url.startsWith("https://adlwise.com/twasi-al-haq/"));
const majlisEntries = sitemapItems.filter((i) => i.url.startsWith("https://adlwise.com/majlis/"));

console.log(`✓ Sitemap holds ${lectureEntries.length} lecture entries (including Tarjuma & notes)`);
console.log(`✓ Sitemap holds ${articleEntries.length} article monographs`);
console.log(`✓ Sitemap holds ${majlisEntries.length} majlis sessions`);
assert.ok(lectureEntries.length >= 600, "Must have holding of >=600 lectures in sitemap");
assert.ok(articleEntries.length >= 3, "Must have articles in sitemap");
assert.ok(majlisEntries.length >= 3, "Must have majlis sessions in sitemap");


// 4. Test constructMetadata
const { constructMetadata } = await import("../src/lib/seo/metadata.ts");
console.log("Testing constructMetadata...");

// Case A: Root/Default
const defaultMeta = constructMetadata({
	canonicalUrl: "/",
});
assert.strictEqual(defaultMeta.alternates.canonical, "https://adlwise.com", "Root canonical must not have trailing slash");
assert.strictEqual(defaultMeta.openGraph.url, "https://adlwise.com");
assert.strictEqual(defaultMeta.openGraph.siteName, "Adlwise");
assert.strictEqual(defaultMeta.openGraph.locale, "en_US");
assert.deepStrictEqual(defaultMeta.openGraph.alternateLocale, ["ur_PK"]);
assert.strictEqual(defaultMeta.twitter.card, "summary_large_image");
assert.strictEqual(defaultMeta.robots.index, true);

// Case B: Article with trailing slash in argument
const articleMeta = constructMetadata({
	title: "The Third Way",
	description: "Economic treatise",
	canonicalUrl: "/twasi-al-haq/the-third-way/",
	type: "article",
	publishedTime: "2024-01-01T00:00:00Z",
	authors: ["Dr. Hafiz Haseeb"],
});
assert.strictEqual(articleMeta.alternates.canonical, "https://adlwise.com/twasi-al-haq/the-third-way", "Trailing slash must be stripped from canonical");
assert.strictEqual(articleMeta.openGraph.type, "article");
assert.strictEqual(articleMeta.openGraph.publishedTime, "2024-01-01T00:00:00Z");

// Case C: Search with noIndex
const searchMeta = constructMetadata({
	title: "Archive Search",
	canonicalUrl: "/search",
	noIndex: true,
});
assert.strictEqual(searchMeta.robots.index, false);
assert.strictEqual(searchMeta.robots.follow, false);
assert.strictEqual(searchMeta.robots.googleBot.index, false);
console.log("✓ constructMetadata verified across all edge cases.");

// 5. Test JSON-LD Schema structures
const jsonldModule = await import("../src/lib/seo/jsonld.tsx");
console.log("Testing JSON-LD Schema components...");

// Helper to extract JSON from React element
function extractSchema(element) {
	const htmlString = element.props.dangerouslySetInnerHTML.__html;
	return JSON.parse(htmlString);
}

// 5a. OrganizationJsonLd
const orgSchema = extractSchema(jsonldModule.OrganizationJsonLd());
assert.strictEqual(orgSchema["@type"], "EducationalOrganization");
assert.strictEqual(orgSchema.url, "https://adlwise.com");
assert.strictEqual(orgSchema.name, "Adlwise");
assert.ok(orgSchema.logo.url.startsWith("https://adlwise.com"));
assert.ok(Array.isArray(orgSchema.sameAs));
assert.strictEqual(orgSchema.founder["@type"], "Person");
console.log("✓ OrganizationJsonLd schema verified.");

// 5b. WebSiteJsonLd
const webSiteSchema = extractSchema(jsonldModule.WebSiteJsonLd());
assert.strictEqual(webSiteSchema["@type"], "WebSite");
assert.strictEqual(webSiteSchema.name, "Adlwise");
assert.strictEqual(webSiteSchema.url, "https://adlwise.com");
assert.strictEqual(webSiteSchema.potentialAction["@type"], "SearchAction");
assert.strictEqual(
	webSiteSchema.potentialAction.target.urlTemplate,
	"https://adlwise.com/search?q={search_term_string}"
);
console.log("✓ WebSiteJsonLd (Google Sitelinks Searchbox) verified.");

// 5c. VideoObjectJsonLd
const videoSchema = extractSchema(
	jsonldModule.VideoObjectJsonLd({
		name: "Charter of Medina Discourse",
		description: "In-depth analysis of the treaty of Medina",
		thumbnailUrl: "/images/assets/mountain-mark.png",
		uploadDate: "2024-05-10",
		durationSeconds: 3725,
		embedUrl: "https://www.youtube.com/embed/xyz123",
	})
);
assert.strictEqual(videoSchema["@type"], "VideoObject");
assert.strictEqual(videoSchema.name, "Charter of Medina Discourse");
assert.strictEqual(videoSchema.duration, "PT1H2M5S", "Duration must follow ISO 8601 duration standard");
assert.ok(videoSchema.uploadDate.includes("2024-05-10T"), "uploadDate must be standardized ISO 8601");
assert.ok(videoSchema.thumbnailUrl[0].startsWith("https://adlwise.com"), "thumbnail must be absolute URL");
assert.strictEqual(videoSchema.embedUrl, "https://www.youtube.com/embed/xyz123");
assert.strictEqual(videoSchema.publisher["@type"], "EducationalOrganization");
console.log("✓ VideoObjectJsonLd schema verified.");

// 5d. ScholarlyArticleJsonLd
const articleSchema = extractSchema(
	jsonldModule.ScholarlyArticleJsonLd({
		title: "Third Way Economics",
		description: "Analysis of monetary sovereignty",
		datePublished: "2025-01-15",
		authorName: "Dr. Hafiz Haseeb",
		url: "/twasi-al-haq/third-way",
	})
);
assert.strictEqual(articleSchema["@type"], "ScholarlyArticle");
assert.strictEqual(articleSchema.headline, "Third Way Economics");
assert.ok(articleSchema.datePublished.includes("2025-01-15T"));
assert.strictEqual(articleSchema.mainEntityOfPage["@id"], "https://adlwise.com/twasi-al-haq/third-way");
assert.ok(articleSchema.image[0].startsWith("https://adlwise.com"));
console.log("✓ ScholarlyArticleJsonLd schema verified.");

// 5e. CourseJsonLd
const courseSchema = extractSchema(
	jsonldModule.CourseJsonLd({
		name: "Tarjuma-e-Quran",
		description: "114 Surahs curriculum",
		url: "/lectures/tarjuma-e-quran",
		numberOfLessons: 114,
	})
);
assert.strictEqual(courseSchema["@type"], "Course");
assert.strictEqual(courseSchema.name, "Tarjuma-e-Quran");
assert.strictEqual(courseSchema.url, "https://adlwise.com/lectures/tarjuma-e-quran");
assert.strictEqual(courseSchema.provider["@type"], "EducationalOrganization");
console.log("✓ CourseJsonLd schema verified.");

// 5f. BreadcrumbJsonLd
const breadcrumbSchema = extractSchema(
	jsonldModule.BreadcrumbJsonLd({
		items: [
			{ name: "Home", url: "/" },
			{ name: "Lectures", url: "/lectures" },
			{ name: "Charter of Medina", url: "/lectures/charter-of-medina" },
		],
	})
);
assert.strictEqual(breadcrumbSchema["@type"], "BreadcrumbList");
assert.strictEqual(breadcrumbSchema.itemListElement.length, 3);
assert.strictEqual(breadcrumbSchema.itemListElement[0].position, 1);
assert.strictEqual(breadcrumbSchema.itemListElement[0].item, "https://adlwise.com");
assert.strictEqual(breadcrumbSchema.itemListElement[2].item, "https://adlwise.com/lectures/charter-of-medina");
console.log("✓ BreadcrumbJsonLd schema verified.");

console.log("\n==========================================");
console.log("ALL SEO & STRUCTURED DATA TESTS PASSED!");
console.log("==========================================");

