import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/config/tools";

export const metadata: Metadata = {
  title: "PDFWala – Free PDF & Image Tools for Indians | Merge, Split, Convert",
  description:
    "Free online PDF merger, splitter, image converter, passport photo maker for India. No signup. Works in browser. Supports Aadhaar, PAN, marksheets, UPSC, SSC documents.",
  keywords:
    "pdf merge india, pdf split, passport size photo maker, image converter jpg png, aadhaar pdf merge, pan card pdf, upsc document tool, free pdf tool india",
  openGraph: {
    title: "PDFWala – Free PDF & Image Tools for Indians",
    description:
      "Merge PDFs, make passport photos, convert images — all free, no signup, works in your browser.",
    url: "https://pdfwala.in",
    siteName: "PDFWala",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFWala – Free PDF & Image Tools",
    description: "Free PDF & image tools built for India. No signup needed.",
  },
  alternates: {
    canonical: "https://pdfwala.in",
  },
};

export default function Home() {
  const phase1Tools = tools.filter((t) => t.phase === 1);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PDFWala Free Tools",
    itemListElement: phase1Tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.shortName,
      url: `https://pdfwala.in/tools/${tool.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/10 via-transparent to-[#f7c59f]/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ff6b35]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#ff6b35]/10 border border-[#ff6b35]/20 rounded-full px-4 py-1.5 text-sm text-[#ff6b35] font-medium mb-6">
            <span className="w-2 h-2 bg-[#ff6b35] rounded-full animate-pulse" />
            100% Free · No Signup · Works in Browser
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tight">
            PDF & Image Tools
            <br />
            <span className="text-[#ff6b35]">Made for India</span>
          </h1>

          <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed">
            Merge your Aadhaar + PAN + marksheets. Make passport-size photos.
            Convert images for govt portals. All free, all in your browser — no
            data leaves your device.
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-sm text-[#666]">
            {["UPSC", "SSC CGL", "Railway", "Bank KYC", "NPS", "UIDAI"].map(
              (tag) => (
                <span
                  key={tag}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-white mb-2">
          All Tools — Free Forever
        </h2>
        <p className="text-[#666] mb-10">
          Click any tool to get started instantly. No account needed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phase1Tools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <article className="group relative bg-[#141414] border border-[#222] rounded-2xl p-6 hover:border-[#ff6b35]/40 hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer h-full">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff6b35]/0 to-[#ff6b35]/0 group-hover:from-[#ff6b35]/5 group-hover:to-transparent transition-all duration-300" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ background: tool.iconBg }}
                    >
                      {tool.icon}
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          tool.difficulty === "Easiest"
                            ? "bg-green-500/10 text-green-400"
                            : tool.difficulty === "Easy"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {tool.difficulty}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          tool.traffic === "High traffic"
                            ? "bg-[#ff6b35]/10 text-[#ff6b35]"
                            : tool.traffic === "Viral potential"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-[#333]/50 text-[#888]"
                        }`}
                      >
                        {tool.traffic}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#ff6b35] transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-[#ff6b35] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Use Tool
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="border-t border-[#1a1a1a] bg-[#0a0a0a] px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Your files never leave your device
          </h2>
          <p className="text-[#666] mb-10 max-w-xl mx-auto">
            All processing happens inside your browser using JavaScript. We
            never upload, store, or see your documents.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔒",
                title: "100% Private",
                desc: "Files processed locally in your browser",
              },
              {
                icon: "⚡",
                title: "Instant",
                desc: "No upload wait time, results in seconds",
              },
              {
                icon: "🆓",
                title: "Always Free",
                desc: "No hidden charges, no premium walls",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#141414] border border-[#222] rounded-2xl p-6"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-white font-bold mb-1">{item.title}</div>
                <div className="text-[#666] text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] px-6 py-8 text-center text-[#555] text-sm">
        <p>
          © {new Date().getFullYear()} PDFWala · Made with ❤️ in India · All
          tools are free forever
        </p>
      </footer>
    </main>
  );
}
