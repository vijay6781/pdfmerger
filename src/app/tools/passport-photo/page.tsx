import type { Metadata } from "next";
import { tools } from "@/config/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { PassportPhotoClient } from "./PassportPhotoClient";

const tool = tools.find((t) => t.slug === "passport-photo")!;

export const metadata: Metadata = {
  title: "Passport Size Photo Maker — 3.5x4.5cm Free Online India",
  description:
    "Make passport size photos online free. Auto white background, 3.5×4.5cm crop, 8 photos on A4. Works for UPSC, SSC, Passport, Visa, Railway applications.",
  keywords: tool.keywords.join(", "),
  alternates: { canonical: "https://pdfwala.in/tools/passport-photo" },
};

export default function PassportPhotoPage() {
  return (
    <ToolLayout tool={tool}>
      <PassportPhotoClient />
    </ToolLayout>
  );
}
