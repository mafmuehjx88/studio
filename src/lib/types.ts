
import type { Timestamp, FieldValue } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  walletBalance: number;
  smileCoinBalance: number; // New balance for Smile Coins
  createdAt: Timestamp | FieldValue;
}

export interface Game {
  id: string;
  name: string;
  image: string; // This is now a direct URL
  bannerImage?: string; // Optional banner for the game page
  needsServerId?: boolean;
  needsUserIdentifier?: boolean;
  userIdentifierLabel?: string;
}

export interface Product {
  id: string;
  gameId: string;
  name: string;
  category: string;
  price: number;
  image: string; // This is now a direct URL
  country?: 'brazil' | 'philippines';
}

export interface Order {
    id: string;
    userId: string;
    username: string;
    gameId?: string;
    gameName?: string;
    itemId?: string;
    itemName: string;
    price: number;
    gameUserId?: string;
    gameServerId?: string;
    paymentMethod?: string;
    status: 'Pending' | 'Completed' | 'Failed';
    createdAt: Timestamp;
    type?: 'Purchase' | 'Top-up';
    smileCode?: string; // To store the redeemed code
}

export interface TopUpRequest {
    id?: string;
    userId: string;
    username: string;
    amount: number;
    screenshotUrl: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: Timestamp | FieldValue;
    // The following are not used in the Telegram-only flow,
    // but are kept for potential future use with a database.
    paymentMethod?: string; 
    transactionId?: string;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: Timestamp;
}

export interface AdminPaymentAccount {
    id: string;
    name: string;
    accountName: string;
    accountNumber: string;
    logo: string;
}

export interface PlaceholderImage {
    imageUrl: string;
    description: string;
    imageHint?: string;
}

export interface SmileCode {
  id?: string;
  code: string;
  productId: string;
  productName: string;
  price: number;
  isUsed: boolean;
  usedBy: string | null;
  usedAt: Timestamp | FieldValue | null;
  createdAt: Timestamp | FieldValue;
}
