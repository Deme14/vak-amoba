import { firestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useCallback } from "react";

const useRollDice = (roomId) => {
  // Stores the current player's roll (1-6).
  const roll = useCallback(
    async (sign) => {
      const value = Math.floor(Math.random() * 6) + 1;

      await updateDoc(doc(firestore, "rooms", roomId), {
        [sign === "x" ? "diceX" : "diceO"]: value,
      });
    },
    [roomId]
  );

  // Higher roll starts the round. Writing is idempotent, so it is safe for both
  // clients to call it once both dice are in.
  const startWith = useCallback(
    async (starter) => {
      await updateDoc(doc(firestore, "rooms", roomId), {
        playerTurn: starter,
        diceX: null,
        diceO: null,
      });
    },
    [roomId]
  );

  // Tie — wipe both dice so the players can roll again.
  const rerollDice = useCallback(async () => {
    await updateDoc(doc(firestore, "rooms", roomId), {
      diceX: null,
      diceO: null,
    });
  }, [roomId]);

  return { roll, startWith, rerollDice };
};

export default useRollDice;
