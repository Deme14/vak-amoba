import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase";

const useReset = () => {
  // Clears the board for the next round but keeps players, score and history.
  // The loser of the round starts next; after a draw there is no loser, so we
  // fall back to a dice roll (playerTurn = null).
  const nextRound = async (roomId, winner) => {
    const nextStarter = winner === "x" ? "o" : winner === "o" ? "x" : null;

    await updateDoc(doc(firestore, "rooms", roomId), {
      board: Array(9).fill(null),
      isGameDone: false,
      turnNumber: 1,
      winner: "NONE",
      playerTurn: nextStarter,
      diceX: null,
      diceO: null,
    });
  };

  // Series finished: wipe the room back to an empty, joinable state and release
  // both player slots so the next pair can use it from the lobby.
  const resetRoom = async (roomId) => {
    await updateDoc(doc(firestore, "rooms", roomId), {
      board: Array(9).fill(null),
      isGameDone: false,
      turnNumber: 1,
      winner: "NONE",
      playerTurn: null,
      diceX: null,
      diceO: null,
      scoreX: 0,
      scoreO: 0,
      seriesWinner: "NONE",
      matchHistory: [],
      playerX: "",
      playerO: "",
    });
  };

  return { nextRound, resetRoom };
};

export default useReset;
