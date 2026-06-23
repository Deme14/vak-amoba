import { firestore } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useTournament = () => {
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "tournament", "main"),
      (snapshot) => {
        setTournament(snapshot.exists() ? snapshot.data() : null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { tournament, isLoading };
};

export default useTournament;
