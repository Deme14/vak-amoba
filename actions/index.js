"use server";

import { auth, firestore } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
