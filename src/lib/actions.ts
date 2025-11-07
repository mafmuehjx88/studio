
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


/**
 * Checks the MLBB player name using an external API.
 * @param userId The player's User ID.
 * @param serverId The player's Server ID.
 * @returns An object with success status and the player's name or an error message.
 */
export async function checkMlbbPlayerName(userId: string, serverId: string): Promise<{ success: boolean; data: any }> {
    if (!userId || !serverId) {
        return { success: false, data: { error_msg: "User ID and Server ID are required." } };
    }
    
    // IMPORTANT: This external API is for demonstration. In a real application, 
    // you should use a reliable, authenticated API provider.
    const apiUrl = `https://gateway.irvankede.com/v1/data/ml?id=${userId}&zone=${serverId}`;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            // Add a timeout to the fetch request
            signal: AbortSignal.timeout(5000) // 5 seconds timeout
        });

        if (!response.ok) {
            // Try to parse the error response from the API provider
            const errorData = await response.json().catch(() => ({ error_msg: 'Player not found or API error.' }));
            return { success: false, data: errorData };
        }

        const data = await response.json();
        
        // The API returns a 'nama' field for the player name.
        if (data && data.nama) {
            return { success: true, data: { name: data.nama } };
        } else {
            return { success: false, data: { error_msg: data.message || "Player not found." } };
        }

    } catch (error: any) {
        console.error("MLBB Player Name Check API Error:", error);
        if (error.name === 'TimeoutError') {
             return { success: false, data: { error_msg: "Verification timed out. Please try again." } };
        }
        // Throw the error to be caught by the client-side try-catch
        throw new Error("An unexpected error occurred while checking the player name.");
    }
}

    