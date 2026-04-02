import type { Metadata } from "next";
import { tools } from "@/config/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { PdfMergerClient } from "./PdfMergerClient";

const tool = tools.find((t) => t.slug === "pdf-merger")!;

export const metadata: Metadata = {
  title: "PDF Merger — Merge PDF Files Free Online India",
  description:
    "Merge multiple PDF files into one. Combine Aadhaar + PAN + marksheets + photos. Free, no signup, works in browser. No file upload to server.",
  keywords: tool.keywords.join(", "),
  openGraph: {
    title: "PDF Merger — Free Online PDF Combiner for India",
    description: "Merge Aadhaar, PAN, marksheets into one PDF. Free & instant.",
    url: "https://pdfwala.in/tools/pdf-merger",
  },
  alternates: {
    canonical: "https://pdfwala.in/tools/pdf-merger",
  },
};

export default function PdfMergerPage() {
  return (
    <ToolLayout tool={tool}>
      <PdfMergerClient />
    </ToolLayout>
  );
}
