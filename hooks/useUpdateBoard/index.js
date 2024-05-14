import { firestore } from "@/firebase";
import { checkWinner } from "@/helpers";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

const useUpdateBoard = (roomId, room, openDialog) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateBoard = async (index) => {
    try {
      setIsUpdating(true);

      const { playerTurn, board, isGameDone, turnNumber } = room;

      if (!board[index] && !isGameDone) {
        const newBoard = [...board];
        newBoard[index] = playerTurn;

        const winner = checkWinner(newBoard, turnNumber);

        await updateDoc(doc(firestore, "rooms", roomId), {
          board: [...newBoard],
          playerTurn: playerTurn === "x" ? "o" : "x",
          turnNumber: turnNumber + 1,
          winner: winner === "NONE" ? "" : winner,
          isGameDone: winner !== "NONE",
        });

        if (winner !== "NONE") {
          openDialog();
        }

        setIsUpdating(false);
      }
    } catch (error) {
      console.log(error);
      setIsUpdating(false);
    }

    setIsUpdating(false);
  };

  return { updateBoard, isUpdating };
};

export default useUpdateBoard;
