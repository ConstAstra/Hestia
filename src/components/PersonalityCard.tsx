import { PERSONALITIES } from "@/lib/personalities";
import { STYLES_BY_ID } from "@/lib/styles";

/** « Ce que votre style dit de vous » : portrait ludique tiré du style dominant. */
export function PersonalityCard({ styleId, intro }: { styleId: string; intro?: string }) {
  const personality = PERSONALITIES[styleId];
  const style = STYLES_BY_ID[styleId];
  if (!personality || !style) return null;
  return (
    <section className="rise relative overflow-hidden rounded-[1.75rem] bg-[#2b2420] p-6 text-[#fbf4ef] md:p-8">
      <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-2xl" style={{ background: style.palette[1] ?? "#C0603D" }} aria-hidden />
      <div className="relative space-y-4">
        <p className="font-heading text-xs uppercase tracking-[0.18em] text-[#f6a33c]">{intro ?? "Ce que votre style dit de vous"}</p>
        <h2 className="font-display text-3xl md:text-4xl">{personality.title}</h2>
        <p className="max-w-2xl leading-relaxed opacity-90">{personality.text}</p>
        <ul className="flex flex-wrap gap-2">
          {personality.traits.map((trait) => (
            <li key={trait} className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
              {trait}
            </li>
          ))}
        </ul>
        <p className="text-sm italic opacity-80">Votre petit défaut : {personality.flaw.charAt(0).toLowerCase() + personality.flaw.slice(1)}</p>
      </div>
    </section>
  );
}
