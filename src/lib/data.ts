import type { Game, Product } from './types';

export const games: Game[] = [
  { id: 'mlbb', name: 'MLBB', image: 'mobile-legends', needsServerId: true },
  { id: 'pubg', name: 'PUBG', image: 'pubg-mobile', needsServerId: false },
  { id: 'hok', name: 'HOK', image: 'honor-of-kings', needsServerId: false },
];

// This is now the static definition of products.
// Images are mapped by the `image` field key from Firestore.
export const products: Product[] = [
  // Mobile Legends - New Data
  { id: 'weekly-pass', gameId: 'mlbb', name: 'Weekly Pass', category: 'weekly', price: 5850, image: 'weekly-pass' },
  { id: 'twilight-pass', gameId: 'mlbb', name: 'Twilight Pass', category: 'weekly', price: 32900, image: 'twilight-pass' },
  { id: '2x-50', gameId: 'mlbb', name: '50+55💎', category: '2x', price: 2400, image: '2x-50' },
  { id: '2x-100', gameId: 'mlbb', name: '100+115💎', category: '2x', price: 4900, image: '2x-100' },
  { id: 'dm-12', gameId: 'mlbb', name: '12💎', category: 'diamonds', price: 500, image: 'dm-12' },
  { id: 'dm-28', gameId: 'mlbb', name: '28💎', category: 'diamonds', price: 1000, image: 'dm-28' },
  { id: 'dm-44', gameId: 'mlbb', name: '44💎', category: 'diamonds', price: 1500, image: 'dm-44' },
  { id: 'dm-59', gameId: 'mlbb', name: '59💎', category: 'diamonds', price: 2000, image: 'dm-59' },
  { id: 'dm-86', gameId: 'mlbb', name: '86💎', category: 'diamonds', price: 2900, image: 'dm-86' },
  { id: 'dm-172', gameId: 'mlbb', name: '172💎', category: 'diamonds', price: 5700, image: 'dm-172' },
  { id: 'dm-257', gameId: 'mlbb', name: '257💎', category: 'diamonds', price: 8600, image: 'dm-257' },
  { id: 'dm-344', gameId: 'mlbb', name: '344💎', category: 'diamonds', price: 11400, image: 'dm-344' },
  { id: 'dm-429', gameId: 'mlbb', name: '429💎', category: 'diamonds', price: 14300, image: 'dm-429' },
  { id: 'dm-514', gameId: 'mlbb', name: '514💎', category: 'diamonds', price: 17200, image: 'dm-514' },

  // PUBG Mobile
  { id: 'pubg-600uc', gameId: 'pubg', name: '600 UC', category: 'UC', price: 15000, image: 'pubg-uc' },
  { id: 'pubg-1800uc', gameId: 'pubg', name: '1800 UC', category: 'UC', price: 45000, image: 'pubg-uc' },
  { id: 'pubg-3850uc', gameId: 'pubg', name: '3850 UC', category: 'UC', price: 90000, image: 'pubg-uc' },

  // Honor of Kings
  { id: 'hok-weekly', gameId: 'hok', name: 'Weekly Pass', category: 'Weekly Passes', price: 3000, image: 'hok-pass' },
  { id: 'hok-monthly', gameId: 'hok', name: 'Monthly Card', category: 'Weekly Passes', price: 10000, image: 'hok-pass' },
  { id: 'hok-500t', gameId: 'hok', name: '500 Tokens', category: 'Tokens', price: 10000, image: 'hok-token' },
  { id: 'hok-1000t', gameId: 'hok', name: '1000 Tokens', category: 'Tokens', price: 20000, image: 'hok-token' },
];
