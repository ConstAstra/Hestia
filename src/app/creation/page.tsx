import type { Metadata } from "next";
import { DupesClient } from "./DupesClient";

export const metadata: Metadata = {
  title: "Outil de création",
  description: "Recréez une inspiration Pinterest avec des produits abordables, dans votre budget.",
};

export default function CreationPage() {
  return <DupesClient />;
}
