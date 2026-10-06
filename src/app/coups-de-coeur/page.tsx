import type { Metadata } from "next";
import { FavoritesClient } from "./FavoritesClient";

export const metadata: Metadata = {
  title: "Coups de cœur",
  description: "Retrouvez, classez et catégorisez tout ce que vous avez aimé.",
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
