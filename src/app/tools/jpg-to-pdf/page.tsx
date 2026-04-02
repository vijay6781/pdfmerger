import type { Metadata } from "next";
import { tools } from "@/config/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { JpgToPdfClient } from "./JpgToPdfClient";

const tool = tools.find((t) => t.slug === "jpg-to-pdf")!;

export const metadata: Metadata = {
  title: "JPG to PDF — Convert Images to PDF Free Online India",
  description:
    "Convert JPG and PNG images to PDF instantly. Combine multiple photos into one PDF for forms and document uploads. Free, no signup, in-browser.",
  keywords: tool.keywords.join(", "),
  openGraph: {
    title: "JPG to PDF — Free Image to PDF Converter",
    description: "Convert multiple images into one PDF in seconds.",
    url: "https://pdfwala.in/tools/jpg-to-pdf",
  },
  alternates: { canonical: "https://pdfwala.in/tools/jpg-to-pdf" },
};

export default function JpgToPdfPage() {
  return (
    <ToolLayout tool={tool}>
      <JpgToPdfClient />
    </ToolLayout>
  );
}
