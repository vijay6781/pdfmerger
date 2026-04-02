"use client";
import { useRef, useState, DragEvent, ChangeEvent } from "react";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  sublabel?: string;
}

export function DropZone({
  onFiles,
  accept = "*/*",
  multiple = false,
  label = "Drop your file here",
  sublabel = "or click to browse",
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFiles(files);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
        transition-all duration-200
        ${dragging
          ? "border-[#ff6b35] bg-[#ff6b35]/5 dropzone-active"
          : "border-[#2a2a2a] bg-[#141414] hover:border-[#ff6b35]/40 hover:bg-[#1a1a1a]"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />

      <div className="flex flex-col items-center gap-3">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all ${dragging ? "bg-[#ff6b35]/20 scale-110" : "bg-[#1f1f1f]"}`}>
          {dragging ? "📂" : "📁"}
        </div>
        <div>
          <p className="text-white font-semibold text-lg">{label}</p>
          <p className="text-[#555] text-sm mt-1">{sublabel}</p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-px w-16 bg-[#2a2a2a]" />
          <span className="text-[#444] text-xs">or</span>
          <div className="h-px w-16 bg-[#2a2a2a]" />
        </div>
        <button
          type="button"
          className="bg-[#ff6b35] hover:bg-[#ff5722] text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
        >
          Choose File{multiple ? "s" : ""}
        </button>
      </div>
    </div>
  );
}
