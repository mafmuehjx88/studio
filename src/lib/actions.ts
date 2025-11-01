
"use server";

import { z } from "zod";
import { auth as adminAuth } from "@/lib/firebase-admin"; // Use admin auth
import { db } from "@/lib/firebase"; // Keep client db for user doc creation
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers'

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
    const userRecord = await adminAuth.createUser({
        email: values.email,
        password: values.password,
        displayName: values.username,
    });
    
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: 'user' });

    await setDoc(doc(db, "users", userRecord.uid), {
      uid: userRecord.uid,
      username: values.username,
      email: values.email,
      walletBalance: 0,
      createdAt: serverTimestamp(),
    });

    // NOTE: We do not set cookies here. The client will handle auth state.
    return { success: true };
  } catch (error: any) {
    console.error("Registration Error:", error);
    let message = "An unexpected error occurred.";
    if (error.code === 'auth/email-already-exists') {
        message = "This email is already in use by another account.";
    }
    return { error: message };
  }
}

// This action is NOT used by the client anymore.
// Client uses Firebase SDK directly. Keeping for potential future server-side use.
export async function loginUser(values: z.infer<typeof loginSchema>) {
    // This function is problematic for setting cookies.
    // The client-side sign-in flow is more reliable.
    // We will let the client-side Firebase SDK handle sign-in.
    // This function can remain as a placeholder.
    return { error: "This function is deprecated. Client handles login." };
}

export async function logoutUser() {
  try {
    cookies().delete('firebase-auth-token');
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
