import { firestore } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

// Opens (creating it on first entry) the game room for a bracket match. The two
// teams are pre-assigned to X/O, so play starts straight at the dice roll.
const useEnterMatch = () => {
  const router = useRouter();

  const enterMatch = async (match) => {
    const roomId = `match-${match.id}`;
    const ref = doc(firestore, "rooms", roomId);

    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        name: `Match ${match.id}`,
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
        playerX: match.teamA,
        playerO: match.teamB,
        matchId: match.id,
      });
    }

    router.push(`/room/${roomId}`);
  };

  return enterMatch;
};

export default useEnterMatch;
