import { useId } from "react";

/*
 * Emblème Hestia, redessiné en vectoriel d'après le logo de la marque :
 * un H à empattements dont les jambages deviennent les murs d'une maison
 * (le toit est détaché du haut du H par une fine fente), la flamme du foyer
 * dans sa coupe, le soleil terracotta sous un arc, et deux rameaux d'olivier.
 */

const OLIVE = "#6a6b2f";
const LEAF_DARK = "#5f6b35";
const LEAF_LIGHT = "#8d975b";
const TERRACOTTA = "#c8714a";
const CREAM = "#f3e8d3";

/** Feuilles du rameau gauche : [base x, base y, pointe x, pointe y]. */
const LEAVES: [number, number, number, number][] = [
  [26, 99, 15.6, 73],
  [24.7, 116, 1, 108],
  [32.5, 131.5, 9.5, 128.5],
  [40.3, 148.5, 15, 144.5],
  [31, 115, 38, 96.5],
  [40, 139, 47, 122],
];

function Leaf({ base, tip }: { base: [number, number]; tip: [number, number] }) {
  const dx = tip[0] - base[0];
  const dy = tip[1] - base[1];
  const length = Math.hypot(dx, dy);
  const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
  const w = length * 0.3;
  const L = length;
  return (
    <g transform={`translate(${base[0]} ${base[1]}) rotate(${angle})`}>
      <path d={`M0 0 C ${w} ${-0.28 * L}, ${w * 0.9} ${-0.72 * L}, 0 ${-L} C ${-w * 0.9} ${-0.72 * L}, ${-w} ${-0.28 * L}, 0 0 Z`} fill={LEAF_DARK} />
      <path d={`M0 0 C ${w} ${-0.28 * L}, ${w * 0.9} ${-0.72 * L}, 0 ${-L} Z`} fill={LEAF_LIGHT} />
    </g>
  );
}

function Branch({ flip = false }: { flip?: boolean }) {
  return (
    <g transform={flip ? "translate(201.2 0) scale(-1 1)" : undefined}>
      <path d="M47 151 C 38 136, 28 112, 22 82" fill="none" stroke={LEAF_DARK} strokeWidth="1.5" strokeLinecap="round" />
      {LEAVES.map(([bx, by, tx, ty], index) => (
        <Leaf key={index} base={[bx, by]} tip={[tx, ty]} />
      ))}
      <ellipse cx="42.2" cy="128.6" rx="3" ry="3.7" fill="#b9573a" transform="rotate(-20 42.2 128.6)" />
    </g>
  );
}

export function LogoEmblem({ className = "", title = "Hestia" }: { className?: string; title?: string }) {
  const id = useId();
  return (
    <svg viewBox="-2 -4 205 170" role="img" aria-label={title} className={className}>
      <defs>
        <linearGradient id={`${id}-flame`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c35a3a" />
          <stop offset="0.6" stopColor="#d9784a" />
          <stop offset="1" stopColor="#eaa267" />
        </linearGradient>
        <linearGradient id={`${id}-bowl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dca06a" />
          <stop offset="1" stopColor="#c47d4c" />
        </linearGradient>
      </defs>

      {/* Arc et soleil */}
      <path d="M25 76.7 A75.6 75.6 0 0 1 176.2 76.7" fill="none" stroke={TERRACOTTA} strokeWidth="1.3" />
      <circle cx="100.6" cy="28.6" r="12.5" fill="#dd8752" />

      <Branch />
      <Branch flip />

      <g fill={OLIVE}>
        {/* Haut des jambages, coupé en biais au-dessus du toit */}
        <path d="M51.5 43.6 H68.5 V81 L51.5 98 Z" />
        <path d="M149.7 43.6 H132.7 V81 L149.7 98 Z" />
        {/* Empattements supérieurs, avec congés */}
        <path d="M41.6 40.2 H80.2 V43.2 C 74 43.5 69.6 44.8 68.5 48.5 V43.6 H51.5 V48.5 C 50.4 44.8 46.8 43.5 41.6 43.2 Z" />
        <path d="M159.6 40.2 H121 V43.2 C 127.2 43.5 131.6 44.8 132.7 48.5 V43.6 H149.7 V48.5 C 150.8 44.8 154.4 43.5 159.6 43.2 Z" />
        {/* Maison : toit et murs (l'intérieur reste vide) */}
        <path
          fillRule="evenodd"
          d="M51.5 100.6 L100.6 51.5 L149.7 100.6 V151 H51.5 Z M72.8 151 V93.4 L100.6 65.6 L128.4 93.4 V151 Z"
        />
        {/* Cheminée */}
        <path d="M116.6 54 H123.4 V74.4 L116.6 67.6 Z" />
        {/* Empattements inférieurs évasés */}
        <path d="M51.5 144 C 51.5 151.5, 47 156, 39 157.2 V160.4 H85 V157.2 C 78 156.4, 72.8 152, 72.8 144 Z" />
        <path d="M149.7 144 C 149.7 151.5, 154.2 156, 162.2 157.2 V160.4 H116.2 V157.2 C 123.2 156.4, 128.4 152, 128.4 144 Z" />
      </g>
      {/* Coins intérieurs arrondis en bas de la maison */}
      <path d="M72.8 151 V146 C 72.8 150, 75 151, 78 151 Z M128.4 151 V146 C 128.4 150, 126.2 151, 123.2 151 Z" fill={OLIVE} />

      {/* La flamme dans sa coupe */}
      <path
        d="M101.5 78 C 104 86, 111 92, 116.5 100 C 122 108, 124 116, 121.5 124 C 119 132, 111 138, 101 138 C 90 138, 82 132, 80 123 C 78.5 115, 82 108, 87.5 101 C 87 107, 88.5 111, 91.5 114 C 90.5 104, 95 96, 98.5 90 C 100.5 86, 101.5 82, 101.5 78 Z"
        fill={`url(#${id}-flame)`}
      />
      <path
        d="M104 96 C 110 104, 116 111, 114.5 120 C 113.5 128, 108 133, 101.5 133 C 94.5 133, 89.5 128.5, 89 122 C 88.5 116.5, 92 112, 95 108.5 C 95 113, 96.5 116, 99 118 C 98.5 111, 101.5 104, 104 96 Z"
        fill="#eea875"
        opacity="0.9"
      />
      <path
        d="M93 130 C 90.5 122, 95 114, 99.5 108 M106 131 C 109.5 124, 108.5 116, 104.5 110 M100.5 133 C 99 127, 101 121, 103.5 117"
        fill="none"
        stroke="#f8dfc3"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path d="M78.5 136.6 H126 C 124.6 145.4, 114.6 149.8, 102.2 149.8 C 89.8 149.8, 80 145.4, 78.5 136.6 Z" fill={`url(#${id}-bowl)`} />
      <path d="M78.5 136.6 H126" stroke="#b7744a" strokeWidth="0.9" />
    </svg>
  );
}

/** Logo complet : emblème et nom en capitales, empilés, sur fond crème comme l'original. */
export function LogoStacked({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <LogoEmblem className="w-full" />
      <span className="wordmark text-[2.1em]">HESTIA</span>
    </div>
  );
}

export { CREAM as LOGO_BACKGROUND };
