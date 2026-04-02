"use client";
import { useState } from "react";
import Link from "next/link";

interface PortalSpec {
  name: string;
  shortName: string;
  photo: {
    width: string;
    height: string;
    format: string;
    minSize: string;
    maxSize: string;
    background: string;
    notes: string[];
  };
  signature?: {
    width: string;
    height: string;
    format: string;
    maxSize: string;
    notes: string[];
  };
}

const PORTALS: PortalSpec[] = [
  {
    name: "UPSC Civil Services",
    shortName: "UPSC",
    photo: {
      width: "3.5 cm",
      height: "4.5 cm",
      format: "JPG / JPEG",
      minSize: "20 KB",
      maxSize: "300 KB",
      background: "White",
      notes: [
        "Face must cover 70–80% of the frame",
        "No cap or hat (except religious headwear)",
        "Glasses allowed",
        "Taken within last 6 months",
      ],
    },
    signature: {
      width: "3.5 cm",
      height: "1.5 cm",
      format: "JPG / JPEG",
      maxSize: "300 KB",
      notes: ["Black ink on white paper", "Scan or photograph the signature"],
    },
  },
  {
    name: "SSC CGL / CHSL / MTS",
    shortName: "SSC CGL",
    photo: {
      width: "4 cm",
      height: "5 cm",
      format: "JPG / JPEG",
      minSize: "20 KB",
      maxSize: "50 KB",
      background: "White",
      notes: [
        "Light-coloured background acceptable",
        "Both ears must be visible",
        "No spectacles",
        "Recent photo (within 3 months)",
      ],
    },
    signature: {
      width: "4 cm",
      height: "2 cm",
      format: "JPG / JPEG",
      maxSize: "20 KB",
      notes: ["Candidate's own signature only", "No initials, full signature required"],
    },
  },
  {
    name: "Railway (RRB / NTPC)",
    shortName: "Railway",
    photo: {
      width: "3.5 cm",
      height: "4.5 cm",
      format: "JPG",
      minSize: "15 KB",
      maxSize: "40 KB",
      background: "White / Light",
      notes: [
        "No caps or sunglasses",
        "Frontal pose, both eyes open",
        "Name and date on back if printed",
      ],
    },
    signature: {
      width: "3.5 cm",
      height: "1.5 cm",
      format: "JPG",
      maxSize: "30 KB",
      notes: ["Sign on white paper with blue/black ink"],
    },
  },
  {
    name: "UIDAI / Aadhaar Enrollment",
    shortName: "UIDAI",
    photo: {
      width: "35 mm",
      height: "45 mm",
      format: "JPG / JPEG",
      minSize: "10 KB",
      maxSize: "100 KB",
      background: "White",
      notes: [
        "Both ears visible",
        "No flash glare on glasses",
        "Neutral expression",
        "Taken at enrollment centre (usually)",
      ],
    },
  },
  {
    name: "NPS (National Pension System)",
    shortName: "NPS",
    photo: {
      width: "3.5 cm",
      height: "4.5 cm",
      format: "JPG",
      minSize: "4 KB",
      maxSize: "12 KB",
      background: "White",
      notes: ["Colour photo mandatory", "Plain white background only"],
    },
    signature: {
      width: "Not specified",
      height: "Not specified",
      format: "JPG",
      maxSize: "12 KB",
      notes: ["Black ink preferred"],
    },
  },
  {
    name: "Bank KYC (SBI / HDFC / ICICI)",
    shortName: "Bank KYC",
    photo: {
      width: "3.5 cm",
      height: "4.5 cm",
      format: "JPG / PDF",
      minSize: "10 KB",
      maxSize: "500 KB",
      background: "White / Light",
      notes: [
        "Same specs as passport photo",
        "Clear face, no sunglasses",
        "Recent (within 6 months)",
      ],
    },
  },
];

export function PortalCheckerClient() {
  const [selected, setSelected] = useState<PortalSpec | null>(null);

  return (
    <div className="space-y-6">
      {/* Portal Selector */}
      <div>
        <label className="text-[#888] text-sm font-medium block mb-3">
          Select your portal
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PORTALS.map((portal) => (
            <button
              key={portal.shortName}
              onClick={() => setSelected(portal)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selected?.shortName === portal.shortName
                  ? "bg-[#ff6b35]/10 border-[#ff6b35] text-white"
                  : "bg-[#141414] border-[#222] text-[#888] hover:border-[#444] hover:text-white"
              }`}
            >
              <div className="font-bold text-sm">{portal.shortName}</div>
              <div className="text-xs mt-0.5 opacity-60 truncate">{portal.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Spec Cards */}
      {selected && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="text-white font-black text-xl">
            {selected.name} Requirements
          </h2>

          {/* Photo Spec */}
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📸</span>
              <h3 className="text-white font-bold">Photograph</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {[
                { label: "Width", value: selected.photo.width },
                { label: "Height", value: selected.photo.height },
                { label: "Format", value: selected.photo.format },
                { label: "Min Size", value: selected.photo.minSize },
                { label: "Max Size", value: selected.photo.maxSize },
                { label: "Background", value: selected.photo.background },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#1a1a1a] rounded-xl px-3 py-2">
                  <div className="text-[#555] text-xs">{label}</div>
                  <div className="text-white font-semibold text-sm mt-0.5">{value}</div>
                </div>
              ))}
            </div>

            {selected.photo.notes.length > 0 && (
              <div className="border-t border-[#222] pt-4">
                <p className="text-[#666] text-xs font-semibold uppercase tracking-wider mb-2">
                  Important Notes
                </p>
                <ul className="space-y-1.5">
                  {selected.photo.notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#888]">
                      <span className="text-[#ff6b35] mt-0.5">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Signature Spec */}
          {selected.signature && (
            <div className="bg-[#141414] border border-[#222] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">✍️</span>
                <h3 className="text-white font-bold">Signature</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Width", value: selected.signature.width },
                  { label: "Height", value: selected.signature.height },
                  { label: "Format", value: selected.signature.format },
                  { label: "Max Size", value: selected.signature.maxSize },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#1a1a1a] rounded-xl px-3 py-2">
                    <div className="text-[#555] text-xs">{label}</div>
                    <div className="text-white font-semibold text-sm mt-0.5">{value}</div>
                  </div>
                ))}
              </div>

              {selected.signature.notes.length > 0 && (
                <div className="border-t border-[#222] pt-4">
                  <ul className="space-y-1.5">
                    {selected.signature.notes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#888]">
                        <span className="text-[#ff6b35] mt-0.5">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Quick Action */}
          <div className="bg-[#ff6b35]/5 border border-[#ff6b35]/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-2xl">⚡</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">
                Need to resize your photo for {selected.shortName}?
              </p>
              <p className="text-[#666] text-xs mt-0.5">
                Use our Passport Photo Maker — it auto-resizes to exact requirements.
              </p>
            </div>
            <Link
              href="/tools/passport-photo"
              className="bg-[#ff6b35] hover:bg-[#ff5722] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
            >
              Make Photo →
            </Link>
          </div>
        </div>
      )}

      {!selected && (
        <div className="text-center py-10 text-[#444]">
          <div className="text-5xl mb-3">🏛️</div>
          <p>Select a portal above to see exact requirements</p>
        </div>
      )}
    </div>
  );
}
