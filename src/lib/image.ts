"use client";

export interface CompressedImage {
  /** data:image/jpeg;base64,... prête à afficher ou stocker. */
  dataUrl: string;
  mediaType: "image/jpeg";
  /** Base64 brut, sans le préfixe data:, pour l'API. */
  base64: string;
}

/**
 * Redimensionne et recompresse une image côté navigateur. 1568 px est la
 * taille utile maximale pour l'analyse d'image par Claude ; au-delà, on
 * n'envoie que du poids inutile.
 */
export async function compressImage(
  file: Blob,
  maxSize = 1568,
  quality = 0.85,
): Promise<CompressedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Ce fichier n'est pas une image.");
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Impossible de traiter l'image.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  return { dataUrl, mediaType: "image/jpeg", base64: dataUrl.slice(dataUrl.indexOf(",") + 1) };
}
