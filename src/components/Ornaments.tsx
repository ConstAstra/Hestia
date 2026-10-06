import { LogoEmblem } from "@/components/LogoEmblem";
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
    <span className="flex items-center gap-2.5">
      <LogoEmblem className="h-11 w-auto" />
      <span className="wordmark text-[1.35rem]">HESTIA</span>
    </span>
  );
}

/*
 * Icônes dessinées à la main, dans l'esprit illustré du logo : un trait d'encre
 * légèrement irrégulier posé sur une tache de couleur organique (variable CSS --blob).
 */
type IconProps = { className?: string };

const ink = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const blob = { fill: "var(--blob, transparent)" };

export function IconHome({ className = "" }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={className}>
      <path {...blob} d="M6.5 8c3.5-3.5 10-4.5 14.5-2.5S28 12 27 17s-4.5 9-10 9.5S6 24.5 5 19.5 3 11.5 6.5 8z" />
      <path {...ink} d="M7.6 14.6c2.8-2.5 5.6-4.9 8.5-7.3 2.8 2.3 5.6 4.7 8.4 7.1" />
      <path {...ink} d="M9.6 13.2c-.2 3.4-.2 6.9 0 10.3 4.3.2 8.6.2 12.9 0 .2-3.4.2-6.9 0-10.4" />
      <path {...ink} d="M14 23.4c0-1.9 0-3.8.1-5.7 1.3-.1 2.6-.1 3.9 0 .1 1.9.1 3.8 0 5.7" />
    </svg>
  );
}

export function IconSpark({ className = "" }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={className}>
      <path {...blob} d="M6 9c2.5-4.5 9-6 14-4.5s8.5 5 8 10.5-3.5 10.5-9 11.5-11-.5-13.5-4.5S3.5 13.5 6 9z" />
      <path {...ink} d="M13.6 7.2c3.3-.2 6.1 2.4 6.2 5.7.1 3.4-2.5 6.2-5.8 6.3-3.3.1-6-2.5-6.1-5.8-.1-3.3 2.4-6 5.7-6.2z" />
      <path {...ink} strokeWidth={2.4} d="M18.6 17.8c1.6 1.8 3.4 3.7 5.2 5.5" />
      <path {...ink} strokeWidth={1.4} d="M13.7 10.1c-.1 1.3 0 2.5.1 3.8M11.8 12.1c1.3-.1 2.5 0 3.8 0" />
    </svg>
  );
}

export function IconCards({ className = "" }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={className}>
      <path {...blob} d="M8.5 5.5c4.5-2 10.5-1.5 14.5 1.5s5.5 8.5 4 13-6 8-11.5 8.5-10-2-11.5-6.5 0-14.5 4.5-16.5z" />
      <path {...ink} d="M7.4 10.6c2.4-.8 4.9-1.5 7.4-2.2.9 2.6 3.2 9.8 4.1 12.5-2.5.8-5 1.6-7.5 2.3-1.3-4.2-2.6-8.4-4-12.6z" />
      <path {...ink} fill="var(--surface)" d="M14.4 8.5c2.7.1 5.4.4 8.1.6-.2 4.4-.5 8.8-.9 13.2-2.7-.1-5.4-.3-8.1-.5.2-4.4.5-8.9.9-13.3z" />
      <path
        fill="currentColor"
        d="M18.1 13.4c-.6-1-2.3-.7-2.3.6 0 1.3 2.1 2.6 2.1 2.6s2.1-1.2 2.2-2.4c.1-1.4-1.6-1.7-2-.8z"
      />
    </svg>
  );
}

export function IconHeart({ className = "", filled = false }: IconProps & { filled?: boolean }) {
  const heart =
    "M16 25.2c-1.2-.8-9.2-5.6-9.6-11.2-.3-3.4 2.2-6 5.2-5.6 2 .2 3.4 1.6 4.3 3.2.9-1.7 2.5-3.2 4.6-3.3 3-.1 5.2 2.7 4.7 6-.8 5.3-7.9 10-9.2 10.9z";
  if (filled) {
    return (
      <svg aria-hidden viewBox="0 0 32 32" className={className}>
        <path fill="currentColor" d={heart} />
        <path fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" d="M10.8 12.6c.3-1.3 1.3-2.1 2.4-2.2" />
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={className}>
      <path {...blob} d="M5 13c0-5 4.5-8.5 10-8.5S27 7 27.5 13s-3 11-8.5 12.5S5.5 24 5 19z" />
      <path {...ink} d={heart} />
      <path {...ink} strokeWidth={1.3} d="M10.6 12.6c.3-1.2 1.2-1.9 2.3-2" />
    </svg>
  );
}

export function IconBoard({ className = "" }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={className}>
      <path {...blob} d="M7 7.5c3.5-3 11-3.5 15.5-1s6 9 4.5 13.5-6.5 7.5-12 7S5.5 23 4.5 18.5 3.5 10.5 7 7.5z" />
      <path {...ink} d="M8.3 9.8c4.9-.5 9.9-1 14.8-1.5.3 4.9.7 9.7 1.1 14.6-4.9.5-9.8 1.1-14.6 1.6-.5-4.9-.9-9.8-1.3-14.7z" />
      <path {...ink} strokeWidth={1.4} d="M12 15.3c2.8-.2 5.6-.5 8.4-.7M12.3 18.8c1.9-.2 3.7-.3 5.6-.5" />
      <path fill="var(--accent)" stroke="currentColor" strokeWidth="1.2" d="M15.6 6.4c1-.4 2.2.1 2.5 1.1.4 1-.1 2.1-1.1 2.5-1 .4-2.1-.1-2.5-1.1-.4-1 .1-2.1 1.1-2.5z" />
    </svg>
  );
}

export function IconClose({ className = "" }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={className}>
      <path {...ink} strokeWidth={3} d="M9.5 9.8c4.2 4.1 8.4 8.3 12.8 12.6M22.4 9.4c-4.2 4.4-8.5 8.7-12.9 13" />
    </svg>
  );
}
