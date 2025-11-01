import type { Game, Product } from './types';

export const games: Game[] = [
  { id: 'mlbb', name: 'MLBB', image: 'mobile-legends', needsServerId: true },
  { id: 'pubg', name: 'PUBG', image: 'pubg-mobile', needsServerId: false },
  { id: 'hok', name: 'HOK', image: 'honor-of-kings', needsServerId: false },
];

export const products: Product[] = [
  // Mobile Legends - New Data
  { id: 'weekly-pass', gameId: 'mlbb', name: 'Weekly Pass', category: 'weekly', price: 5850, image: 'https://i.ibb.co/XF3C29w/OIP.jpg' },
  { id: 'twilight-pass', gameId: 'mlbb', name: 'Twilight Pass', category: 'weekly', price: 32900, image: 'https://i.ibb.co/XF3C29w/OIP.jpg' },
  { id: '2x-50', gameId: 'mlbb', name: '50+55💎', category: '2x', price: 2400, image: 'https://i.ibb.co/FmJ4c07/a6f698be9a15c30b252069b17c2f6645.jpg' },
  { id: '2x-100', gameId: 'mlbb', name: '100+115💎', category: '2x', price: 4900, image: 'https://i.ibb.co/FmJ4c07/a6f698be9a15c30b252069b17c2f6645.jpg' },
  { id: 'dm-12', gameId: 'mlbb', name: '12💎', category: 'diamonds', price: 500, image: 'https://i.ibb.co/FmJ4c07/a6f698be9a15c30b252069b17c2f6645.jpg' },
  { id: 'dm-28', gameId: 'mlbb', name: '28💎', category: 'diamonds', price: 1000, image: 'https://i.ibb.co/FmJ4c07/a6f698be9a15c30b252069b17c2f6645.jpg' },
  { id: 'dm-44', gameId: 'mlbb', name: '44💎', category: 'diamonds', price: 1500, image: 'https://i.ibb.co/FmJ4c07/a6f698be9a15c30b252069b17c2f6645.jpg' },
  { id: 'dm-59', gameId: 'mlbb', name: '59💎', category: 'diamonds', price: 2000, image: 'https://i.ibb.co/FmJ4c07/a6f698be9a15c30b252069b17c2f6645.jpg' },
  { id: 'dm-86', gameId: 'mlbb', name: '86💎', category: 'diamonds', price: 2900, image: 'https://i.ibb.co/FmJ4c07/a6f698be9a15c30b252069b17c2f6645.jpg' },
  { id: 'dm-172', gameId: 'mlbb', name: '172💎', category: 'diamonds', price: 5700, image: 'https://i.ibb.co/FmJ4c07/a6f698be9a15c30b252069b17c2f6645.jpg' },
  { id: 'dm-257', gameId: 'mlbb', name: '257💎', category: 'diamonds', price: 8600, image: 'https://i.ibb.co/FmJ4c07/a6f698be9a15c30b252069b17c2f6645.jpg' },
  { id: 'dm-344', gameId: 'mlbb', name: '344💎', category: 'diamonds', price: 11400, image: 'https://i.ibb.co/FmJ4c07/a6f698be9a15c30b252069b17c2f6645.jpg' },
  { id: 'dm-429', gameId: 'mlbb', name: '429💎', category: 'diamonds', price: 14300, image: 'https://i.ibb.co/FmJ4c07/a6f698be9a15c30b252069b17c2f6645.jpg' },
  { id: 'dm-514', gameId: 'mlbb', name: '514💎', category: 'diamonds', price: 17200, image: 'https://i.ibb.co/FmJ4c07/a6f698be9a15c30b252069b17c2f6645.jpg' },

  // PUBG Mobile
  { id: 'pubg-600uc', gameId: 'pubg', name: '600 UC', category: 'UC', price: 15000, image: '' },
  { id: 'pubg-1800uc', gameId: 'pubg', name: '1800 UC', category: 'UC', price: 45000, image: '' },
  { id: 'pubg-3850uc', gameId: 'pubg', name: '3850 UC', category: 'UC', price: 90000, image: '' },

  // Honor of Kings
  { id: 'hok-weekly', gameId: 'hok', name: 'Weekly Pass', category: 'Weekly Passes', price: 3000, image: '' },
  { id: 'hok-monthly', gameId: 'hok', name: 'Monthly Card', category: 'Weekly Passes', price: 10000, image: '' },
  { id: 'hok-500t', gameId: 'hok', name: '500 Tokens', category: 'Tokens', price: 10000, image: '' },
  { id: 'hok-1000t', gameId: 'hok', name: '1000 Tokens', category: 'Tokens', price: 20000, image: '' },
];
