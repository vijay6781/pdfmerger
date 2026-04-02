import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: "https://pdfwala.in",
    sitemap: "https://pdfwala.in/sitemap.xml",
  };
}
