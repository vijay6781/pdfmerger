"use client";
import { useState, useCallback } from "react";
import { DropZone } from "@/components/DropZone";
import { PDFDocument } from "pdf-lib";

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: string;
  pages?: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfMergerClient() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((f) =>
      f.type === "application/pdf" || f.name.endsWith(".pdf")
    );

    const mapped: PdfFile[] = await Promise.all(
      pdfFiles.map(async (file) => {
        let pages: number | undefined;
        try {
          const buf = await file.arrayBuffer();
          const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
          pages = doc.getPageCount();
        } catch {}
        return {
          id: Math.random().toString(36).slice(2),
          file,
          name: file.name,
          size: formatSize(file.size),
          pages,
        };
      })
    );

    setFiles((prev) => [...prev, ...mapped]);
    setDone(false);
    setDownloadUrl(null);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setDone(false);
  };

  const moveFile = (fromIdx: number, toIdx: number) => {
    setFiles((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, item);
      return arr;
    });
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setMerging(true);
    setProgress(0);

    try {
      const merged = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        setProgress(Math.round(((i + 1) / files.length) * 90));
        const buf = await files[i].file.arrayBuffer();
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }

      setProgress(95);
      const bytes = await merged.save();
      const blob = new Blob([Uint8Array.from(bytes)], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgress(100);
      setDone(true);
    } catch (err) {
      console.error(err);
      alert("Error merging PDFs. Make sure all files are valid PDFs.");
    } finally {
      setMerging(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setDone(false);
    setDownloadUrl(null);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      {!done && (
        <>
          <DropZone
            onFiles={addFiles}
            accept=".pdf,application/pdf"
            multiple
            label="Drop PDF files here"
            sublabel="Supports multiple PDFs at once"
          />

          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[#888] text-sm">
                  {files.length} file{files.length > 1 ? "s" : ""} — drag to
                  reorder
                </p>
                <button
                  onClick={reset}
                  className="text-xs text-[#555] hover:text-red-400 transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-2">
                {files.map((f, idx) => (
                  <div
                    key={f.id}
                    draggable
                    onDragStart={() => setDragOver(f.id)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragOver && dragOver !== f.id) {
                        const fromIdx = files.findIndex(
                          (x) => x.id === dragOver
                        );
                        moveFile(fromIdx, idx);
                      }
                    }}
                    onDragEnd={() => setDragOver(null)}
                    className="flex items-center gap-3 bg-[#141414] border border-[#222] rounded-xl px-4 py-3 cursor-grab active:cursor-grabbing group hover:border-[#333] transition-all"
                  >
                    <div className="text-[#444] group-hover:text-[#666]">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 6a1 1 0 110-2 1 1 0 010 2zm8 0a1 1 0 110-2 1 1 0 010 2zM8 12a1 1 0 110-2 1 1 0 010 2zm8 0a1 1 0 110-2 1 1 0 010 2zM8 18a1 1 0 110-2 1 1 0 010 2zm8 0a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </div>

                    <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-sm">
                      📄
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {f.name}
                      </p>
                      <p className="text-[#555] text-xs">
                        {f.size}
                        {f.pages ? ` · ${f.pages} page${f.pages > 1 ? "s" : ""}` : ""}
                      </p>
                    </div>

                    <span className="text-[#444] text-xs w-6 text-center">
                      #{idx + 1}
                    </span>

                    <button
                      onClick={() => removeFile(f.id)}
                      className="text-[#444] hover:text-red-400 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Merge Button */}
              <button
                onClick={mergePdfs}
                disabled={files.length < 2 || merging}
                className="w-full bg-[#ff6b35] hover:bg-[#ff5722] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-2xl transition-colors mt-4"
              >
                {merging ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Merging... {progress}%
                  </span>
                ) : (
                  `Merge ${files.length} PDF${files.length > 1 ? "s" : ""}`
                )}
              </button>

              {merging && (
                <div className="w-full bg-[#1a1a1a] rounded-full h-1.5">
                  <div
                    className="bg-[#ff6b35] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {files.length < 2 && (
                <p className="text-center text-[#555] text-sm">
                  Add at least 2 PDF files to merge
                </p>
              )}
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
            <h2 className="text-2xl font-black text-white mb-2">
              Merge Complete!
            </h2>
            <p className="text-[#666]">
              {files.length} PDFs merged into one file.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={downloadUrl}
              download="merged.pdf"
              className="inline-flex items-center justify-center gap-2 bg-[#ff6b35] hover:bg-[#ff5722] text-white font-bold px-8 py-4 rounded-2xl transition-colors text-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Merged PDF
            </a>

            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] text-white font-semibold px-8 py-4 rounded-2xl transition-colors"
            >
              Merge More Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
