"use client";

import type { QuizResult } from "./quiz";
import { COLORS_BY_HEX } from "./colors";
import { MATERIALS_BY_ID } from "./materials";
import { STYLES_BY_ID } from "./styles";

/*
 * Image « story » (1080 × 1920) du résultat du questionnaire, dessinée dans un canvas
 * pour être partagée sur Instagram, TikTok, WhatsApp… ou simplement enregistrée.
 */

const W = 1080;
const H = 1920;
const INK = "#2b2420";

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export async function renderStory(result: QuizResult): Promise<Blob> {
  // Poppins doit être chargée avant de dessiner, sinon le canvas prend une police par défaut.
  await Promise.all(["800 120px Poppins", "700 48px Poppins", "600 40px Poppins", "500 34px Poppins", "800 52px Poppins"].map((f) => document.fonts.load(f)));
  const style = STYLES_BY_ID[result.styleId];
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Fond : dégradé de marque, voile clair en bas pour la lisibilité.
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#e0503a");
  bg.addColorStop(0.5, "#ee5d78");
  bg.addColorStop(1, "#f6a33c");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = "#ffffff";
  for (const [x, y, r] of [[930, 220, 260], [120, 1500, 340], [980, 1300, 140]]) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // En-tête
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 40px Poppins";
  ctx.fillText("HESTIA", 90, 150);
  ctx.font = "500 34px Poppins";
  ctx.fillText("Mon projet déco", 90, 270);

  // Style dominant
  ctx.font = "800 128px Poppins";
  const nameLines = wrap(ctx, style.name, W - 180);
  let y = 410;
  for (const line of nameLines) {
    ctx.fillText(line, 90, y);
    y += 132;
  }
  ctx.font = "700 42px Poppins";
  ctx.fillText(`${Math.round(result.match * 100)} % de compatibilité`, 90, y + 6);
  ctx.font = "500 36px Poppins";
  y += 58;
  for (const line of wrap(ctx, style.tagline, W - 180).slice(0, 2)) {
    ctx.fillText(line, 90, y);
    y += 46;
  }
  const meta = [result.room, result.budget ? `≈ ${result.budget.toLocaleString("fr-FR")} €` : null].filter(Boolean).join("  ·  ");
  if (meta) {
    ctx.font = "600 30px Poppins";
    const w = ctx.measureText(meta).width + 52;
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    roundRect(ctx, 90, y - 6, w, 58, 29);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(meta, 116, y + 33);
    y += 70;
  }

  // Carte blanche, à la hauteur de son contenu.
  const swatch = 118;
  ctx.font = "500 34px Poppins";
  const pieceLines = result.pieces.slice(0, 4).map((piece) => wrap(ctx, piece, W - 300).slice(0, 2));
  const piecesHeight = pieceLines.reduce((sum, lines) => sum + lines.length * 46 + 14, 0);
  const contentH = 100 + 34 + swatch + 140 + 34 + piecesHeight + 30 + 34 + 64 + 70;
  const cardY = y + 40;
  const cardH = Math.min(contentH, H - cardY - 200);
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 60, cardY, W - 120, cardH, 56);
  ctx.fill();

  let cy = cardY + 100;
  const section = (title: string) => {
    ctx.fillStyle = "#e0503a";
    ctx.font = "700 30px Poppins";
    ctx.fillText(title.toUpperCase(), 120, cy);
    cy += 34;
  };

  section("Ma palette");
  result.palette.slice(0, 5).forEach((hex, i) => {
    const x = 120 + i * (swatch + 54);
    ctx.fillStyle = hex;
    ctx.beginPath();
    ctx.arc(x + swatch / 2, cy + swatch / 2 + 10, swatch / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.font = "500 24px Poppins";
    const name = COLORS_BY_HEX[hex.toLowerCase()]?.name ?? hex.toUpperCase();
    const label = wrap(ctx, name, swatch + 40)[0];
    ctx.fillText(label, x + swatch / 2 - ctx.measureText(label).width / 2, cy + swatch + 60);
  });
  cy += swatch + 140;

  section("Mes incontournables");
  ctx.fillStyle = INK;
  ctx.font = "500 34px Poppins";
  for (const lines of pieceLines) {
    ctx.fillStyle = "#ee5d78";
    ctx.beginPath();
    ctx.arc(136, cy + 14, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = INK;
    for (const line of lines.slice(0, 2)) {
      ctx.fillText(line, 168, cy + 26);
      cy += 46;
    }
    cy += 14;
  }
  cy += 30;

  section("Mes matières");
  let mx = 120;
  ctx.font = "600 30px Poppins";
  for (const id of result.materials.slice(0, 4)) {
    const name = MATERIALS_BY_ID[id]?.name ?? id;
    const w = ctx.measureText(name).width + 56;
    if (mx + w > W - 120) break;
    ctx.fillStyle = "#f4f2f1";
    roundRect(ctx, mx, cy, w, 64, 32);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.fillText(name, mx + 28, cy + 43);
    mx += w + 16;
  }

  // Pied : centré dans l'espace restant sous la carte.
  const footerY = Math.min(H - 120, (cardY + cardH + H) / 2 - 10);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 52px Poppins";
  const cta = "Et vous, quel est votre style ?";
  ctx.fillText(cta, W / 2 - ctx.measureText(cta).width / 2, footerY);
  ctx.font = "500 34px Poppins";
  const sub = "Faites le test sur Hestia";
  ctx.fillText(sub, W / 2 - ctx.measureText(sub).width / 2, footerY + 58);

  return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("canvas"))), "image/png"));
}

/** Partage natif (mobile) si possible, sinon téléchargement de l'image. */
export async function shareStory(blob: Blob, styleName: string): Promise<"shared" | "downloaded" | "cancelled"> {
  const file = new File([blob], `hestia-mon-style-${styleName.toLowerCase().replace(/\s+/g, "-")}.png`, { type: "image/png" });
  const data = { files: [file], title: "Mon projet déco", text: `Mon style déco : ${styleName}. Et vous ? Faites le test sur Hestia.` };
  if (typeof navigator !== "undefined" && navigator.canShare?.(data)) {
    try {
      await navigator.share(data);
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return "downloaded";
}
