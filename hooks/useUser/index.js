import { firestore } from "@/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

const useUser = (userId) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      if (!userId) return;

      const userDoc = await getDoc(doc(firestore, "users", userId));

      if (!userDoc.exists()) return;

      setUser(userDoc.data());
    };

    getUser();
  }, [userId]);

  return user;
};

export default useUser;
