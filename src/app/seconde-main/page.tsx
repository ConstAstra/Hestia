import type { Metadata } from "next";
import { SecondHandClient } from "./SecondHandClient";

export const metadata: Metadata = {
  title: "Seconde main",
  description: "Des meubles et objets de seconde main réellement en vente, trouvés par Hestia, et les pièces à chiner.",
};

export default function SecondHandPage() {
  return <SecondHandClient />;
}
