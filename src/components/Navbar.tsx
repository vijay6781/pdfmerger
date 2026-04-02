"use client";
import Link from "next/link";
import { useState } from "react";
import { tools } from "@/config/tools";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0f0f0f]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          <span className="font-syne font-black text-xl text-white">
            PDF<span className="text-[#ff6b35]">Wala</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {tools.slice(0, 4).map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="text-sm text-[#888] hover:text-white transition-colors"
            >
              {tool.shortName}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/"
            className="text-sm bg-[#ff6b35] hover:bg-[#ff5722] text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            All Tools
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#888] hover:text-white"
          onClick={() => setOpen(!open)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#1a1a1a] bg-[#0a0a0a] px-6 py-4 flex flex-col gap-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              onClick={() => setOpen(false)}
              className="text-sm text-[#888] hover:text-white py-1 transition-colors"
            >
              {tool.icon} {tool.shortName}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
