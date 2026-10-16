import { Suspense } from "react";
import { HomeFeed } from "./HomeFeed";

// Accueil : le fil d'inspiration infini.
// HomeFeed lit l'URL (?tendance=…), donnée de requête isolée sous <Suspense>.
export default function HomePage() {
  return (
    <Suspense fallback={<div className="h-14 animate-pulse rounded-full bg-surface" />}>
      <HomeFeed />
    </Suspense>
  );
}
