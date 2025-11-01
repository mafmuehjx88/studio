export interface Game {
  id: string;
  name: string;
  image: string; // id from placeholder-images.json
  needsServerId: boolean;
}

export interface Product {
  id: string;
  gameId: string;
  name: string;
  category: string;
  price: number;
}

export const games: Game[] = [
  { id: 'mobile-legends', name: 'MLBB', image: 'mobile-legends', needsServerId: true },
  { id: 'pubg-mobile', name: 'PUBG', image: 'pubg-mobile', needsServerId: false },
  { id: 'honor-of-kings', name: 'HOK', image: 'honor-of-kings', needsServerId: false },
];

export const products: Product[] = [
  // Mobile Legends
  { id: 'ml-weekly', gameId: 'mobile-legends', name: 'Weekly Pass', category: 'Weekly Pass', price: 5000 },
  { id: 'ml-100d', gameId: 'mobile-legends', name: '100 Diamonds', category: '2x Diamonds', price: 3000 },
  { id: 'ml-200d', gameId: 'mobile-legends', name: '200 Diamonds', category: '2x Diamonds', price: 6000 },
  { id: 'ml-300d', gameId: 'mobile-legends', name: '300 Diamonds', category: '2x Diamonds', price: 9000 },


  // PUBG Mobile
  { id: 'pubg-rp', gameId: 'pubg-mobile', name: 'Royale Pass', category: 'Passes', price: 25000 },
  { id: 'pubg-600uc', gameId: 'pubg-mobile', name: '600 UC', category: 'UC', price: 15000 },
  { id: 'pubg-1800uc', gameId: 'pubg-mobile', name: '1800 UC', category: 'UC', price: 45000 },
  { id: 'pubg-3850uc', gameId: 'pubg-mobile', name: '3850 UC', category: 'UC', price: 90000 },

  // Honor of Kings
  { id: 'hok-monthly', gameId: 'honor-of-kings', name: 'Monthly Card', category: 'Passes', price: 10000 },
  { id: 'hok-500t', gameId: 'honor-of-kings', name: '500 Tokens', category: 'Tokens', price: 10000 },
  { id: 'hok-1000t', gameId: 'honor-of-kings', name: '1000 Tokens', category: 'Tokens', price: 20000 },
];
