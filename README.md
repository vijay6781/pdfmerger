# 📄 PDFWala — Free PDF & Image Tools for India

> Built with Next.js 14, Tailwind CSS, pdf-lib. All processing is 100% in-browser.

---

## 🚀 Quick Start

```bash
# 1. Clone / create project
npx create-next-app@latest pdfwala --typescript --tailwind --app --src-dir --import-alias "@/*"
cd pdfwala

# 2. Install dependencies
npm install pdf-lib

# 3. Copy all source files into src/

# 4. Run dev server
npm run dev
# → http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              ← Root layout + global SEO metadata
│   ├── page.tsx                ← Landing page (all tools grid)
│   ├── sitemap.ts              ← Auto-generated sitemap.xml
│   ├── robots.ts               ← robots.txt
│   └── tools/
│       ├── pdf-merger/
│       │   ├── page.tsx        ← SEO metadata (server component)
│       │   └── PdfMergerClient.tsx  ← Actual tool (client component)
│       ├── pdf-splitter/
│       ├── image-converter/
│       ├── passport-photo/
│       └── portal-checker/
├── components/
│   ├── Navbar.tsx              ← Sticky nav with mobile menu
│   ├── ToolLayout.tsx          ← Shared layout: breadcrumb, FAQ, related tools
│   └── DropZone.tsx            ← Reusable drag-and-drop file input
└── config/
    └── tools.ts                ← Single source of truth for all tool metadata
```

---

## 🛠️ Phase 1 — Tools Built

| Tool | Slug | Library | Status |
|------|------|---------|--------|
| PDF Merger | `/tools/pdf-merger` | pdf-lib | ✅ Done |
| PDF Splitter | `/tools/pdf-splitter` | pdf-lib | ✅ Done |
| Image Converter | `/tools/image-converter` | Canvas API | ✅ Done |
| Passport Photo Maker | `/tools/passport-photo` | Canvas API | ✅ Done |
| Portal Preset Checker | `/tools/portal-checker` | JSON config | ✅ Done |

---

## 🔍 SEO Strategy

### What's built in:
- ✅ Per-page `<title>` and `<meta description>` optimised for Indian search queries
- ✅ OpenGraph tags for WhatsApp/Twitter sharing
- ✅ `sitemap.xml` auto-generated at `/sitemap.xml`
- ✅ `robots.txt` at `/robots.txt`
- ✅ **FAQ Schema** (JSON-LD) on every tool page → rich snippets in Google
- ✅ **Breadcrumb Schema** on every tool page
- ✅ **WebSite Schema** on homepage
- ✅ Canonical URLs set on every page
- ✅ `lang="en-IN"` and `locale: "en_IN"` for India targeting
- ✅ Internal linking between tools (Related Tools section)

### Target keywords per tool:
- **PDF Merger**: "merge pdf india", "combine aadhaar pan pdf", "pdf joiner free"
- **PDF Splitter**: "extract page from pdf", "split pdf free india", "admit card extract"
- **Image Converter**: "jpg to png converter free", "png to jpg online india"
- **Passport Photo**: "passport size photo maker online free", "3.5x4.5 cm photo"
- **Portal Checker**: "upsc photo requirements", "ssc cgl photo size kb"

### To do for more traffic:
1. Add Google Analytics: `npm install @next/third-parties` and use `<GoogleAnalytics>`
2. Submit sitemap to [Google Search Console](https://search.google.com/search-console)
3. Write blog posts targeting long-tail keywords (e.g. "how to merge aadhaar and pan card pdf")
4. Add Hindi language support (`/hi/` routes) — huge traffic boost
5. Share on Reddit: r/india, r/developersIndia

---

## 💰 Monetization Roadmap

### Phase 1 (Now — Free, build traffic)
- Launch all 5 tools
- No paywall, build trust and SEO

### Phase 2 (100 daily users)
- Add Google AdSense on result/download pages
- `NEXT_PUBLIC_ADSENSE_ID` env var ready in `.env.example`

### Phase 3 (1000 daily users)
- Add Razorpay Pro plan (₹99/month):
  - Unlimited file size (vs 10MB free)
  - Batch processing
  - No ads
- Add more tools: PDF compress, watermark, e-sign

---

## 🚢 Deployment (Free on Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo to vercel.com for auto-deploy
```

**Custom domain**: Buy `pdfwala.in` on GoDaddy/Namecheap (~₹800/year), add to Vercel for free.

---

## 📦 Phase 2 Tools to Add Next

```
/tools/pdf-compress        → compress-pdf.js or browser wasm
/tools/pdf-to-image        → pdf.js → canvas → download as JPG
/tools/image-resize        → Canvas API, set px/cm dimensions
/tools/image-compress      → Canvas quality slider
/tools/pdf-watermark       → pdf-lib text overlay
/tools/merge-images        → Canvas stitch images together
```

---

## 🧱 Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (App Router) | SEO, routing, TypeScript |
| Styling | Tailwind CSS | Fast UI, dark theme |
| PDF processing | pdf-lib | Pure JS, no server needed |
| Image processing | Canvas API | Built-in browser, zero deps |
| Fonts | Syne + DM Sans (Google Fonts) | Fast, good looking |
| Deploy | Vercel (free tier) | Auto SSL, CDN, custom domain |

---

## 📝 License

MIT — use freely, build your SaaS on top.
