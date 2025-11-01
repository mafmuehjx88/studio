import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  walletBalance: number;
  createdAt: Timestamp;
}

export interface Order {
    id: string;
    userId: string;
    username: string;
    gameId: string;
    gameName: string;
    itemId: string;
    itemName: string;
    price: number;
    gameUserId: string;
    gameServerId?: string;
    paymentMethod: string;
    status: 'Pending' | 'Completed' | 'Failed';
    createdAt: Timestamp;
}

export interface TopUpRequest {
    id: string;
    userId: string;
    username: string;
    amount: number;
    screenshotUrl: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: Timestamp;
    paymentMethod: string;
    transactionId: string;
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
