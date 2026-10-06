"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BoardItemCard } from "@/components/BoardItemView";
import { Visual } from "@/components/Visual";
import { INSPIRATIONS_BY_ID, PRODUCTS_BY_ID } from "@/lib/catalog";
import { compressImage } from "@/lib/image";
import { useHestia, useHydrated } from "@/lib/store";

const NOTE_COLORS = ["#f6e2d8", "#e8eedf", "#f7ecc9", "#e3e8f2", "#efe3f0"];

export function BoardClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const hydrated = useHydrated();
  const board = useHestia((s) => s.boards.find((b) => b.id === id));
  const { addToBoard, removeFromBoard, renameBoard, deleteBoard } = useHestia.getState();
  const likedProducts = useHestia((s) => s.likedProducts);
  const likedInspirations = useHestia((s) => s.likedInspirations);

  const [panel, setPanel] = useState<"none" | "note" | "favorites" | "edit">("none");
  const [noteText, setNoteText] = useState("");
  const [noteColor, setNoteColor] = useState(NOTE_COLORS[0]);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-3xl bg-surface-muted" />;
  }
  if (!board) {
    return (
      <div className="space-y-4 py-16 text-center">
        <p className="font-heading text-2xl font-semibold">Ce tableau n&apos;existe pas (ou plus).</p>
        <Link href="/tableaux" className="btn-ghost">
          ← Retour aux tableaux
        </Link>
      </div>
    );
  }

  const uploadImages = async (files: FileList | null) => {
    setUploadError(null);
    for (const file of Array.from(files ?? [])) {
      try {
        const image = await compressImage(file, 900, 0.8);
        addToBoard(board.id, { kind: "image", src: image.dataUrl });
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Image illisible.");
      }
    }
  };

  const pinned = new Set(
    board.items.map((item) =>
      item.kind === "product" ? item.productId : item.kind === "inspiration" ? item.inspirationId : "",
    ),
  );

  return (
    <div className="space-y-8">
      <Link href="/tableaux" className="text-sm text-muted hover:text-foreground">
        ← Tous les tableaux
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-5xl md:text-6xl">{board.name}</h1>
          {board.description && <p className="text-muted">{board.description}</p>}
          <p className="text-sm text-muted">
            {board.items.length} idée{board.items.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={() => fileRef.current?.click()}>
            + Photo
          </button>
          <button className="btn-ghost" onClick={() => setPanel(panel === "note" ? "none" : "note")}>
            + Note
          </button>
          <button className="btn-ghost" onClick={() => setPanel(panel === "favorites" ? "none" : "favorites")}>
            + Coups de cœur
          </button>
          <button
            className="btn-ghost"
            onClick={() => {
              setEditName(board.name);
              setEditDescription(board.description ?? "");
              setPanel(panel === "edit" ? "none" : "edit");
            }}
          >
            Modifier
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            void uploadImages(event.target.files);
            event.target.value = "";
          }}
        />
      </header>

      {uploadError && <p role="alert" className="text-sm text-nope">{uploadError}</p>}

      {panel === "note" && (
        <form
          className="card space-y-3 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (!noteText.trim()) return;
            addToBoard(board.id, { kind: "note", text: noteText.trim(), color: noteColor });
            setNoteText("");
            setPanel("none");
          }}
        >
          <textarea
            autoFocus
            rows={3}
            maxLength={500}
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            placeholder="Une idée, une mesure, une couleur de peinture…"
            className="input resize-none"
            style={{ background: noteColor, color: "#2b2420" }}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {NOTE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNoteColor(color)}
                  aria-label={`Couleur ${color}`}
                  className={`h-7 w-7 rounded-full border-2 ${noteColor === color ? "border-accent" : "border-border"}`}
                  style={{ background: color }}
                />
              ))}
            </div>
            <button className="btn-primary" disabled={!noteText.trim()}>
              Épingler la note
            </button>
          </div>
        </form>
      )}

      {panel === "favorites" && (
        <div className="card space-y-3 p-5">
          <p className="text-sm text-muted">
            Vos coups de cœur du swipe. Cliquez pour les épingler ici.{" "}
            <Link href="/swipe" className="text-accent underline">
              Swiper davantage
            </Link>
          </p>
          {likedInspirations.length + likedProducts.length === 0 ? (
            <p className="text-sm">Aucun coup de cœur pour l&apos;instant.</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {likedInspirations.map((inspirationId) => {
                const inspiration = INSPIRATIONS_BY_ID[inspirationId];
                if (!inspiration) return null;
                return (
                  <PickTile
                    key={inspirationId}
                    label={inspiration.title}
                    pinned={pinned.has(inspirationId)}
                    onPick={() => addToBoard(board.id, { kind: "inspiration", inspirationId })}
                  >
                    <Visual palette={inspiration.palette} seed={inspiration.id} image={inspiration.image} alt="" />
                  </PickTile>
                );
              })}
              {likedProducts.map((productId) => {
                const product = PRODUCTS_BY_ID[productId];
                if (!product) return null;
                return (
                  <PickTile
                    key={productId}
                    label={product.name}
                    pinned={pinned.has(productId)}
                    onPick={() => addToBoard(board.id, { kind: "product", productId })}
                  >
                    <Visual palette={product.palette} seed={product.id} category={product.category} image={product.image} alt="" />
                  </PickTile>
                );
              })}
            </div>
          )}
        </div>
      )}

      {panel === "edit" && (
        <form
          className="card grid gap-3 p-5 md:grid-cols-[1fr_1.4fr_auto_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            if (!editName.trim()) return;
            renameBoard(board.id, editName.trim(), editDescription.trim() || undefined);
            setPanel("none");
          }}
        >
          <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)} maxLength={60} aria-label="Nom" />
          <input className="input" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} maxLength={140} placeholder="Description" aria-label="Description" />
          <button className="btn-primary" disabled={!editName.trim()}>
            Enregistrer
          </button>
          <button
            type="button"
            className="btn border border-nope/40 text-nope hover:bg-nope/10"
            onClick={() => {
              if (window.confirm(`Supprimer le tableau « ${board.name} » et ses ${board.items.length} idées ?`)) {
                deleteBoard(board.id);
                router.push("/tableaux");
              }
            }}
          >
            Supprimer
          </button>
        </form>
      )}

      {board.items.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border px-6 py-16 text-center text-muted">
          Ce tableau est vide. Ajoutez des photos, des notes ou vos coups de cœur, ou enregistrez-y des dupes depuis
          l&apos;outil IA.
        </div>
      ) : (
        <div className="masonry">
          {board.items.map((item) => (
            <div key={item.id} className="group relative">
              <BoardItemCard item={item} />
              <button
                onClick={() => removeFromBoard(board.id, item.id)}
                aria-label="Retirer du tableau"
                className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white opacity-100 transition md:opacity-0 md:group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PickTile({
  label,
  pinned,
  onPick,
  children,
}: {
  label: string;
  pinned: boolean;
  onPick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onPick} disabled={pinned} className="w-28 shrink-0 space-y-1 text-left disabled:opacity-50" title={label}>
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        {children}
        {pinned && <span className="absolute inset-0 grid place-items-center bg-black/40 text-sm font-medium text-white">Épinglé</span>}
      </div>
      <p className="line-clamp-2 text-xs">{label}</p>
    </button>
  );
}
