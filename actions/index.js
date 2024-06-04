"use server";

import { auth, firestore } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { redirect } from "next/navigation";

export const signIn = async (data) => {
  const email = data.get("email");
  const password = data.get("password");

  const { user } = await signInWithEmailAndPassword(auth, email, password);

  if (!user) {
    throw new Error("Email or password not valid!");
  }

  redirect(`/room?user=${user.uid}`);
};

export const signUp = async (data) => {
  const teamName = data.get("team");
  const email = data.get("email");
  const password = data.get("password");

  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  user.displayName = teamName;

  await setDoc(doc(firestore, "users", user.uid), {
    teamName,
  });

  redirect(`/room?user=${user.uid}`);
};

export const createBoard = async (user, data) => {
  const collRef = collection(firestore, "rooms");

  const roomName = data.get("roomName");
  if (!roomName) return;

  const roomNameToHyphenated = roomName.toLowerCase().split(" ").join("-");

  const roomDoc = await getDoc(doc(collRef, roomNameToHyphenated));

  if (!roomDoc.exists()) {
    await setDoc(doc(collRef, roomNameToHyphenated), {
      name: roomName,
      board: Array(9).fill(null),
      isGameDone: false,
      turnNumber: 1,
      winner: "",
      playerTurn: "x",
    });

    const roomRef = doc(collRef, roomNameToHyphenated);

    redirect(`/room/${roomRef.id}?user=${user}`);
  } else {
    redirect(`/room/${roomDoc.id}?user=${user}`);
  }
};
