import { firestore } from "@/firebase";
import { checkWinner } from "@/helpers";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

const useUpdateBoard = (roomId, room, currentUserId) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateBoard = async (index) => {
    try {
      setIsUpdating(true);

      const { playerTurn, board, isGameDone, turnNumber, playerX, playerO } =
        room;

      if (!board[index] && !isGameDone) {
        if (
          (playerTurn === "x" && currentUserId === playerX) ||
          (playerTurn === "o" && currentUserId === playerO)
        ) {
          const newBoard = [...board];
          newBoard[index] = playerTurn;

          const winner = checkWinner(newBoard, turnNumber);

          await updateDoc(doc(firestore, "rooms", roomId), {
            board: [...newBoard],
            playerTurn: playerTurn === "x" ? "o" : "x",
            turnNumber: turnNumber + 1,
            winner,
            isGameDone: winner !== "NONE",
          });

          setIsUpdating(false);
        }
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
