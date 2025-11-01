
"use server";

import { z } from "zod";
// Removed firebase-admin imports as they are no longer needed and caused issues.

export async function sendTelegramNotification(message: string) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7896614937:AAGixVOYkaS7wjDkD4TQJpKlFc2O_GdAENI";
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1003118744576";
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Telegram Bot Token or Chat ID is not configured.");
    return;
  }

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
    // We don't re-throw the error to prevent the client-side purchase from failing.
  }
}

export async function sendTopUpTelegramNotification({ caption, photoUrl }: { caption: string, photoUrl: string }) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7896614937:AAGixVOYkaS7wjDkD4TQJpKlFc2O_GdAENI";
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1003118744576";

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error("Telegram Bot Token or Chat ID is not configured.");
        return;
    }

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
