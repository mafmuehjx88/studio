"use server";

import { z } from "zod";
import { auth, db, storage } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

// --- Form Schemas ---
const registerSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// --- Authentication Actions ---

export async function registerUser(values: z.infer<typeof registerSchema>) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      username: values.username,
      email: values.email,
      walletBalance: 0,
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function loginUser(values: z.infer<typeof loginSchema>) {
  try {
    await signInWithEmailAndPassword(auth, values.email, values.password);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function logoutUser() {
  try {
    // This function is often called from the client, but the sign-out itself
    // should be handled by the client-side Firebase SDK to clear local state.
    // The server action's role here is to trigger revalidation if needed.
    // However, the cookie deletion in AuthContext and middleware handles this better.
    // We can keep this action simple.
    // The actual signOut is handled client-side implicitly by onAuthStateChanged.
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// --- Telegram Notification Actions ---

const TELEGRAM_BOT_TOKEN = "7896614937:AAGixVOYkaS7wjDkD4TQJpKlFc2O_GdAENI";
const TELEGRAM_CHAT_ID = "-1003118744576";

export async function sendTelegramNotification(message: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram API error:', errorData);
        throw new Error(`Telegram API Error: ${errorData.description}`);
    }
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

export async function sendTopUpTelegramNotification({ caption, photoUrl }: { caption: string, photoUrl: string }) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        photo: photoUrl,
        caption: caption,
        parse_mode: 'Markdown',
      }),
    });
     if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram API error:', errorData);
        throw new Error(`Telegram API Error: ${errorData.description}`);
    }
  } catch (error) {
    console.error('Failed to send Telegram photo notification:', error);
  }
}

// Placeholder for other actions to be added later
// e.g., createPurchaseOrder, createTopUpRequest, approveTopUp, etc.
