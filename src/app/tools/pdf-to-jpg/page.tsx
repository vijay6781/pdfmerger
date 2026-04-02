import type { Metadata } from "next";
import { tools } from "@/config/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { PdfToJpgClient } from "./PdfToJpgClient";

const tool = tools.find((t) => t.slug === "pdf-to-jpg")!;

export const metadata: Metadata = {
  title: "PDF to JPG — Convert PDF Pages to Images Free Online India",
  description:
    "Convert PDF pages to JPG images instantly. Free PDF to image converter for form uploads and sharing. No signup, works in browser.",
  keywords: tool.keywords.join(", "),
  openGraph: {
    title: "PDF to JPG — Free PDF Page to Image Tool",
    description: "Convert every PDF page to JPG in seconds.",
    url: "https://pdfwala.in/tools/pdf-to-jpg",
  },
  alternates: { canonical: "https://pdfwala.in/tools/pdf-to-jpg" },
};

export default function PdfToJpgPage() {
  return (
    <ToolLayout tool={tool}>
      <PdfToJpgClient />
    </ToolLayout>
  );
}
