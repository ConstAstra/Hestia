"use client";

/*
 * Petits effets « dopamine » : cœurs qui jaillissent quand on aime, confettis quand un
 * résultat arrive, légère vibration sur mobile. Tout est en CSS (voir .fx-* dans
 * globals.css), sans bibliothèque, et rien ne se passe si l'appareil demande moins de mouvement.
 */

const COLORS = ["#FF8FC7", "#FFC72C", "#1FB5AC", "#FF7A1A", "#6CC24A", "#F0412A", "#8A3FFC", "#E0503A"];

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function centerOf(origin: Element | { x: number; y: number }) {
  if ("getBoundingClientRect" in origin) {
    const rect = origin.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }
  return origin;
}

/** Une petite vibration sur les téléphones qui la permettent. */
export function haptic(pattern: number | number[] = 12) {
  try {
    navigator.vibrate?.(pattern);
  } catch {}
}

/** Gerbe de cœurs et de pastilles colorées autour d'un élément (un bouton « J'aime »…). */
export function burstHearts(origin: Element | { x: number; y: number } | null | undefined, count = 14) {
  if (!origin || reducedMotion()) return;
  const { x, y } = centerOf(origin);
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    const heart = i % 3 !== 2;
    particle.className = `fx-particle ${heart ? "fx-heart" : "fx-dot"}`;
    if (heart) particle.textContent = "♥";
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
    const distance = 46 + Math.random() * 56;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.color = COLORS[i % COLORS.length];
    particle.style.background = heart ? "transparent" : COLORS[(i + 3) % COLORS.length];
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance - 18}px`);
    particle.style.setProperty("--rot", `${(Math.random() - 0.5) * 120}deg`);
    particle.style.setProperty("--size", `${heart ? 14 + Math.random() * 12 : 6 + Math.random() * 5}px`);
    document.body.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
}

/** Pluie de confettis sur tout l'écran (résultat du test, résultats d'une création). */
export function confetti(count = 90) {
  if (reducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "fx-confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = COLORS[i % COLORS.length];
    piece.style.width = `${6 + Math.random() * 7}px`;
    piece.style.height = `${8 + Math.random() * 10}px`;
    piece.style.borderRadius = Math.random() > 0.6 ? "999px" : "2px";
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.animationDuration = `${2.1 + Math.random() * 1.4}s`;
    piece.style.setProperty("--sway", `${(Math.random() - 0.5) * 160}px`);
    piece.style.setProperty("--spin", `${(Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540)}deg`);
    document.body.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }
}
