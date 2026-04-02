"use client";
import { useState } from "react";
import { DropZone } from "@/components/DropZone";
import { PDFDocument } from "pdf-lib";

function parsePageRanges(input: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const parts = input.split(",").map((s) => s.trim());
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = a; i <= b; i++) {
        if (i >= 1 && i <= maxPages) pages.add(i - 1);
      }
    } else {
      const n = Number(part);
      if (n >= 1 && n <= maxPages) pages.add(n - 1);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

export function PdfSplitterClient() {
  const [pdfFile, setPdfFile] = useState<{ file: File; totalPages: number } | null>(null);
  const [pageInput, setPageInput] = useState("");
  const [splitting, setSplitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [extractedCount, setExtractedCount] = useState(0);

  const handleFile = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const buf = await file.arrayBuffer();
    const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
    setPdfFile({ file, totalPages: doc.getPageCount() });
    setDownloadUrl(null);
  };

  const split = async () => {
    if (!pdfFile) return;
    setSplitting(true);
    try {
      const buf = await pdfFile.file.arrayBuffer();
      const src = await PDFDocument.load(buf, { ignoreEncryption: true });
      const indices = parsePageRanges(pageInput, pdfFile.totalPages);
      if (indices.length === 0) {
        alert("No valid pages found. Check your input.");
        setSplitting(false);
        return;
      }
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, indices);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const blob = new Blob([Uint8Array.from(bytes)], {
        type: "application/pdf",
      });
      setDownloadUrl(URL.createObjectURL(blob));
      setExtractedCount(indices.length);
    } catch (err) {
      alert("Error processing PDF.");
    } finally {
      setSplitting(false);
    }
  };

  const reset = () => {
    setPdfFile(null);
    setPageInput("");
    setDownloadUrl(null);
  };

  return (
    <div className="space-y-6">
      {!pdfFile && (
        <DropZone
          onFiles={handleFile}
          accept=".pdf,application/pdf"
          label="Drop your PDF here"
          sublabel="We'll show you the total pages"
        />
      )}

      {pdfFile && !downloadUrl && (
        <div className="space-y-5">
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-2xl">📄</div>
            <div className="flex-1">
              <p className="text-white font-semibold truncate">{pdfFile.file.name}</p>
              <p className="text-[#555] text-sm">{pdfFile.totalPages} pages</p>
            </div>
            <button onClick={reset} className="text-[#444] hover:text-red-400 transition-colors">✕</button>
          </div>

          <div>
            <label className="text-[#888] text-sm font-medium block mb-2">
              Pages to extract
            </label>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder="e.g.  1, 3, 5-7, 10"
              className="w-full bg-[#141414] border border-[#222] hover:border-[#333] focus:border-[#ff6b35] rounded-xl px-4 py-3 text-white placeholder-[#444] outline-none transition-colors"
            />
            <p className="text-[#444] text-xs mt-1.5">
              Comma-separated pages or ranges. Total: {pdfFile.totalPages} pages.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            {["1", "1-2", `${pdfFile.totalPages}`, `1-${Math.min(5, pdfFile.totalPages)}`].map((preset) => (
              <button
                key={preset}
                onClick={() => setPageInput(preset)}
                className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#ff6b35]/40 text-[#666] hover:text-white px-3 py-1.5 rounded-lg transition-all"
              >
                Page {preset}
              </button>
            ))}
          </div>

          <button
            onClick={split}
            disabled={!pageInput.trim() || splitting}
            className="w-full bg-[#ff6b35] hover:bg-[#ff5722] disabled:opacity-40 text-white font-bold text-lg py-4 rounded-2xl transition-colors"
          >
            {splitting ? "Extracting..." : "Extract Pages"}
          </button>
        </div>
      )}

      {downloadUrl && (
        <div className="text-center space-y-6 py-8">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-4xl mx-auto">✅</div>
          <div>
            <h2 className="text-2xl font-black text-white mb-1">Done!</h2>
            <p className="text-[#666]">{extractedCount} page{extractedCount > 1 ? "s" : ""} extracted</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={downloadUrl}
              download="extracted.pdf"
              className="inline-flex items-center justify-center gap-2 bg-[#ff6b35] hover:bg-[#ff5722] text-white font-bold px-8 py-4 rounded-2xl transition-colors text-lg"
            >
              ⬇️ Download PDF
            </a>
            <button onClick={reset} className="inline-flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] text-white font-semibold px-8 py-4 rounded-2xl transition-colors">
              Split Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
