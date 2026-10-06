import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/AppShell";
// Polices : Weekdays Roman Slant (titres) et Oranienbaum (texte courant), déclarées dans globals.css ;
// Cormorant Garamond (nom de marque, capitales classiques comme sur le logo).
import "@fontsource/cormorant-garamond/latin-600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hestia — la déco qui vous ressemble",
    template: "%s · Hestia",
  },
  description:
    "Recréez vos inspirations Pinterest dans votre budget grâce à l'IA, découvrez vos styles en swipant et organisez vos idées en tableaux.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1d5c1" },
    { media: "(prefers-color-scheme: dark)", color: "#2b1810" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
