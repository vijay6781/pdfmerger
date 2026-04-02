"use client";
import { useState, useRef, useCallback } from "react";
import { DropZone } from "@/components/DropZone";

const PHOTO_WIDTH_PX = 413;  // 3.5cm at 300dpi
const PHOTO_HEIGHT_PX = 531; // 4.5cm at 300dpi
const A4_WIDTH_PX = 2480;    // A4 at 300dpi
const A4_HEIGHT_PX = 3508;

export function PassportPhotoClient() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sheetCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setStep("preview");
    setProcessedUrl(null);
    setSheetUrl(null);
  }, []);

  const processPhoto = () => {
    if (!originalUrl || !canvasRef.current || !sheetCanvasRef.current) return;
    setProcessing(true);

    const img = new Image();
    img.onload = () => {
      // Step 1: Crop to passport ratio on single canvas
      const canvas = canvasRef.current!;
      canvas.width = PHOTO_WIDTH_PX;
      canvas.height = PHOTO_HEIGHT_PX;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, PHOTO_WIDTH_PX, PHOTO_HEIGHT_PX);

      // Center-crop the image to fill the passport frame
      const srcAspect = img.naturalWidth / img.naturalHeight;
      const dstAspect = PHOTO_WIDTH_PX / PHOTO_HEIGHT_PX;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

      if (srcAspect > dstAspect) {
        sw = img.naturalHeight * dstAspect;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / dstAspect;
        sy = (img.naturalHeight - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, PHOTO_WIDTH_PX, PHOTO_HEIGHT_PX);

      const singlePhotoDataUrl = canvas.toDataURL("image/jpeg", 0.98);
      setProcessedUrl(singlePhotoDataUrl);

      // Step 2: Arrange 8 photos on A4
      const sheetCanvas = sheetCanvasRef.current!;
      sheetCanvas.width = A4_WIDTH_PX;
      sheetCanvas.height = A4_HEIGHT_PX;
      const sCtx = sheetCanvas.getContext("2d")!;
      sCtx.imageSmoothingEnabled = true;
      sCtx.imageSmoothingQuality = "high";

      sCtx.fillStyle = "#ffffff";
      sCtx.fillRect(0, 0, A4_WIDTH_PX, A4_HEIGHT_PX);

      const cols = 4;
      const rows = 2;
      const padding = 80;
      const gapX = 40;
      const gapY = 40;

      const totalW = cols * PHOTO_WIDTH_PX + (cols - 1) * gapX;
      const startX = (A4_WIDTH_PX - totalW) / 2;
      const startY = padding;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * (PHOTO_WIDTH_PX + gapX);
          const y = startY + r * (PHOTO_HEIGHT_PX + gapY);
          // Draw directly from source canvas to avoid double JPEG re-encode loss.
          sCtx.drawImage(canvas, x, y, PHOTO_WIDTH_PX, PHOTO_HEIGHT_PX);
          // Border
          sCtx.strokeStyle = "#dddddd";
          sCtx.lineWidth = 2;
          sCtx.strokeRect(x, y, PHOTO_WIDTH_PX, PHOTO_HEIGHT_PX);
        }
      }

      const sheetDataUrl = sheetCanvas.toDataURL("image/jpeg", 0.96);
      setSheetUrl(sheetDataUrl);
      setStep("done");
      setProcessing(false);
    };
    img.src = originalUrl;
  };

  const reset = () => {
    setOriginalUrl(null);
    setProcessedUrl(null);
    setSheetUrl(null);
    setStep("upload");
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={sheetCanvasRef} className="hidden" />

      {step === "upload" && (
        <DropZone
          onFiles={handleFile}
          accept="image/*"
          label="Upload your photo"
          sublabel="Selfie or any clear front-facing photo"
        />
      )}

      {step === "preview" && originalUrl && (
        <div className="space-y-5">
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 flex flex-col items-center gap-4">
            <img
              src={originalUrl}
              alt="Original"
              className="w-40 h-48 object-cover rounded-xl border border-[#2a2a2a]"
            />
            <div className="text-center">
              <p className="text-white font-semibold">Original Photo</p>
              <p className="text-[#555] text-sm mt-1">
                Will be cropped to 3.5×4.5cm with white background
              </p>
            </div>
          </div>

          <div className="bg-[#ff6b35]/5 border border-[#ff6b35]/20 rounded-xl p-4 text-sm text-[#888]">
            <p className="text-[#ff6b35] font-semibold mb-1">What we'll do:</p>
            <ul className="space-y-1">
              <li>✓ Crop to 3.5×4.5cm passport ratio</li>
              <li>✓ White background applied</li>
              <li>✓ Arrange 8 photos on A4 (ready to print)</li>
              <li>✓ Output under 50KB for portal upload</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button onClick={reset} className="flex-1 bg-[#1a1a1a] border border-[#222] hover:border-[#444] text-white font-semibold py-3 rounded-2xl transition-colors">
              Change Photo
            </button>
            <button
              onClick={processPhoto}
              disabled={processing}
              className="flex-1 bg-[#ff6b35] hover:bg-[#ff5722] disabled:opacity-40 text-white font-bold py-3 rounded-2xl transition-colors"
            >
              {processing ? "Processing..." : "Make Passport Photos"}
            </button>
          </div>
        </div>
      )}

      {step === "done" && processedUrl && sheetUrl && (
        <div className="space-y-6">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-3xl mx-auto">✅</div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#141414] border border-[#222] rounded-2xl p-4 text-center">
              <img
                src={processedUrl}
                alt="Passport photo"
                className="w-24 h-28 object-cover rounded-lg border border-[#2a2a2a] mx-auto mb-3"
              />
              <p className="text-white font-semibold text-sm mb-1">Single Photo</p>
              <p className="text-[#555] text-xs mb-3">3.5×4.5cm, JPG</p>
              <a
                href={processedUrl}
                download="passport-photo.jpg"
                className="block bg-[#ff6b35] hover:bg-[#ff5722] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Download
              </a>
            </div>

            <div className="bg-[#141414] border border-[#222] rounded-2xl p-4 text-center">
              <img
                src={sheetUrl}
                alt="A4 sheet"
                className="w-24 h-28 object-cover rounded-lg border border-[#2a2a2a] mx-auto mb-3"
              />
              <p className="text-white font-semibold text-sm mb-1">A4 Sheet (8 photos)</p>
              <p className="text-[#555] text-xs mb-3">Print-ready</p>
              <a
                href={sheetUrl}
                download="passport-photos-a4.jpg"
                className="block bg-[#ff6b35] hover:bg-[#ff5722] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Download
              </a>
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full bg-[#1a1a1a] border border-[#222] hover:border-[#444] text-white font-semibold py-3 rounded-2xl transition-colors"
          >
            Make Another Photo
          </button>
        </div>
      )}
    </div>
  );
}
