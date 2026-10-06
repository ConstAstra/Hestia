"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, Suspense, useEffect, useState } from "react";
import { LogoStacked } from "@/components/LogoEmblem";
import { IconBoard, IconCards, IconHeart, IconHome, IconSpark, Logo } from "@/components/Ornaments";
import { STORAGE_FULL_EVENT, useRehydrateOnMount } from "@/lib/store";

// Chaque onglet a sa couleur : safran, rose poudré, terracotta, olive.
const LINKS = [
  { href: "/", label: "Accueil", Icon: IconHome, color: "var(--blush)", soft: "var(--blush-soft)" },
  { href: "/swipe", label: "Swipe", Icon: IconCards, color: "var(--gold)", soft: "var(--gold-soft)" },
  { href: "/dupes", label: "Dupes IA", Icon: IconSpark, color: "var(--accent)", soft: "var(--accent-soft)" },
  { href: "/coups-de-coeur", label: "Coups de cœur", Icon: IconHeart, color: "var(--like)", soft: "var(--accent-soft)" },
  { href: "/tableaux", label: "Tableaux", Icon: IconBoard, color: "var(--olive)", soft: "var(--olive-soft)" },
];

export function AppShell({ children }: { children: ReactNode }) {
  useRehydrateOnMount();
  const [storageFull, setStorageFull] = useState(false);

  useEffect(() => {
    const onFull = () => setStorageFull(true);
    window.addEventListener(STORAGE_FULL_EVENT, onFull);
    return () => window.removeEventListener(STORAGE_FULL_EVENT, onFull);
  }, []);

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4">
          <Link href="/" aria-label="Hestia, accueil">
            <Logo />
          </Link>
          <nav className="hidden gap-1 md:flex" aria-label="Navigation principale">
            <Suspense fallback={<NavLinks variant="desktop" pathname="" />}>
              <CurrentNavLinks variant="desktop" />
            </Suspense>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 pb-12 pt-4">{children}</main>

      <footer className="mx-auto w-full max-w-[1500px] px-4 pb-28 md:pb-10">
        <LogoStacked className="mx-auto mt-10 w-28 text-sm" />
        <p className="pt-3 text-center text-sm text-muted">
          Hestia, gardienne du foyer : la décoration qui vous ressemble.
        </p>
      </footer>

      {storageFull && (
        <div role="alert" className="fixed inset-x-4 bottom-24 z-40 mx-auto flex max-w-md items-start gap-3 rounded-2xl bg-foreground p-4 text-sm text-background shadow-xl md:bottom-6">
          <p className="flex-1">
            L&apos;espace de stockage de votre navigateur est plein : la dernière modification n&apos;a pas pu être
            sauvegardée. Supprimez quelques photos de vos tableaux pour libérer de la place.
          </p>
          <button onClick={() => setStorageFull(false)} aria-label="Fermer" className="text-lg leading-none">
            ×
          </button>
        </div>
      )}

      {/* Barre d'onglets mobile */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur md:hidden"
        aria-label="Navigation mobile"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          <Suspense fallback={<NavLinks variant="mobile" pathname="" />}>
            <CurrentNavLinks variant="mobile" />
          </Suspense>
        </div>
      </nav>
    </div>
  );
}

type Variant = "desktop" | "mobile";

// usePathname() est une donnée de requête : isolée sous <Suspense> pour ne pas bloquer le prérendu.
function CurrentNavLinks({ variant }: { variant: Variant }) {
  return <NavLinks variant={variant} pathname={usePathname()} />;
}

function NavLinks({ variant, pathname }: { variant: Variant; pathname: string }) {
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  return LINKS.map(({ href, label, Icon, color, soft }) => {
    const active = isActive(href);
    // La tache de couleur derrière le trait : douce au repos, franche sur l'onglet actif.
    const blobStyle = { "--blob": active ? color : soft } as React.CSSProperties;
    return variant === "desktop" ? (
      <Link
        key={href}
        href={href}
        className={`hover-wiggle flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3.5 text-sm font-bold transition ${
          active ? "text-foreground" : "text-muted hover:text-foreground"
        }`}
        style={blobStyle}
      >
        <Icon className="h-9 w-9 text-foreground" />
        {label}
      </Link>
    ) : (
      <Link
        key={href}
        href={href}
        className={`hover-wiggle flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-bold ${active ? "text-foreground" : "text-muted"}`}
        style={blobStyle}
      >
        <Icon className="h-9 w-9 text-foreground" />
        {label}
      </Link>
    );
  });
}
