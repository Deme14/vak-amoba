import TicTacToe from "@/components/TicTacToe/TicTacToe";
import { getSession } from "@/actions";
import { redirect } from "next/navigation";

export default async function Room({ params }) {
  const uid = await getSession();
  if (!uid) redirect("/");

  return <TicTacToe roomId={params.id} user={uid} />;
}
