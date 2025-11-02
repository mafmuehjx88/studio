
"use server";

import { z } from "zod";

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

// This function now accepts a base64 encoded image string.
export async function sendTopUpTelegramNotification({ caption, photoBase64 }: { caption: string, photoBase64: string }) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7896614937:AAGixVOYkaS7wjDkD4TQJpKlFc2O_GdAENI";
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1003118744576";

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error("Telegram Bot Token or Chat ID is not configured.");
        throw new Error("Server configuration error.");
    }
    
    // Convert base64 to a Buffer
    const base64Data = photoBase64.split(';base64,').pop();
    if (!base64Data) {
        throw new Error("Invalid base64 image data.");
    }
    const photoBuffer = Buffer.from(base64Data, 'base64');

    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');
    // Append the photo as a blob
    formData.append('photo', new Blob([photoBuffer]), 'screenshot.png');

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            // No 'Content-Type' header, fetch will set it automatically for FormData
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Telegram API error:', errorData);
            throw new Error(`Telegram API Error: ${errorData.description}`);
        }
        return { success: true };
    } catch (error) {
        console.error('Failed to send Telegram photo notification:', error);
        throw error; // Re-throw to be caught by the client
    }
}
