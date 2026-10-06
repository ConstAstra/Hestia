"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, Suspense, useEffect, useState } from "react";
import { IconColumns, IconHeart, IconSpark, Logo, Meander } from "@/components/Ornaments";
import { STORAGE_FULL_EVENT, useRehydrateOnMount } from "@/lib/store";

const LINKS = [
  { href: "/dupes", label: "Dupes IA", Icon: IconSpark },
  { href: "/swipe", label: "Swipe", Icon: IconHeart },
  { href: "/tableaux", label: "Tableaux", Icon: IconColumns },
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
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
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

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-6">{children}</main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-28 md:pb-10">
        <Meander className="text-gold/60" />
        <p className="pt-4 text-center font-serif text-base italic text-muted">
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
        <div className="mx-auto grid max-w-md grid-cols-3">
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
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  return LINKS.map((link) =>
    variant === "desktop" ? (
      <Link
        key={link.href}
        href={link.href}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          isActive(link.href) ? "bg-accent-soft text-accent-strong" : "text-muted hover:text-foreground"
        }`}
      >
        {link.label}
      </Link>
    ) : (
      <Link
        key={link.href}
        href={link.href}
        className={`flex flex-col items-center gap-0.5 py-3 text-xs font-medium ${
          isActive(link.href) ? "text-accent" : "text-muted"
        }`}
      >
        <link.Icon className="h-6 w-6" />
        {link.label}
      </Link>
    ),
  );
}
