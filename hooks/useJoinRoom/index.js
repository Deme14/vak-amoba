import { firestore } from "@/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useState } from "react";

const useJoinRoom = (roomId) => {
  const [isJoining, setIsJoining] = useState(false);

  const joinAs = async (userId, playerSign) => {
    try {
      setIsJoining(true);

      await updateDoc(doc(firestore, "rooms", roomId), {
        [playerSign === "X" ? "playerX" : "playerO"]: userId,
      });

      setIsJoining(false);
    } catch (error) {
      console.log(error);
      setIsJoining(false);
    }

    setIsJoining(false);
  };

  return { joinAs, isJoining };
};

export default useJoinRoom;
