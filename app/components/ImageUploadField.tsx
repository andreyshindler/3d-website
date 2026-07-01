"use client";

import { useRef, useState } from "react";

export function ImageUploadField({
  defaultValue = "",
  uploadLabel,
  errorMsg,
}: {
  defaultValue?: string;
  uploadLabel: string;
  errorMsg?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [preview, setPreview] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function applyUrl(value: string) {
    setUrl(value);
    setPreview(value);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        applyUrl(data.url);
      } else {
        setUploadError(data.error ?? "Upload failed");
      }
    } catch {
      setUploadError("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name="imageUrl" value={url} />

      {preview && (
        <div className="relative w-full h-44 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
            onError={() => setPreview("")}
          />
          <button
            type="button"
            onClick={() => applyUrl("")}
            className="absolute top-1 end-1 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs leading-none border border-gray-300 transition-colors"
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex gap-2 items-stretch">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          ref={fileRef}
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm rounded border border-indigo-200 transition-colors disabled:opacity-50 font-medium whitespace-nowrap"
        >
          {uploading ? "…" : `📷 ${uploadLabel}`}
        </button>

        <input
          type="text"
          value={url}
          onChange={(e) => applyUrl(e.target.value)}
          placeholder="https://…"
          className={`flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errorMsg ? "border-red-400" : "border-gray-300"
          }`}
        />
      </div>

      {uploadError && (
        <p className="text-red-500 text-xs">{uploadError}</p>
      )}
      {errorMsg && (
        <p className="text-red-500 text-xs mt-1">{errorMsg}</p>
      )}
    </div>
  );
}
