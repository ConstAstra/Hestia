/* eslint-disable @next/next/no-img-element -- images utilisateur (data URL) et URLs marchandes arbitraires */
import type { ProductCategory } from "@/lib/types";

interface VisualProps {
  palette: string[];
  /** Graine pour varier la composition d'un visuel à l'autre. */
  seed: string;
  category?: ProductCategory;
  image?: string;
  alt: string;
  className?: string;
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Silhouettes simplifiées dessinées dans un repère 100 × 100. */
function Glyph({ category, color }: { category?: ProductCategory; color: string }) {
  const stroke = { fill: "none", stroke: color, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (category) {
    case "canape":
      return <g {...stroke}><path d="M26 58v-10a6 6 0 0 1 6-6h36a6 6 0 0 1 6 6v10" /><path d="M20 58a5 5 0 0 1 10 0v4h40v-4a5 5 0 0 1 10 0v12H20z" /><path d="M26 70v5M74 70v5" /></g>;
    case "fauteuil":
      return <g {...stroke}><path d="M34 60V40a16 16 0 0 1 32 0v20" /><path d="M28 60h44v10H28z" /><path d="M32 70l-3 8M68 70l3 8" /></g>;
    case "table":
      return <g {...stroke}><ellipse cx="50" cy="48" rx="26" ry="7" /><path d="M36 54l-4 22M64 54l4 22M50 55v21" /></g>;
    case "chaise":
      return <g {...stroke}><path d="M38 26v32M62 26v32M38 32h24M38 40h24" /><path d="M34 58h32M36 58l-2 20M64 58l2 20" /></g>;
    case "luminaire":
      return <g {...stroke}><path d="M50 18v16" /><path d="M32 52a18 18 0 0 1 36 0z" /><path d="M46 58a4 4 0 0 0 8 0" /></g>;
    case "tapis":
      return <g {...stroke}><rect x="24" y="32" width="52" height="36" rx="3" /><path d="M32 40h36M32 50h36M32 60h36" /><path d="M24 36h-4M24 44h-4M24 56h-4M24 64h-4M76 36h4M76 44h4M76 56h4M76 64h4" /></g>;
    case "rangement":
      return <g {...stroke}><rect x="28" y="26" width="44" height="46" rx="3" /><path d="M28 42h44M28 57h44M47 33h6M47 49h6M47 64h6" /></g>;
    case "lit":
      return <g {...stroke}><path d="M22 70V44M78 70V54" /><path d="M22 54h56" /><path d="M28 54v-6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v6" /><path d="M22 64h56" /></g>;
    case "textile":
      return <g {...stroke}><path d="M30 34c8-6 32-6 40 0v32c-8 6-32 6-40 0z" /><path d="M36 44h28M36 52h28M36 60h28" /></g>;
    case "miroir":
      return <g {...stroke}><circle cx="50" cy="48" r="20" /><path d="M42 40l8-6M44 50l12-10" /><path d="M50 18v6M50 72v6M20 48h6M74 48h6M29 27l4 4M67 65l4 4M71 27l-4 4M33 65l-4 4" /></g>;
    case "plante":
      return <g {...stroke}><path d="M38 60h24l-3 16H41z" /><path d="M50 60V32" /><path d="M50 44c-10 0-14-8-14-14 8 0 14 6 14 14zM50 38c10 0 14-8 14-14-8 0-14 6-14 14z" /></g>;
    case "deco":
      return <g {...stroke}><path d="M44 28h12M46 28c0 8-8 12-8 26a12 12 0 0 0 24 0c0-14-8-18-8-26" /><path d="M40 56h20" /></g>;
    default:
      return null;
  }
}

export function Visual({ palette, seed, category, image, alt, className = "" }: VisualProps) {
  if (image) {
    return <img src={image} alt={alt} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  const colors = palette.length >= 3 ? palette : [...palette, "#efe4d3", "#c9a77f", "#6b6e3a"];
  const h = hash(seed);
  // Composition « planche de tendances » : grands aplats de la palette, sans motif d'arche.
  const split = 38 + (h % 26);
  const circleX = (h >> 3) % 2 ? 70 : 30;
  const circleR = 14 + ((h >> 7) % 10);
  const glyphColor = colors[colors.length - 1];
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={alt} preserveAspectRatio="xMidYMid slice" className={`h-full w-full ${className}`}>
      <rect width="100" height="100" fill={colors[0]} />
      <rect y={split} width="100" height={100 - split} fill={colors[1]} opacity="0.55" />
      <rect x={(h >> 5) % 2 ? 0 : 58} y={split - 18} width="42" height="60" rx="3" fill={colors[2]} opacity="0.4" />
      <circle cx={circleX} cy={split - 6} r={circleR} fill={glyphColor} opacity="0.16" />
      {category && (
        <g>
          <circle cx="50" cy="52" r="27" fill={colors[0]} opacity="0.9" />
          <g transform="translate(14 16.5) scale(0.72)">
            <Glyph category={category} color={glyphColor} />
          </g>
        </g>
      )}
    </svg>
  );
}
