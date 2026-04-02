import { MetadataRoute } from "next";
import { tools } from "@/config/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pdfwala.in";
  const highPriority = new Set(["pdf-merger", "pdf-compress", "jpg-to-pdf"]);
  const mediumPriority = new Set(["pdf-to-jpg", "pdf-splitter", "image-converter"]);

  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: highPriority.has(tool.slug)
      ? 0.95
      : mediumPriority.has(tool.slug)
      ? 0.85
      : 0.75,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolPages,
  ];
}
