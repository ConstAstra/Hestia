import type { Metadata } from "next";
import { QuizClient } from "./QuizClient";

export const metadata: Metadata = {
  title: "Découvrez votre projet déco",
  description: "Huit questions pour découvrir votre style, votre palette et les pièces qui vous ressemblent.",
};

export default function QuizPage() {
  return <QuizClient />;
}
