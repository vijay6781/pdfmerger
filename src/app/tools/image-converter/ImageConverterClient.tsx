"use client";
import { useState, useRef } from "react";
import { DropZone } from "@/components/DropZone";

type Format = "image/jpeg" | "image/png" | "image/webp";

const FORMAT_LABELS: Record<Format, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WEBP",
};

export function ImageConverterClient() {
  const [original, setOriginal] = useState<{
    file: File;
    url: string;
    name: string;
    size: string;
  } | null>(null);
  const [outputFormat, setOutputFormat] = useState<Format>("image/jpeg");
  const [quality, setQuality] = useState(98);
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string; size: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOriginal({
      file,
      url,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    });
    setResult(null);
  };

  const convert = () => {
    if (!original || !canvasRef.current) return;
    setConverting(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      if (outputFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const ext = FORMAT_LABELS[outputFormat].toLowerCase();
          const baseName = original.name.replace(/\.[^.]+$/, "");
          setResult({
            url,
            name: `${baseName}.${ext}`,
            size: `${(blob.size / 1024).toFixed(1)} KB`,
          });
          setConverting(false);
        },
        outputFormat,
        outputFormat === "image/png" ? undefined : quality / 100
      );
    };
    img.src = original.url;
  };

  const reset = () => {
    setOriginal(null);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {!original && (
        <DropZone
          onFiles={handleFile}
          accept="image/*"
          label="Drop your image here"
          sublabel="JPG, PNG, WEBP supported"
        />
      )}

      {original && !result && (
        <div className="space-y-5">
          {/* Preview */}
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-4 flex items-center gap-4">
            <img
              src={original.url}
              alt="preview"
              className="w-16 h-16 object-cover rounded-xl border border-[#2a2a2a]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{original.name}</p>
              <p className="text-[#555] text-sm">{original.size}</p>
            </div>
            <button onClick={reset} className="text-[#444] hover:text-red-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Output Format */}
          <div>
            <label className="text-[#888] text-sm font-medium block mb-3">
              Convert to
            </label>
            <div className="flex gap-3">
              {(Object.keys(FORMAT_LABELS) as Format[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOutputFormat(fmt)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${
                    outputFormat === fmt
                      ? "bg-[#ff6b35] border-[#ff6b35] text-white"
                      : "bg-[#141414] border-[#222] text-[#666] hover:border-[#444] hover:text-white"
                  }`}
                >
                  {FORMAT_LABELS[fmt]}
                </button>
              ))}
            </div>
          </div>

          {/* Quality (for JPG/WEBP) */}
          {outputFormat !== "image/png" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#888] text-sm font-medium">
                  Quality
                </label>
                <span className="text-[#ff6b35] font-bold text-sm">{quality}%</span>
              </div>
              <input
                type="range"
                min={80}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[#ff6b35]"
              />
              <div className="flex justify-between text-xs text-[#444] mt-1">
                <span>Smaller file</span>
                <span>Best quality</span>
              </div>
              {outputFormat === "image/jpeg" && (
                <p className="text-[#666] text-xs mt-2">
                  For PNG to JPG, keep quality at 98-100 for sharp output.
                </p>
              )}
            </div>
          )}

          <button
            onClick={convert}
            disabled={converting}
            className="w-full bg-[#ff6b35] hover:bg-[#ff5722] disabled:opacity-40 text-white font-bold text-lg py-4 rounded-2xl transition-colors"
          >
            {converting ? "Converting..." : `Convert to ${FORMAT_LABELS[outputFormat]}`}
          </button>
        </div>
      )}

      {result && (
        <div className="text-center space-y-6 py-8">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-4xl mx-auto">✅</div>
          <div>
            <h2 className="text-2xl font-black text-white mb-1">Conversion Done!</h2>
            <p className="text-[#666]">
              {original?.size} → {result.size} · {FORMAT_LABELS[outputFormat]}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={result.url}
              download={result.name}
              className="inline-flex items-center justify-center gap-2 bg-[#ff6b35] hover:bg-[#ff5722] text-white font-bold px-8 py-4 rounded-2xl transition-colors text-lg"
            >
              ⬇️ Download {FORMAT_LABELS[outputFormat]}
            </a>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] text-white font-semibold px-8 py-4 rounded-2xl transition-colors"
            >
              Convert Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
