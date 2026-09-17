import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
          "/search",
          "/search*",
        ],
      },
      {
        userAgent: ["Googlebot", "OAI-SearchBot", "Applebot", "Bingbot"],
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
          "/search",
          "/search*",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
