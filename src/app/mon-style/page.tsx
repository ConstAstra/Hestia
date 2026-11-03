import type { Metadata } from "next";
import { StyleProfileClient } from "./StyleProfileClient";

export const metadata: Metadata = {
  title: "Mon style",
  description: "Vos statistiques déco : styles, couleurs, matières et pièces que vous préférez.",
};

export default function StyleProfilePage() {
  return <StyleProfileClient />;
}
