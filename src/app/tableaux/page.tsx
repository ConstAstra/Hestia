import type { Metadata } from "next";
import { BoardsClient } from "./BoardsClient";

export const metadata: Metadata = {
  title: "Tableaux",
  description: "Organisez vos idées déco en mood boards.",
};

export default function BoardsPage() {
  return <BoardsClient />;
}
