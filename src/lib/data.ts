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
  { id: 'mlbb', name: 'MLBB', image: 'mobile-legends', needsServerId: true },
  { id: 'pubg', name: 'PUBG', image: 'pubg-mobile', needsServerId: false },
  { id: 'hok', name: 'HOK', image: 'honor-of-kings', needsServerId: false },
];

export const products: Product[] = [
  // Mobile Legends
  { id: 'ml-weekly', gameId: 'mlbb', name: 'Weekly Pass', category: 'Weekly Pass', price: 5000 },
  { id: 'ml-100d', gameId: 'mlbb', name: '100 Diamonds', category: '2x Diamonds', price: 3000 },
  { id: 'ml-200d', gameId: 'mlbb', name: '200 Diamonds', category: '2x Diamonds', price: 6000 },
  { id: 'ml-300d', gameId: 'mlbb', name: '300 Diamonds', category: '2x Diamonds', price: 9000 },
  { id: 'ml-500d', gameId: 'mlbb', name: '500 Diamonds', category: 'Other Diamonds', price: 15000 },
  { id: 'ml-1000d', gameId: 'mlbb', name: '1000 Diamonds', category: 'Other Diamonds', price: 30000 },


  // PUBG Mobile
  { id: 'pubg-600uc', gameId: 'pubg', name: '600 UC', category: 'UC', price: 15000 },
  { id: 'pubg-1800uc', gameId: 'pubg', name: '1800 UC', category: 'UC', price: 45000 },
  { id: 'pubg-3850uc', gameId: 'pubg', name: '3850 UC', category: 'UC', price: 90000 },

  // Honor of Kings
  { id: 'hok-weekly', gameId: 'hok', name: 'Weekly Pass', category: 'Weekly Passes', price: 3000 },
  { id: 'hok-monthly', gameId: 'hok', name: 'Monthly Card', category: 'Weekly Passes', price: 10000 },
  { id: 'hok-500t', gameId: 'hok', name: '500 Tokens', category: 'Tokens', price: 10000 },
  { id: 'hok-1000t', gameId: 'hok', name: '1000 Tokens', category: 'Tokens', price: 20000 },
];
