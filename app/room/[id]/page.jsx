import TicTacToe from "@/components/TicTacToe/TicTacToe";

export default function Room({ params, searchParams }) {
  return <TicTacToe roomId={params.id} user={searchParams.user} />;
}
