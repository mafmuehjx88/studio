"use client";

import { auth, db } from "@/lib/firebase";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

export function useAuthInstance(): Auth {
  return auth;
}

export function useFirestoreInstance(): Firestore {
  return db;
}
