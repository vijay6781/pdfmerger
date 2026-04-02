export interface Tool {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  icon: string;
  iconBg: string;
  difficulty: "Easiest" | "Easy" | "Medium";
  traffic: "High traffic" | "Viral potential" | "Medium traffic" | "Unique feature";
  phase: 1 | 2;
  keywords: string[];
  faqs: { q: string; a: string }[];
}

export const tools: Tool[] = [
  {
    slug: "pdf-merger",
    name: "PDF Merger — Combine Multiple Docs",
    shortName: "PDF Merger",
    description:
      "Merge 10th + 12th + degree marksheets, Aadhaar + PAN + photo into one PDF. Most-searched document tool in India.",
    longDescription:
      "Combine multiple PDF files into a single document instantly. Perfect for combining Aadhaar card, PAN card, marksheets, certificates, and photos into one PDF for government portals, job applications, and college admissions.",
    icon: "📄",
    iconBg: "rgba(255, 107, 53, 0.15)",
    difficulty: "Easy",
    traffic: "High traffic",
    phase: 1,
    keywords: [
      "merge pdf india",
      "combine pdf files",
      "aadhaar pan merge pdf",
      "marksheet merge pdf",
      "pdf joiner free india",
    ],
    faqs: [
      {
        q: "Can I merge Aadhaar and PAN card PDFs?",
        a: "Yes! Upload both PDFs and click Merge. The combined PDF downloads instantly to your device.",
      },
      {
        q: "Is there a file size limit?",
        a: "Each file can be up to 50MB. You can merge up to 20 PDFs at once.",
      },
      {
        q: "Are my files uploaded to a server?",
        a: "No. All merging happens inside your browser. Your files never leave your device.",
      },
      {
        q: "Can I reorder pages before merging?",
        a: "Yes, drag and drop files to reorder them before merging.",
      },
    ],
  },
  {
    slug: "pdf-compress",
    name: "Compress PDF — Reduce File Size",
    shortName: "Compress PDF",
    description:
      "Reduce PDF size for portal uploads. Useful for forms with strict limits like 100KB, 200KB, and 500KB.",
    longDescription:
      "Compress PDF files directly in your browser and reduce file size for government and job portals. Great for upload limits on forms, admissions, and KYC flows where file size matters.",
    icon: "🗜️",
    iconBg: "rgba(99, 102, 241, 0.15)",
    difficulty: "Easy",
    traffic: "High traffic",
    phase: 1,
    keywords: [
      "compress pdf online free",
      "reduce pdf size",
      "compress pdf to 100kb",
      "compress pdf to 200kb",
      "pdf size reducer india",
    ],
    faqs: [
      {
        q: "Can I compress a PDF to 100KB or 200KB?",
        a: "Yes, use stronger compression presets and try again until you hit your target size.",
      },
      {
        q: "Are my files uploaded anywhere?",
        a: "No. Compression happens locally in your browser, so your files stay on your device.",
      },
    ],
  },
  {
    slug: "passport-photo",
    name: "Passport Size Photo Maker",
    shortName: "Passport Photo",
    description:
      "Upload selfie → auto white background → crop 3.5×4.5cm → compress under 50KB → print 8 photos on A4. Replaces ₹50–200 studio visit.",
    longDescription:
      "Create professional passport-size photos instantly. Auto-removes background, resizes to exact 3.5×4.5cm, and arranges 8 photos on an A4 sheet ready to print. Perfect for UPSC, SSC, passport, visa applications.",
    icon: "🖼️",
    iconBg: "rgba(168, 85, 247, 0.15)",
    difficulty: "Easy",
    traffic: "Viral potential",
    phase: 1,
    keywords: [
      "passport size photo maker online free",
      "passport photo 3.5x4.5 cm",
      "upsc photo size",
      "remove background photo india",
      "print passport photo a4",
    ],
    faqs: [
      {
        q: "What size is a standard Indian passport photo?",
        a: "Standard Indian passport photo is 3.5cm × 4.5cm with white background.",
      },
      {
        q: "Can I use this for UPSC/SSC applications?",
        a: "Yes, the output meets standard government portal requirements.",
      },
      {
        q: "Does the background removal work on phone selfies?",
        a: "Yes, it works on any photo with a clear face. Better lighting = better results.",
      },
    ],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF — Convert Images to PDF",
    shortName: "JPG to PDF",
    description:
      "Turn JPG/PNG images into one PDF in seconds. Ideal for combining documents, receipts, and certificates.",
    longDescription:
      "Convert JPG or PNG images into a PDF without uploading to any server. Add multiple images, reorder pages, and download one clean PDF for form submissions and document sharing.",
    icon: "🖼️",
    iconBg: "rgba(14, 165, 233, 0.15)",
    difficulty: "Easiest",
    traffic: "High traffic",
    phase: 1,
    keywords: [
      "jpg to pdf online free",
      "image to pdf converter",
      "png to pdf free",
      "convert photo to pdf",
      "combine images into pdf",
    ],
    faqs: [
      {
        q: "Can I combine multiple photos into one PDF?",
        a: "Yes, upload multiple images and they will be added as separate PDF pages.",
      },
      {
        q: "Does this support PNG too?",
        a: "Yes, both JPG and PNG files are supported.",
      },
    ],
  },
  {
    slug: "pdf-splitter",
    name: "PDF Splitter — Extract Pages",
    shortName: "PDF Splitter",
    description:
      "Extract page 1 from a 20-page PDF. Students need this constantly for admit cards buried in long application PDFs.",
    longDescription:
      "Extract specific pages from any PDF. Enter page numbers or ranges to extract exactly what you need. Great for pulling out admit cards, certificates, or specific pages from large government PDFs.",
    icon: "✂️",
    iconBg: "rgba(59, 130, 246, 0.15)",
    difficulty: "Easy",
    traffic: "Medium traffic",
    phase: 1,
    keywords: [
      "split pdf free india",
      "extract pages from pdf",
      "pdf page extractor",
      "admit card extract pdf",
      "remove pages from pdf",
    ],
    faqs: [
      {
        q: "How do I extract just one page from a PDF?",
        a: "Upload the PDF, enter the page number, and click Extract. The single page downloads as a new PDF.",
      },
      {
        q: "Can I extract a range of pages?",
        a: "Yes, enter ranges like '1-3, 5, 7-10' to extract multiple pages.",
      },
    ],
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG — Convert PDF Pages to Images",
    shortName: "PDF to JPG",
    description:
      "Convert PDF pages into JPG images for uploads, sharing, and quick edits in image tools.",
    longDescription:
      "Extract every page of a PDF as high-quality JPG images right in your browser. Useful when portals ask for image uploads or when you need page-wise screenshots from a PDF.",
    icon: "📸",
    iconBg: "rgba(244, 114, 182, 0.15)",
    difficulty: "Easy",
    traffic: "High traffic",
    phase: 1,
    keywords: [
      "pdf to jpg online free",
      "convert pdf page to image",
      "pdf to jpeg converter",
      "extract pdf pages as jpg",
      "pdf image converter india",
    ],
    faqs: [
      {
        q: "Can I convert all pages at once?",
        a: "Yes, you can convert the entire PDF and download page-wise JPG images.",
      },
      {
        q: "Is there any quality loss?",
        a: "You can choose render quality. Higher quality creates larger files.",
      },
    ],
  },
  {
    slug: "image-converter",
    name: "Image Converter (JPG ↔ PNG ↔ WEBP)",
    shortName: "Image Converter",
    description:
      "Govt portals often reject PNG and accept only JPG or vice versa. One-click conversion with no quality loss. Pure Canvas API.",
    longDescription:
      "Convert images between JPG, PNG, and WEBP formats instantly. Government portals often have strict format requirements — this tool handles all conversions in one click with no quality loss.",
    icon: "🔄",
    iconBg: "rgba(16, 185, 129, 0.15)",
    difficulty: "Easiest",
    traffic: "High traffic",
    phase: 1,
    keywords: [
      "jpg to png converter free",
      "png to jpg online india",
      "convert image format free",
      "webp to jpg converter",
      "image format converter government portal",
    ],
    faqs: [
      {
        q: "Why does a govt portal reject my image?",
        a: "Most portals require JPG/JPEG format. If you have a PNG, convert it to JPG here.",
      },
      {
        q: "Will I lose image quality when converting?",
        a: "For JPG output you can set quality (default 95%). PNG is lossless. WEBP is highly optimized.",
      },
    ],
  },
  {
    slug: "portal-checker",
    name: "Portal-Specific Preset Checker",
    shortName: "Portal Checker",
    description:
      "Select portal (UIDAI / SSC CGL / UPSC / NPS / Railway / Bank KYC) — auto-shows exact size, dimension, and format requirements.",
    longDescription:
      "Stop guessing photo and document requirements. Select your target portal and instantly see exact dimensions, file size limits, format requirements, and background color rules for all major Indian government portals.",
    icon: "✅",
    iconBg: "rgba(245, 158, 11, 0.15)",
    difficulty: "Easy",
    traffic: "Unique feature",
    phase: 1,
    keywords: [
      "upsc photo requirements 2024",
      "ssc cgl photo size kb",
      "uidai aadhaar photo requirement",
      "railway ntpc photo size",
      "bank kyc document size",
      "nps photo requirement",
    ],
    faqs: [
      {
        q: "What photo size does UPSC require?",
        a: "UPSC requires 3.5×4.5cm, JPG/JPEG, white background, between 20KB-300KB.",
      },
      {
        q: "Is this updated for 2024-25 cycles?",
        a: "Yes, all portal specs are updated for the current application cycle.",
      },
    ],
  },
];
