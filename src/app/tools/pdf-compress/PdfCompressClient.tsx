"use client";
import { useMemo, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { DropZone } from "@/components/DropZone";

type CompressionPreset = "balanced" | "strong" | "maximum" | "ultra";

const PRESET_CONFIG: Record<
  CompressionPreset,
  {
    label: string;
    note: string;
    mode: "structural" | "raster";
    scale: number;
    jpegQuality: number;
    maxPixels: number;
    grayscale: boolean;
  }
> = {
  balanced: {
    label: "Balanced",
    note: "Better quality, moderate reduction",
    mode: "structural",
    scale: 1.3,
    jpegQuality: 0.78,
    maxPixels: 2_800_000,
    grayscale: false,
  },
  strong: {
    label: "Strong",
    note: "Good quality with high reduction",
    mode: "raster",
    scale: 1.2,
    jpegQuality: 0.68,
    maxPixels: 2_200_000,
    grayscale: false,
  },
  maximum: {
    label: "Maximum",
    note: "Highest compression, lower clarity",
    mode: "raster",
    scale: 1.0,
    jpegQuality: 0.55,
    maxPixels: 1_500_000,
    grayscale: false,
  },
  ultra: {
    label: "Ultra",
    note: "Smallest size, strongest quality loss",
    mode: "raster",
    scale: 0.72,
    jpegQuality: 0.34,
    maxPixels: 700_000,
    grayscale: true,
  },
};

type PdfJs = typeof import("pdfjs-dist");
let pdfJsPromise: Promise<PdfJs> | null = null;

async function getPdfJs() {
  if (!pdfJsPromise) {
    pdfJsPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((mod: any) => {
      // Use local worker file to avoid CDN/network failures.
      mod.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      return mod as PdfJs;
    });
  }
  return pdfJsPromise;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function applyGrayscale(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) | 0;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
  context.putImageData(imageData, 0, 0);
}

export function PdfCompressClient() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [preset, setPreset] = useState<CompressionPreset>("strong");
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const originalSize = useMemo(() => (pdfFile ? pdfFile.size : null), [pdfFile]);

  const handleFile = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Accept upload first; some valid PDFs fail strict early parsing.
    setPdfFile(file);
    setDownloadUrl(null);
    setCompressedSize(null);
    setProgress(0);
    setPageCount(null);
    setNote(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch (error) {
      console.warn("Page count unavailable for this PDF:", error);
    }
  };

  const compressPdf = async () => {
    if (!pdfFile) return;

    setCompressing(true);
    setProgress(0);

    try {
      const srcBytes = await pdfFile.arrayBuffer();
      let resultBytes: Uint8Array<ArrayBufferLike>;
      let usedFallback = false;

      if (PRESET_CONFIG[preset].mode === "structural") {
        const srcPdf = await PDFDocument.load(srcBytes, {
          ignoreEncryption: true,
          updateMetadata: false,
        });
        const outPdf = await PDFDocument.create();
        const pageIndices = srcPdf.getPageIndices();
        const copiedPages = await outPdf.copyPages(srcPdf, pageIndices);
        copiedPages.forEach((page, i) => {
          outPdf.addPage(page);
          setProgress(Math.round(((i + 1) / copiedPages.length) * 80));
        });

        resultBytes = await outPdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
          updateFieldAppearances: true,
        });
      } else {
        try {
          const { getDocument } = await getPdfJs();
          const rasterCompress = async (
            inputBytes: ArrayBuffer | Uint8Array,
            disableWorker: boolean,
            options?: {
              scale?: number;
              jpegQuality?: number;
              maxPixels?: number;
              grayscale?: boolean;
            }
          ) => {
            const openPdf = async () => {
              const attemptA = getDocument({
                data: inputBytes,
                disableWorker,
                disableStream: true,
                disableRange: true,
                useWorkerFetch: false,
                stopAtErrors: false,
              } as any);
              try {
                return await attemptA.promise;
              } catch {
                const attemptB = getDocument({
                  data: inputBytes,
                  disableWorker: true,
                  disableStream: true,
                  disableRange: true,
                  useWorkerFetch: false,
                  stopAtErrors: false,
                } as any);
                return await attemptB.promise;
              }
            };

            const loadedPdf = await openPdf();
            const srcLibForFallback = await PDFDocument.load(inputBytes, {
              ignoreEncryption: true,
              updateMetadata: false,
            });
            const outPdf = await PDFDocument.create();
            const presetCfg = PRESET_CONFIG[preset];
            const scale = options?.scale ?? presetCfg.scale;
            const jpegQuality = options?.jpegQuality ?? presetCfg.jpegQuality;
            const maxPixels = options?.maxPixels ?? presetCfg.maxPixels;
            const grayscale = options?.grayscale ?? presetCfg.grayscale;
            const chunkSize = preset === "ultra" ? 20 : preset === "maximum" ? 30 : 40;
            let fallbackPages = 0;

            for (
              let chunkStart = 1;
              chunkStart <= loadedPdf.numPages;
              chunkStart += chunkSize
            ) {
              const chunkEnd = Math.min(chunkStart + chunkSize - 1, loadedPdf.numPages);

              for (let i = chunkStart; i <= chunkEnd; i++) {
                const page = await loadedPdf.getPage(i);
                const baseViewport = page.getViewport({ scale });

                const currentPixels = baseViewport.width * baseViewport.height;
                const pixelScale =
                  currentPixels > maxPixels
                    ? Math.sqrt(maxPixels / currentPixels)
                    : 1;

                const finalScale = scale * pixelScale;
                const viewport = page.getViewport({ scale: finalScale });

                let rendered = false;
                let retryScale = finalScale;
                let retryQuality = jpegQuality;

                for (let attempt = 0; attempt < 2 && !rendered; attempt++) {
                  const canvas = document.createElement("canvas");
                  const context = canvas.getContext("2d", {
                    alpha: false,
                    willReadFrequently: grayscale,
                  });
                  if (!context) throw new Error("Canvas is not available");

                  canvas.width = Math.max(1, Math.floor(viewport.width * (retryScale / finalScale)));
                  canvas.height = Math.max(1, Math.floor(viewport.height * (retryScale / finalScale)));

                  try {
                    const attemptViewport = page.getViewport({ scale: retryScale });
                    await page.render({
                      canvasContext: context,
                      viewport: attemptViewport,
                      canvas,
                    } as any).promise;

                    if (grayscale) {
                      applyGrayscale(context, canvas.width, canvas.height);
                    }

                    const blob = await new Promise<Blob | null>((resolve) => {
                      canvas.toBlob(resolve, "image/jpeg", retryQuality);
                    });
                    if (!blob) throw new Error("Failed to encode page image");

                    const imgBytes = await blob.arrayBuffer();
                    const jpg = await outPdf.embedJpg(imgBytes);
                    const outPage = outPdf.addPage([attemptViewport.width, attemptViewport.height]);
                    outPage.drawImage(jpg, {
                      x: 0,
                      y: 0,
                      width: attemptViewport.width,
                      height: attemptViewport.height,
                    });
                    rendered = true;
                  } catch (pageErr) {
                    if (attempt === 1) {
                      fallbackPages += 1;
                      const copied = await outPdf.copyPages(srcLibForFallback, [i - 1]);
                      outPdf.addPage(copied[0]);
                    } else {
                      retryScale = Math.max(0.5, retryScale * 0.75);
                      retryQuality = Math.max(0.2, retryQuality * 0.8);
                    }
                  } finally {
                    canvas.width = 1;
                    canvas.height = 1;
                  }
                }

                page.cleanup();
                setProgress(Math.round((i / loadedPdf.numPages) * 90));
              }

              // Yield between chunks for stability on very large documents.
              await new Promise((resolve) => setTimeout(resolve, 0));
            }

            if (fallbackPages > 0) {
              setNote(
                `Chunk mode active. ${fallbackPages} page(s) used compatibility fallback; others were aggressively compressed.`
              );
            }

            return outPdf.save({
              useObjectStreams: true,
              addDefaultPage: false,
              updateFieldAppearances: false,
            });
          };

          try {
            resultBytes = await rasterCompress(srcBytes, false);
          } catch (workerErr) {
            console.warn("Worker raster failed, retrying without worker:", workerErr);
            resultBytes = await rasterCompress(srcBytes, true);
          }

          // For very stubborn PDFs, Ultra runs a second, harsher pass automatically.
          if (preset === "ultra") {
            const firstReduction =
              ((srcBytes.byteLength - resultBytes.length) / srcBytes.byteLength) * 100;
            if (firstReduction < 20) {
              setNote("Ultra pass 2 running for stronger compression...");
              try {
                resultBytes = await rasterCompress(resultBytes, true, {
                  scale: PRESET_CONFIG.ultra.scale * 0.82,
                  jpegQuality: Math.max(0.22, PRESET_CONFIG.ultra.jpegQuality * 0.8),
                  maxPixels: Math.floor(PRESET_CONFIG.ultra.maxPixels * 0.6),
                  grayscale: true,
                });
              } catch (pass2Err) {
                console.warn("Ultra pass 2 failed, keeping pass 1:", pass2Err);
              }
            }
          }
        } catch (rasterError) {
          // Fallback for very large/complex PDFs where raster mode can fail.
          console.warn("Raster compression failed, using fallback:", rasterError);
          usedFallback = true;
          const srcPdf = await PDFDocument.load(srcBytes, {
            ignoreEncryption: true,
            updateMetadata: false,
          });
          const outPdf = await PDFDocument.create();
          const pageIndices = srcPdf.getPageIndices();
          const copiedPages = await outPdf.copyPages(srcPdf, pageIndices);
          copiedPages.forEach((page, i) => {
            outPdf.addPage(page);
            setProgress(Math.round(((i + 1) / copiedPages.length) * 90));
          });
          resultBytes = await outPdf.save({
            useObjectStreams: true,
            addDefaultPage: false,
            updateFieldAppearances: true,
          });
        }

        if (usedFallback) {
          setNote(
            "Used compatibility mode for this PDF. Try Ultra on desktop Chrome for stronger compression."
          );
        } else {
          setNote(null);
        }
      }

      const blob = new Blob([Uint8Array.from(resultBytes)], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setCompressedSize(blob.size);
      setProgress(100);
    } catch (error) {
      console.error(error);
      alert("Compression failed for this PDF. It may be protected or unsupported.");
    } finally {
      setCompressing(false);
    }
  };

  const reset = () => {
    setPdfFile(null);
    setPageCount(null);
    setProgress(0);
    setDownloadUrl(null);
    setCompressedSize(null);
    setNote(null);
  };

  const reductionPercent =
    originalSize && compressedSize
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : null;

  return (
    <div className="space-y-6">
      {!pdfFile && (
        <DropZone
          onFiles={handleFile}
          accept=".pdf,application/pdf"
          label="Drop your PDF here"
          sublabel="Compress for upload limits like 100KB, 200KB, 500KB"
        />
      )}

      {pdfFile && !downloadUrl && (
        <div className="space-y-5">
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-2xl">🗜️</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{pdfFile.name}</p>
              <p className="text-[#555] text-sm">
                {formatSize(pdfFile.size)}{pageCount ? ` · ${pageCount} pages` : ""}
              </p>
            </div>
            <button onClick={reset} className="text-[#444] hover:text-red-400 transition-colors">
              ✕
            </button>
          </div>

          <div>
            <label className="text-[#888] text-sm font-medium block mb-3">Compression level</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(PRESET_CONFIG) as CompressionPreset[]).map((key) => {
                const item = PRESET_CONFIG[key];
                return (
                  <button
                    key={key}
                    onClick={() => setPreset(key)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      preset === key
                        ? "bg-[#ff6b35]/10 border-[#ff6b35]/60"
                        : "bg-[#141414] border-[#222] hover:border-[#444]"
                    }`}
                  >
                    <p className="text-white font-semibold text-sm">{item.label}</p>
                    <p className="text-[#666] text-xs mt-1">{item.note}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#141414] border border-[#222] rounded-xl p-3 text-xs text-[#777]">
            Note: Use `Maximum` or `Ultra` for much smaller files. These modes
            rasterize pages and can reduce text sharpness.
          </div>

          <button
            onClick={compressPdf}
            disabled={compressing}
            className="w-full bg-[#ff6b35] hover:bg-[#ff5722] disabled:opacity-40 text-white font-bold text-lg py-4 rounded-2xl transition-colors"
          >
            {compressing ? `Compressing... ${progress}%` : "Compress PDF"}
          </button>

          {compressing && (
            <div className="w-full bg-[#1a1a1a] rounded-full h-1.5">
              <div
                className="bg-[#ff6b35] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {downloadUrl && (
        <div className="text-center space-y-6 py-8">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-4xl mx-auto">✅</div>
          <div>
            <h2 className="text-2xl font-black text-white mb-2">Compression Complete!</h2>
            <p className="text-[#666]">
              {originalSize ? formatSize(originalSize) : "-"} → {compressedSize ? formatSize(compressedSize) : "-"}
              {reductionPercent !== null ? ` · ${reductionPercent}% smaller` : ""}
            </p>
            {note && <p className="text-[#888] text-sm mt-2">{note}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={downloadUrl}
              download="compressed.pdf"
              className="inline-flex items-center justify-center gap-2 bg-[#ff6b35] hover:bg-[#ff5722] text-white font-bold px-8 py-4 rounded-2xl transition-colors text-lg"
            >
              ⬇️ Download PDF
            </a>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] text-white font-semibold px-8 py-4 rounded-2xl transition-colors"
            >
              Compress Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
