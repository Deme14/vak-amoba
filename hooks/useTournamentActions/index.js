import { firestore } from "@/firebase";
import { buildBracket } from "@/helpers";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCallback } from "react";

const tournamentRef = () => doc(firestore, "tournament", "main");

const useTournamentActions = () => {
  // Admin: randomly draw every registered team into a fresh bracket.
  const draw = useCallback(async () => {
    const usersSnap = await getDocs(collection(firestore, "users"));
    const teamIds = usersSnap.docs.map((d) => d.id);

    const bracket = buildBracket(teamIds);

    await setDoc(tournamentRef(), { ...bracket, createdAt: Date.now() });
  }, []);

  // Admin: clear the bracket and lock the lobby again.
  const reset = useCallback(async () => {
    await setDoc(tournamentRef(), {
      status: "pending",
      matches: {},
      champion: null,
    });
  }, []);

  // Records a match result and advances the winner. Idempotent: a match that
  // already has a winner is left untouched.
  const reportMatchWinner = useCallback(async (matchId, winnerUserId) => {
    const ref = tournamentRef();
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const match = snap.data().matches?.[matchId];
    if (!match || match.winner) return;

    const updates = { [`matches.${matchId}.winner`]: winnerUserId };

    if (match.nextMatchId) {
      const slotField = match.nextSlot === "A" ? "teamA" : "teamB";
      updates[`matches.${match.nextMatchId}.${slotField}`] = winnerUserId;
    } else {
      updates.champion = winnerUserId;
      updates.status = "done";
    }

    await updateDoc(ref, updates);
  }, []);

  return { draw, reset, reportMatchWinner };
};

export default useTournamentActions;
