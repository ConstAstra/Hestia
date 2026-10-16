import type { Metadata } from "next";
import { TrendsClient } from "./TrendsClient";

export const metadata: Metadata = {
  title: "Tendances déco",
  description: "Les tendances déco du moment, leurs palettes et des idées pour les adopter chez vous.",
};

export default function TrendsPage() {
  return <TrendsClient />;
}
