import { firestore } from "@/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

// Live map of { userId: teamName } for every registered team.
const useUsersMap = () => {
  const [users, setUsers] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "users"),
      (snapshot) => {
        const map = {};
        snapshot.forEach((d) => {
          map[d.id] = d.data().teamName;
        });
        setUsers(map);
      }
    );

    return () => unsubscribe();
  }, []);

  return users;
};

export default useUsersMap;
