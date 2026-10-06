import { useId } from "react";

/** Frise en méandre (grecque), étirable à n'importe quelle largeur. */
export function Meander({ className = "", size = 14 }: { className?: string; size?: number }) {
  const id = useId();
  return (
    <svg aria-hidden className={`block w-full ${className}`} height={size} preserveAspectRatio="none">
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" viewBox="0 0 20 20">
          <path
            d="M0 1H20M0 19H20M2 19V5H16V15H6V9H12V12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="square"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Rameau de laurier (ou d'olivier), symbole de victoire et de paix. */
export function Laurel({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  const leaves = Array.from({ length: 6 }, (_, i) => {
    const t = i / 5;
    const x = 6 + t * 44;
    const y = 30 - Math.sin(t * Math.PI * 0.9) * 14;
    return { x, y, angle: -35 + t * 50 };
  });
  return (
    <svg aria-hidden viewBox="0 0 60 40" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M4 34 Q 26 6 56 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {leaves.map((leaf, i) => (
        <g key={i} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle})`}>
          <ellipse cx="0" cy="-5" rx="2.4" ry="5.5" fill="currentColor" opacity="0.9" />
          <ellipse cx="3" cy="5" rx="2.2" ry="5" fill="currentColor" opacity="0.7" transform="rotate(70)" />
        </g>
      ))}
    </svg>
  );
}

/** Emblème : la flamme d'Hestia sous une arche. */
export function HestiaMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={className}>
      <path d="M6 30V14a10 10 0 0 1 20 0v16" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 30h24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M16 27c-3.6 0-5.6-2.4-5.6-5.2 0-3.4 3-5 3.6-8.6 2 1.4 2.6 3.4 2.4 5 1-.8 1.6-2 1.6-3.4 2.2 1.8 3.6 4.2 3.6 7 0 2.8-2 5.2-5.6 5.2z"
        fill="var(--accent)"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-foreground">
      <HestiaMark className="h-8 w-8 text-olive" />
      <span className="font-inscription text-xl tracking-[0.32em]">HESTIA</span>
    </span>
  );
}

/* Icônes de navigation, au trait */
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function IconSpark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <path {...stroke} d="M12 3v4M12 17v4M3 12h4M17 12h4M12 8.5l1.2 2.3 2.3 1.2-2.3 1.2L12 15.5l-1.2-2.3L8.5 12l2.3-1.2z" />
    </svg>
  );
}

export function IconHeart({ className = "", filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <path
        {...stroke}
        fill={filled ? "currentColor" : "none"}
        d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"
      />
    </svg>
  );
}

export function IconColumns({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <path {...stroke} d="M3 7l9-4 9 4M4 7h16M6 7v11M10 7v11M14 7v11M18 7v11M4 18h16M3 21h18" />
    </svg>
  );
}

export function IconClose({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <path {...stroke} strokeWidth={2.2} d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
