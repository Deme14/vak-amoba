import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebase";

const useRoom = (roomId) => {
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "rooms", roomId),
      (snapshot) => {
        setRoom(snapshot.data());
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomId, isLoading]);

  return { room, isLoading };
};

export default useRoom;
