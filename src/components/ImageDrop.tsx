/* eslint-disable @next/next/no-img-element -- aperçu local (data URL) */
"use client";

import { useRef, useState } from "react";

interface ImageDropProps {
  label: string;
  hint: string;
  preview: string | null;
  onFile: (file: File) => void;
  onClear: () => void;
}

/** Zone de dépôt : clic, glisser-déposer ou coller (Ctrl/Cmd + V). */
export function ImageDrop({ label, hint, preview, onFile, onClear }: ImageDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = (files: FileList | null | undefined) => {
    const file = files && Array.from(files).find((f) => f.type.startsWith("image/"));
    if (file) onFile(file);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      {preview ? (
        <div className="relative overflow-hidden rounded-3xl border border-border">
          <img src={preview} alt={label} className="max-h-80 w-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-sm text-white hover:bg-black/80"
          >
            Changer
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && inputRef.current?.click()}
          onPaste={(event) => pick(event.clipboardData.files)}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            pick(event.dataTransfer.files);
          }}
          className={`flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed px-6 text-center transition ${
            dragging ? "border-accent bg-accent-soft" : "border-border bg-surface hover:border-accent"
          }`}
        >
          <span className="text-3xl" aria-hidden>
            ⇪
          </span>
          <span className="font-medium">Déposer une image</span>
          <span className="text-xs text-muted">{hint}</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          pick(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}
