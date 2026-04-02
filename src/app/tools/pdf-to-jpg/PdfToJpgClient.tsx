"use client";
import { useMemo, useState } from "react";
import { DropZone } from "@/components/DropZone";

type PdfJs = typeof import("pdfjs-dist");
let pdfJsPromise: Promise<PdfJs> | null = null;

async function getPdfJs() {
  if (!pdfJsPromise) {
    pdfJsPromise = import("pdfjs-dist");
  }
  return pdfJsPromise;
}

type Quality = "standard" | "high";

const QUALITY_CONFIG: Record<Quality, { scale: number; jpeg: number; label: string }> = {
  standard: {
    scale: 1.5,
    jpeg: 0.85,
    label: "Standard",
  },
  high: {
    scale: 2.2,
    jpeg: 0.92,
    label: "High",
  },
};

interface OutputImage {
  name: string;
  url: string;
  size: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfToJpgClient() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [quality, setQuality] = useState<Quality>("standard");
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputImages, setOutputImages] = useState<OutputImage[]>([]);

  const outputCount = useMemo(() => outputImages.length, [outputImages]);

  const handleFile = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (!(file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
      alert("Please upload a valid PDF file.");
      return;
    }

    try {
      const { getDocument } = await getPdfJs();
      const bytes = await file.arrayBuffer();
      const loadingTask = getDocument({ data: bytes, disableWorker: true } as any);
      const pdf = await loadingTask.promise;
      setPdfFile(file);
      setPageCount(pdf.numPages);
      setOutputImages([]);
      setProgress(0);
    } catch (error) {
      console.error(error);
      alert("Could not read this PDF file.");
    }
  };

  const convert = async () => {
    if (!pdfFile) return;

    setConverting(true);
    setProgress(0);
    setOutputImages([]);

    try {
      const { getDocument } = await getPdfJs();
      const config = QUALITY_CONFIG[quality];
      const bytes = await pdfFile.arrayBuffer();
      const loadingTask = getDocument({ data: bytes, disableWorker: true } as any);
      const pdf = await loadingTask.promise;
      const images: OutputImage[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: config.scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas not supported");

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
        }).promise;

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, "image/jpeg", config.jpeg);
        });

        if (!blob) throw new Error("Could not convert page to JPG");

        images.push({
          name: `page-${i}.jpg`,
          url: URL.createObjectURL(blob),
          size: formatSize(blob.size),
        });

        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      setOutputImages(images);
    } catch (error) {
      console.error(error);
      alert("Conversion failed. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  const reset = () => {
    setPdfFile(null);
    setPageCount(null);
    setProgress(0);
    setOutputImages([]);
  };

  return (
    <div className="space-y-6">
      {!pdfFile && (
        <DropZone
          onFiles={handleFile}
          accept=".pdf,application/pdf"
          label="Drop your PDF here"
          sublabel="Convert every page to JPG images"
        />
      )}

      {pdfFile && outputCount === 0 && (
        <div className="space-y-5">
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-2xl">📸</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{pdfFile.name}</p>
              <p className="text-[#555] text-sm">{pageCount ?? "-"} pages</p>
            </div>
            <button onClick={reset} className="text-[#444] hover:text-red-400 transition-colors">
              ✕
            </button>
          </div>

          <div>
            <label className="text-[#888] text-sm font-medium block mb-3">Output quality</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(QUALITY_CONFIG) as Quality[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setQuality(key)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    quality === key
                      ? "bg-[#ff6b35]/10 border-[#ff6b35]/60"
                      : "bg-[#141414] border-[#222] hover:border-[#444]"
                  }`}
                >
                  <p className="text-white font-semibold text-sm">{QUALITY_CONFIG[key].label}</p>
                  <p className="text-[#666] text-xs mt-1">
                    {key === "high" ? "Sharper text, larger files" : "Smaller files, faster conversion"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={convert}
            disabled={converting}
            className="w-full bg-[#ff6b35] hover:bg-[#ff5722] disabled:opacity-40 text-white font-bold text-lg py-4 rounded-2xl transition-colors"
          >
            {converting ? `Converting... ${progress}%` : "Convert PDF to JPG"}
          </button>

          {converting && (
            <div className="w-full bg-[#1a1a1a] rounded-full h-1.5">
              <div
                className="bg-[#ff6b35] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {outputCount > 0 && (
        <div className="space-y-5">
          <div className="text-center py-2">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">✅</div>
            <h2 className="text-2xl font-black text-white">Converted {outputCount} page{outputCount > 1 ? "s" : ""}</h2>
            <p className="text-[#666] mt-1">Download each page as JPG.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {outputImages.map((img) => (
              <div key={img.name} className="bg-[#141414] border border-[#222] rounded-xl p-3">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-44 object-contain bg-[#0f0f0f] rounded-lg border border-[#1e1e1e]"
                />
                <div className="flex items-center justify-between mt-3 gap-2">
                  <div>
                    <p className="text-white text-sm font-medium">{img.name}</p>
                    <p className="text-[#666] text-xs">{img.size}</p>
                  </div>
                  <a
                    href={img.url}
                    download={img.name}
                    className="text-sm bg-[#ff6b35] hover:bg-[#ff5722] text-white font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={reset}
            className="w-full sm:w-auto mx-auto block bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] text-white font-semibold px-8 py-3 rounded-2xl transition-colors"
          >
            Convert Another PDF
          </button>
        </div>
      )}
    </div>
  );
}
