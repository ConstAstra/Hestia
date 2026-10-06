import type { Metadata } from "next";
import { DupesClient } from "./DupesClient";

export const metadata: Metadata = {
  title: "Dupes IA",
  description: "Recréez une inspiration Pinterest avec des produits abordables, dans votre budget.",
};

export default function DupesPage() {
  return <DupesClient />;
}
