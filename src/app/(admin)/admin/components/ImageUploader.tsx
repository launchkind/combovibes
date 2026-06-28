"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

type Props = {
  value?: string | null;
  onChange: (url: string) => void;
  onClear?: () => void;
  bucket?: string;
  label?: string;
  hint?: string;
};

export default function ImageUploader({
  value,
  onChange,
  onClear,
  bucket = "product-images",
  label = "Upload Image",
  hint = "JPG, PNG, WebP — max 10MB",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    form.append("bucket", bucket);

    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const json = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(json.error ?? "Upload failed");
      return;
    }
    onChange(json.url);
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    upload(files[0]);
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group w-full aspect-video max-w-sm rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={() => { onClear ? onClear() : onChange(""); }}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          className={`w-full max-w-sm aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
            dragging ? "border-[#D81B60] bg-pink-50" : "border-gray-300 hover:border-[#D81B60] hover:bg-pink-50"
          }`}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-[#D81B60] animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">{label}</p>
              <p className="text-xs text-gray-400">{hint}</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
