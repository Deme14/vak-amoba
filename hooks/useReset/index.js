import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase";

const useReset = () => {
  const resetBoard = async (roomId) => {
    await updateDoc(doc(firestore, "rooms", roomId), {
      board: Array(9).fill(null),
      isGameDone: false,
      turnNumber: 1,
      winner: "",
      playerTurn: "x",
      playerX: "",
      playerO: "",
    });

    return;
  };

  return { resetBoard };
};

export default useReset;
