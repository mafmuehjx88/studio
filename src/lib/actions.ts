
"use server";

import { z } from "zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { products as staticProducts, games as staticGames } from "@/lib/data";
import type { PlaceholderImage } from "@/lib/types";

type ImagesMap = Record<string, PlaceholderImage>;


export async function getOrCreatePlaceholderImages(): Promise<ImagesMap> {
  const docRef = doc(db, 'settings', 'placeholderImages');
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().images) {
      return docSnap.data().images;
    } else {
      // Document or images field doesn't exist, create it from static data
      console.log("No image data found in Firestore. Initializing from static data.");
      const initialImages: ImagesMap = {};
      
      // From products
      staticProducts.forEach(product => {
        if (!initialImages[product.image]) {
          initialImages[product.image] = {
            imageUrl: `https://picsum.photos/seed/${product.image}/200/200`,
            description: `Image for ${product.name}`,
            imageHint: product.category,
          };
        }
      });
      
      // From games
      staticGames.forEach(game => {
          if (!initialImages[game.image]) {
            initialImages[game.image] = {
                imageUrl: `https://picsum.photos/seed/${game.image}/600/300`,
                description: `Banner for ${game.name}`,
                imageHint: `game ${game.name}`
            }
          }
      });
      
      // Add other common images
      const commonImages = ['logo', 'banner', 'default-avatar'];
      commonImages.forEach(imgKey => {
           if (!initialImages[imgKey]) {
            initialImages[imgKey] = {
                imageUrl: `https://picsum.photos/seed/${imgKey}/400/400`,
                description: `${imgKey.replace('-', ' ')} image`,
                imageHint: imgKey
            }
          }
      });

      // Save this initial structure to Firestore so it's there for next time
      await setDoc(docRef, { images: initialImages }, { merge: true });
      console.log("Initialized and saved image data to Firestore.");
      
      return initialImages;
    }
  } catch (err) {
    console.error("Error in getOrCreatePlaceholderImages:", err);
    // In case of error, return an empty map to prevent crashes
    return {};
  }
}


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
