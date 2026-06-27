"use server";

import { firestore } from "@/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "uid";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const ADMIN_COOKIE = "admin";
// Set ADMIN_PASSWORD in .env.local for production; this default is only a
// fallback so the admin page works out of the box.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "amoba-admin";

// Reads the anonymous session id from the cookie. Returns undefined when the
// visitor has no session yet.
export const getSession = async () => cookies().get(SESSION_COOKIE)?.value;

// Stores the player's random id in an httpOnly cookie so server components know
// who the visitor is without leaking it to the URL. No accounts, no auth.
export const createSession = async (uid) => {
  if (!uid) return;

  cookies().set(SESSION_COOKIE, uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/room");
};

export const signOut = async () => {
  cookies().delete(SESSION_COOKIE);
  redirect("/");
};

// True when the visitor has unlocked the admin area with the right password.
// The password itself is stored in the httpOnly cookie and re-checked here, so a
// guessed flag cookie won't pass.
export const isAdmin = async () =>
  cookies().get(ADMIN_COOKIE)?.value === ADMIN_PASSWORD;

export const adminLogin = async (formData) => {
  const password = formData.get("password");

  if (password === ADMIN_PASSWORD) {
    cookies().set(ADMIN_COOKIE, password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    redirect("/admin");
  }

  redirect("/admin?error=1");
};

export const adminLogout = async () => {
  cookies().delete(ADMIN_COOKIE);
  redirect("/admin");
};

// Free-play: create (or join, if it already exists) a casual room. Players pick
// their sign and roll for the start once inside — no pre-assigned teams.
export const createBoard = async (data) => {
  const user = cookies().get(SESSION_COOKIE)?.value;
  if (!user) redirect("/");

  const roomName = data.get("roomName");
  if (!roomName) return;

  const collRef = collection(firestore, "rooms");
  const roomNameToHyphenated = roomName.toLowerCase().trim().split(/\s+/).join("-");

  const roomDoc = await getDoc(doc(collRef, roomNameToHyphenated));

  if (!roomDoc.exists()) {
    await setDoc(doc(collRef, roomNameToHyphenated), {
      name: roomName,
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
    });
  }

  redirect(`/room/${roomNameToHyphenated}`);
};
