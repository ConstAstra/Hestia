import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/AppShell";
// Polices (toutes sous licence OFL) : Poppins (titres), Inter (texte courant,
// moderne et très lisible, proche des polices système des réseaux sociaux), Cormorant Garamond
// (nom de marque, capitales classiques comme sur le logo).
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/inter/wght-italic.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/poppins/latin-800.css";
import "@fontsource/poppins/latin-ext-600.css";
import "@fontsource/poppins/latin-ext-700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hestia — la déco qui vous ressemble",
    template: "%s · Hestia",
  },
  description:
    "Recréez vos inspirations dans votre budget grâce à Hestia, découvrez vos styles en swipant et organisez vos idées en tableaux.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
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
