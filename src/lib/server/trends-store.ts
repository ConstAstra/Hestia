import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { Trend } from "../trends";
import type { TrendSource } from "../trends-schema";

/*
 * Stockage de la dernière veille des tendances : un fichier JSON (survit aux
 * redémarrages sur un serveur classique ou un conteneur avec volume), doublé
 * d'une copie en mémoire. Sur un hébergement serverless, le disque est éphémère :
 * brancher un stockage clé-valeur (Vercel KV, Upstash, Redis) à la place — voir README.
 */

export interface StoredTrends {
  updatedAt: string;
  trends: Trend[];
  sources: TrendSource[];
}

// Fichier écrit à l'exécution : exclu du traçage des fichiers par le bundler (turbopackIgnore).
const primaryPath = process.env.TRENDS_STORE_PATH ?? path.join(/*turbopackIgnore: true*/ process.cwd(), ".data", "trends.json");
const fallbackPath = path.join(os.tmpdir(), "hestia-trends.json");

let memory: StoredTrends | null = null;

export async function readStoredTrends(): Promise<StoredTrends | null> {
  if (memory) return memory;
  for (const file of [primaryPath, fallbackPath]) {
    try {
      memory = JSON.parse(await readFile(/*turbopackIgnore: true*/ file, "utf8")) as StoredTrends;
      return memory;
    } catch {
      /* fichier absent ou illisible : on essaie le suivant */
    }
  }
  return null;
}

export async function writeStoredTrends(value: StoredTrends): Promise<void> {
  memory = value;
  const data = JSON.stringify(value, null, 2);
  for (const file of [primaryPath, fallbackPath]) {
    try {
      await mkdir(/*turbopackIgnore: true*/ path.dirname(file), { recursive: true });
      // Écriture atomique : fichier temporaire puis renommage.
      await writeFile(/*turbopackIgnore: true*/ `${file}.tmp`, data, "utf8");
      await rename(/*turbopackIgnore: true*/ `${file}.tmp`, file);
      return;
    } catch {
      /* disque en lecture seule : on tente l'emplacement de repli */
    }
  }
}
