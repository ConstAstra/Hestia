import type { Metadata } from "next";
import { QuizClient } from "./QuizClient";

export const metadata: Metadata = {
  title: "Découvrez votre style de déco",
  description: "Dix questions pour découvrir votre style de déco, et ce qu'il veut dire de vous.",
};

export default function QuizPage() {
  return <QuizClient />;
}
