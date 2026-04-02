import type { Metadata } from "next";
import { tools } from "@/config/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { PdfCompressClient } from "./PdfCompressClient";

const tool = tools.find((t) => t.slug === "pdf-compress")!;

export const metadata: Metadata = {
  title: "Compress PDF — Reduce PDF File Size Free Online India",
  description:
    "Compress PDF files online for portal upload limits like 100KB, 200KB, and 500KB. Free, no signup, works in your browser.",
  keywords: tool.keywords.join(", "),
  openGraph: {
    title: "Compress PDF — Free PDF Size Reducer India",
    description: "Reduce PDF size quickly for forms and portal uploads.",
    url: "https://pdfwala.in/tools/pdf-compress",
  },
  alternates: { canonical: "https://pdfwala.in/tools/pdf-compress" },
};

export default function PdfCompressPage() {
  return (
    <ToolLayout tool={tool}>
      <PdfCompressClient />
    </ToolLayout>
  );
}
