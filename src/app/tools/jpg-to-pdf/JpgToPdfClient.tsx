"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { DropZone } from "@/components/DropZone";

interface ImageItem {
  id: string;
  file: File;
  url: string;
  name: string;
  size: string;
}

type OutputMode = "original" | "a4";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function JpgToPdfClient() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [converting, setConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [outputMode, setOutputMode] = useState<OutputMode>("original");

  const addImages = (files: File[]) => {
    const filtered = files.filter((file) =>
      ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
    );
    const mapped = filtered.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: formatSize(file.size),
    }));

    setImages((prev) => [...prev, ...mapped]);
    setDone(false);
    setDownloadUrl(null);
  };

  const moveImage = (fromIdx: number, toIdx: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setDone(false);
    setDownloadUrl(null);
  };

  const convert = async () => {
    if (images.length === 0) return;
    setConverting(true);

    try {
      const out = await PDFDocument.create();

      for (const item of images) {
        const bytes = await item.file.arrayBuffer();
        const mime = item.file.type;

        const embedded = mime === "image/png"
          ? await out.embedPng(bytes)
          : await out.embedJpg(bytes);

        const { width, height } = embedded.scale(1);

        if (outputMode === "original") {
          // Best quality: keep original pixel dimensions with zero resampling.
          const page = out.addPage([width, height]);
          page.drawImage(embedded, {
            x: 0,
            y: 0,
            width,
            height,
          });
        } else {
          // A4 portrait page in PDF points.
          const pageWidth = 595.28;
          const pageHeight = 841.89;
          const margin = 24;
          const maxW = pageWidth - margin * 2;
          const maxH = pageHeight - margin * 2;
          const scale = Math.min(maxW / width, maxH / height);
          const drawW = width * scale;
          const drawH = height * scale;
          const x = (pageWidth - drawW) / 2;
          const y = (pageHeight - drawH) / 2;

          const page = out.addPage([pageWidth, pageHeight]);
          page.drawImage(embedded, {
            x,
            y,
            width: drawW,
            height: drawH,
          });
        }
      }

      const pdfBytes = await out.save({ useObjectStreams: true });
      const blob = new Blob([Uint8Array.from(pdfBytes)], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDone(true);
    } catch (error) {
      console.error(error);
      alert("Could not convert images to PDF. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  const reset = () => {
    setImages([]);
    setDone(false);
    setDownloadUrl(null);
  };

  return (
    <div className="space-y-6">
      {!done && (
        <>
          <DropZone
            onFiles={addImages}
            accept="image/jpeg,image/jpg,image/png"
            multiple
            label="Drop JPG/PNG images here"
            sublabel="Add multiple images and reorder them"
          />

          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[#888] text-sm">
                  {images.length} image{images.length > 1 ? "s" : ""} selected
                </p>
                <button
                  onClick={reset}
                  className="text-xs text-[#555] hover:text-red-400 transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-2">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={() => setDragId(img.id)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (!dragId || dragId === img.id) return;
                      const fromIdx = images.findIndex((x) => x.id === dragId);
                      moveImage(fromIdx, idx);
                    }}
                    onDragEnd={() => setDragId(null)}
                    className="flex items-center gap-3 bg-[#141414] border border-[#222] rounded-xl px-4 py-3 cursor-grab active:cursor-grabbing group hover:border-[#333] transition-all"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-12 h-12 object-cover rounded-lg border border-[#2a2a2a]"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{img.name}</p>
                      <p className="text-[#555] text-xs">{img.size}</p>
                    </div>

                    <span className="text-[#444] text-xs w-6 text-center">#{idx + 1}</span>

                    <button
                      onClick={() => removeImage(img.id)}
                      className="text-[#444] hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={convert}
                disabled={images.length === 0 || converting}
                className="w-full bg-[#ff6b35] hover:bg-[#ff5722] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-2xl transition-colors mt-4"
              >
                {converting ? "Converting..." : `Convert ${images.length} image${images.length > 1 ? "s" : ""} to PDF`}
              </button>

              <div>
                <label className="text-[#888] text-sm font-medium block mb-2">
                  Output mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => setOutputMode("original")}
                    className={`rounded-xl border px-4 py-2.5 text-left transition-all ${
                      outputMode === "original"
                        ? "bg-[#ff6b35]/10 border-[#ff6b35]/60"
                        : "bg-[#141414] border-[#222] hover:border-[#444]"
                    }`}
                  >
                    <p className="text-white text-sm font-semibold">
                      Original Quality
                    </p>
                    <p className="text-[#666] text-xs">
                      Sharpest output, larger file
                    </p>
                  </button>
                  <button
                    onClick={() => setOutputMode("a4")}
                    className={`rounded-xl border px-4 py-2.5 text-left transition-all ${
                      outputMode === "a4"
                        ? "bg-[#ff6b35]/10 border-[#ff6b35]/60"
                        : "bg-[#141414] border-[#222] hover:border-[#444]"
                    }`}
                  >
                    <p className="text-white text-sm font-semibold">
                      Fit to A4
                    </p>
                    <p className="text-[#666] text-xs">
                      Print-friendly, smaller pages
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {done && downloadUrl && (
        <div className="text-center space-y-6 py-8">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-4xl mx-auto">
            ✅
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">PDF Ready!</h2>
            <p className="text-[#666]">{images.length} images converted into one PDF.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={downloadUrl}
              download="images-to-pdf.pdf"
              className="inline-flex items-center justify-center gap-2 bg-[#ff6b35] hover:bg-[#ff5722] text-white font-bold px-8 py-4 rounded-2xl transition-colors text-lg"
            >
              ⬇️ Download PDF
            </a>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] text-white font-semibold px-8 py-4 rounded-2xl transition-colors"
            >
              Convert More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
