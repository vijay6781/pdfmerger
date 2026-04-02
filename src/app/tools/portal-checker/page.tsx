import type { Metadata } from "next";
import { tools } from "@/config/tools";
import { ToolLayout } from "@/components/ToolLayout";
import { PortalCheckerClient } from "./PortalCheckerClient";

const tool = tools.find((t) => t.slug === "portal-checker")!;

export const metadata: Metadata = {
  title: "Portal Photo Requirements — UPSC, SSC, Railway, UIDAI, Bank KYC",
  description:
    "Exact photo and document size requirements for UPSC, SSC CGL, Railway NTPC, UIDAI, NPS, Bank KYC. Avoid rejection — check before uploading.",
  keywords: tool.keywords.join(", "),
  alternates: { canonical: "https://pdfwala.in/tools/portal-checker" },
};

export default function PortalCheckerPage() {
  return (
    <ToolLayout tool={tool}>
      <PortalCheckerClient />
    </ToolLayout>
  );
}
