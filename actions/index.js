"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "uid";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

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
