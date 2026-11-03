import type { NextConfig } from "next";

/*
 * En-têtes de sécurité, appliqués à toutes les pages en production.
 * - CSP : scripts, styles et polices servis par Hestia uniquement ; images d'Hestia, des
 *   photos Pexels et des images locales (data:, blob: pour la story) ; aucune requête vers
 *   un autre site depuis le navigateur ; le site ne peut pas être affiché dans un cadre.
 *   Les scripts « inline » restent permis : Next.js en injecte pour démarrer les pages
 *   prérendues (un nonce imposerait un rendu dynamique de chaque page).
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.pexels.com",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // L'outil de création s'appelait « Dupes IA » : l'ancienne adresse reste valable.
  poweredByHeader: false,
  async headers() {
    // En développement, le serveur de Next.js a besoin de règles plus souples (rechargement à chaud).
    if (process.env.NODE_ENV !== "production") return [];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [{ source: "/dupes", destination: "/creation", permanent: true }];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
