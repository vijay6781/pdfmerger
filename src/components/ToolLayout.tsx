import Link from "next/link";
import { Tool, tools } from "@/config/tools";

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://pdfwala.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: "https://pdfwala.in/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.shortName,
        item: `https://pdfwala.in/tools/${tool.slug}`,
      },
    ],
  };

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.shortName,
    url: `https://pdfwala.in/tools/${tool.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description: tool.longDescription,
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm text-[#555]">
          <Link href="/" className="hover:text-[#ff6b35] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/"
            className="hover:text-[#ff6b35] transition-colors"
          >
            Tools
          </Link>
          <span>/</span>
          <span className="text-[#888]">{tool.shortName}</span>
        </nav>
      </div>

      {/* Tool Header */}
      <header className="max-w-4xl mx-auto px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: tool.iconBg }}
          >
            {tool.icon}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {tool.shortName}
            </h1>
            <p className="text-[#666] text-sm mt-0.5">{tool.description}</p>
          </div>
        </div>
      </header>

      {/* Tool Content */}
      <main className="max-w-4xl mx-auto px-6 pb-12">{children}</main>

      {/* About / Long Description */}
      <section className="border-t border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-xl font-bold text-white mb-3">
            About this tool
          </h2>
          <p className="text-[#666] leading-relaxed">{tool.longDescription}</p>
        </div>
      </section>

      {/* FAQ Section — Boosts SEO */}
      {tool.faqs.length > 0 && (
        <section className="border-t border-[#1a1a1a]">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <h2 className="text-xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {tool.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-[#141414] border border-[#222] rounded-xl px-5 py-4"
                >
                  <summary className="text-white font-semibold cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <svg
                      className="w-5 h-5 text-[#555] group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <p className="text-[#888] mt-3 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Tools */}
      <section className="border-t border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-lg font-bold text-white mb-4">
            Other Free Tools
          </h2>
          <div className="flex flex-wrap gap-3">
            {tools
              .filter((t) => t.slug !== tool.slug)
              .map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={`/tools/${relatedTool.slug}`}
                  className="bg-[#141414] border border-[#222] hover:border-[#ff6b35]/40 text-[#888] hover:text-white text-sm px-4 py-2 rounded-lg transition-all capitalize"
                >
                  {relatedTool.shortName}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
