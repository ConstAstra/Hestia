import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/AppShell";
// Polices auto-hébergées : DM Serif Display (titres, chaleureuse), Nunito Sans (texte, douce),
// Cormorant Garamond (nom de marque, capitales classiques comme sur le logo).
import "@fontsource/dm-serif-display/latin-400.css";
import "@fontsource/dm-serif-display/latin-400-italic.css";
import "@fontsource-variable/nunito-sans/index.css";
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
    { media: "(prefers-color-scheme: light)", color: "#f6efe3" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1714" },
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
