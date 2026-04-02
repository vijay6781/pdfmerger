import type { Metadata } from "next";
import { tools } from "@/config/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { PdfSplitterClient } from "./PdfSplitterClient";

const tool = tools.find((t) => t.slug === "pdf-splitter")!;

export const metadata: Metadata = {
  title: "PDF Splitter — Extract Pages from PDF Free Online India",
  description:
    "Extract specific pages from any PDF. Get your admit card or certificate from a 20-page PDF. Free, no signup, works in browser.",
  keywords: tool.keywords.join(", "),
  alternates: { canonical: "https://pdfwala.in/tools/pdf-splitter" },
};

export default function PdfSplitterPage() {
  return (
    <ToolLayout tool={tool}>
      <PdfSplitterClient />
    </ToolLayout>
  );
}
