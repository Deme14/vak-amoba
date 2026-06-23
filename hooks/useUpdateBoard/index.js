import { firestore } from "@/firebase";
import { checkWinner } from "@/helpers";
import { WINS_TO_FINISH } from "@/constants";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

const useUpdateBoard = (roomId, room, currentUserId) => {
  const [isUpdating, setIsUpdating] = useState(false);
  // Index of a tile the player just tried to use but is already taken. In the
  // blind game they can't see it, so we flash it back to them briefly.
  const [occupiedTile, setOccupiedTile] = useState(null);

  const flashOccupied = (index) => {
    setOccupiedTile(index);
    setTimeout(() => setOccupiedTile(null), 700);
  };

  const updateBoard = async (index) => {
    const { playerTurn, board, isGameDone, turnNumber, playerX, playerO } = room;

    const isMyTurn =
      (playerTurn === "x" && currentUserId === playerX) ||
      (playerTurn === "o" && currentUserId === playerO);

    if (isGameDone || !isMyTurn) return;

    // Blind move onto an occupied tile: reject it but tell the player why.
    if (board[index]) {
      flashOccupied(index);
      return;
    }

    try {
      setIsUpdating(true);

      const newBoard = [...board];
      newBoard[index] = playerTurn;

      const winner = checkWinner(newBoard, turnNumber);
      const gameEnded = winner !== "NONE";

      const updates = {
        board: newBoard,
        playerTurn: playerTurn === "x" ? "o" : "x",
        turnNumber: turnNumber + 1,
        winner,
        isGameDone: gameEnded,
      };

      // When the round ends, update the per-room series score and history.
      if (gameEnded) {
        const newScoreX = (room.scoreX || 0) + (winner === "x" ? 1 : 0);
        const newScoreO = (room.scoreO || 0) + (winner === "o" ? 1 : 0);

        updates.scoreX = newScoreX;
        updates.scoreO = newScoreO;
        updates.matchHistory = [...(room.matchHistory || []), winner];
        updates.seriesWinner =
          newScoreX >= WINS_TO_FINISH
            ? "x"
            : newScoreO >= WINS_TO_FINISH
            ? "o"
            : "NONE";
      }

      await updateDoc(doc(firestore, "rooms", roomId), updates);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateBoard, isUpdating, occupiedTile };
};

export default useUpdateBoard;
