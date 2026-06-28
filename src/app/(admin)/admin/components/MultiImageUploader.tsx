"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

type Props = {
  values: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
};

export default function MultiImageUploader({ values, onChange, bucket = "product-images" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(file: File): Promise<string | null> {
    const form = new FormData();
    form.append("file", file);
    form.append("bucket", bucket);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const json = await res.json();
    if (!res.ok) return null;
    return json.url as string;
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    const results = await Promise.all(Array.from(files).map(uploadFile));
    const ok = results.filter(Boolean) as string[];
    const failed = files.length - ok.length;
    if (failed > 0) setError(`${failed} file(s) failed to upload`);
    onChange([...values, ...ok]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {values.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {values.map((url, i) => (
            <div key={url + i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-[#D81B60] text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">
                  Primary
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#D81B60] hover:text-[#D81B60] hover:bg-pink-50 transition-colors disabled:opacity-50 w-full justify-center"
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        {uploading ? "Uploading…" : values.length === 0 ? "Upload Images" : "Add More Images"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
      {values.length > 0 && (
        <p className="text-xs text-gray-400">
          The first image is used as the primary image on product cards. Upload order determines gallery order.
        </p>
      )}
    </div>
  );
}
