import type { Metadata } from "next";
import { SwipeClient } from "./SwipeClient";

export const metadata: Metadata = {
  title: "Swipe",
  description: "Trouvez vos ambiances et vos produits déco préférés en swipant.",
};

export default function SwipePage() {
  return <SwipeClient />;
}
