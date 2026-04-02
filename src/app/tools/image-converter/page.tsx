import type { Metadata } from "next";
import { tools } from "@/config/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { ImageConverterClient } from "./ImageConverterClient";

const tool = tools.find((t) => t.slug === "image-converter")!;

export const metadata: Metadata = {
  title: "Image Converter — JPG to PNG, PNG to JPG, WEBP Free Online",
  description:
    "Convert JPG to PNG, PNG to JPG, JPG to WEBP instantly. Free image format converter for govt portals. No upload needed — works in browser.",
  keywords: tool.keywords.join(", "),
  openGraph: {
    title: "Image Converter — JPG PNG WEBP Free Converter India",
    description: "Convert image formats instantly. Free, no signup, in-browser.",
    url: "https://pdfwala.in/tools/image-converter",
  },
  alternates: { canonical: "https://pdfwala.in/tools/image-converter" },
};

export default function ImageConverterPage() {
  return (
    <ToolLayout tool={tool}>
      <ImageConverterClient />
    </ToolLayout>
  );
}
