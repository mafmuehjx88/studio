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
  // Mobile Legends - Updated Price List
  { id: 'ml-wp', gameId: 'mlbb', name: 'Weekly Pass', category: 'Weekly Pass', price: 5850 },
  { id: 'ml-tp', gameId: 'mlbb', name: 'Twilight Pass', category: 'Twilight Pass', price: 32900 },
  { id: 'ml-2x-50', gameId: 'mlbb', name: '50 (2x50) Diamonds', category: '2x Diamonds', price: 3400 },
  { id: 'ml-2x-150', gameId: 'mlbb', name: '150 (2x150) Diamonds', category: '2x Diamonds', price: 10200 },
  { id: 'ml-2x-250', gameId: 'mlbb', name: '250 (2x250) Diamonds', category: '2x Diamonds', price: 17000 },
  { id: 'ml-2x-500', gameId: 'mlbb', name: '500 (2x500) Diamonds', category: '2x Diamonds', price: 34000 },
  { id: 'ml-d-11', gameId: 'mlbb', name: '11 Diamonds', category: 'Other Diamonds', price: 870 },
  { id: 'ml-d-22', gameId: 'mlbb', name: '22 Diamonds', category: 'Other Diamonds', price: 1740 },
  { id: 'ml-d-33', gameId: 'mlbb', name: '33 Diamonds', category: 'Other Diamonds', price: 2610 },
  { id: 'ml-d-44', gameId: 'mlbb', name: '44 Diamonds', category: 'Other Diamonds', price: 3480 },
  { id: 'ml-d-86', gameId: 'mlbb', name: '86 Diamonds', category: 'Other Diamonds', price: 4900 },
  { id: 'ml-d-172', gameId: 'mlbb', name: '172 Diamonds', category: 'Other Diamonds', price: 9800 },
  { id: 'ml-d-257', gameId: 'mlbb', name: '257 Diamonds', category: 'Other Diamonds', price: 14000 },
  { id: 'ml-d-343', gameId: 'mlbb', name: '343 Diamonds', category: 'Other Diamonds', price: 18800 },
  { id: 'ml-d-429', gameId: 'mlbb', name: '429 Diamonds', category: 'Other Diamonds', price: 23600 },
  { id: 'ml-d-514', gameId: 'mlbb', name: '514 Diamonds', category: 'Other Diamonds', price: 28500 },
  { id: 'ml-d-600', gameId: 'mlbb', name: '600 Diamonds', category: 'Other Diamonds', price: 32888 },
  { id: 'ml-d-706', gameId: 'mlbb', name: '706 Diamonds', category: 'Other Diamonds', price: 37700 },
  { id: 'ml-d-963', gameId: 'mlbb', name: '963 Diamonds', category: 'Other Diamonds', price: 51500 },
  { id: 'ml-d-1049', gameId: 'mlbb', name: '1049 Diamonds', category: 'Other Diamonds', price: 57268 },

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
