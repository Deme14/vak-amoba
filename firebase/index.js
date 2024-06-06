import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgmNFKAyAAS2EwrYnavHoQBBOkCGNu9z0",
  authDomain: "vak-amoba.firebaseapp.com",
  projectId: "vak-amoba",
  storageBucket: "vak-amoba.appspot.com",
  messagingSenderId: "505414428431",
  appId: "1:505414428431:web:e0c57d80bff8553fca407a",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const firestore = getFirestore(app);
