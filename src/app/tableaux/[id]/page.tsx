import type { Metadata } from "next";
import { Suspense } from "react";
import { BoardClient } from "./BoardClient";

export const metadata: Metadata = {
  title: "Tableau",
};

// Les tableaux vivent dans le navigateur de l'utilisateur : rendu côté client.
export default function BoardPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-surface-muted" />}>
      <BoardClient />
    </Suspense>
  );
}
