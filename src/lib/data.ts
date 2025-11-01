import type { Game, Product } from './types';

export const games: Game[] = [
  { id: 'mlbb', name: 'MLBB', image: 'https://i.ibb.co/R47v6TDX/8255033248d018b6c5f3d460b2deec16.jpg', needsServerId: true },
  { id: 'pubg', name: 'PUBG', image: 'https://i.ibb.co/XMTZkvX/new3589-516a74d6d701c86c007f668d7cf2891a.jpg', needsServerId: false },
  { id: 'hok', name: 'HOK', image: 'https://picsum.photos/seed/honor-of-kings/600/300', needsServerId: false },
];

export const products: Product[] = [
  // Mobile Legends - New Data
  { id: 'weekly-pass', gameId: 'mlbb', name: 'Weekly Pass', category: 'weekly', price: 5850, image: 'https://picsum.photos/seed/weekly-pass/200/200' },
  { id: 'twilight-pass', gameId: 'mlbb', name: 'Twilight Pass', category: 'weekly', price: 32900, image: 'https://picsum.photos/seed/twilight-pass/200/200' },
  { id: '2x-50', gameId: 'mlbb', name: '50+55💎', category: '2x', price: 2400, image: 'https://picsum.photos/seed/2x-50/200/200' },
  { id: '2x-100', gameId: 'mlbb', name: '100+115💎', category: '2x', price: 4900, image: 'https://picsum.photos/seed/2x-100/200/200' },
  { id: 'dm-12', gameId: 'mlbb', name: '12💎', category: 'diamonds', price: 500, image: 'https://picsum.photos/seed/dm-12/200/200' },
  { id: 'dm-28', gameId: 'mlbb', name: '28💎', category: 'diamonds', price: 1000, image: 'https://picsum.photos/seed/dm-28/200/200' },
  { id: 'dm-44', gameId: 'mlbb', name: '44💎', category: 'diamonds', price: 1500, image: 'https://picsum.photos/seed/dm-44/200/200' },
  { id: 'dm-59', gameId: 'mlbb', name: '59💎', category: 'diamonds', price: 2000, image: 'https://picsum.photos/seed/dm-59/200/200' },
  { id: 'dm-86', gameId: 'mlbb', name: '86💎', category: 'diamonds', price: 2900, image: 'https://picsum.photos/seed/dm-86/200/200' },
  { id: 'dm-172', gameId: 'mlbb', name: '172💎', category: 'diamonds', price: 5700, image: 'https://picsum.photos/seed/dm-172/200/200' },
  { id: 'dm-257', gameId: 'mlbb', name: '257💎', category: 'diamonds', price: 8600, image: 'https://picsum.photos/seed/dm-257/200/200' },
  { id: 'dm-344', gameId: 'mlbb', name: '344💎', category: 'diamonds', price: 11400, image: 'https://picsum.photos/seed/dm-344/200/200' },
  { id: 'dm-429', gameId: 'mlbb', name: '429💎', category: 'diamonds', price: 14300, image: 'https://picsum.photos/seed/dm-429/200/200' },
  { id: 'dm-514', gameId: 'mlbb', name: '514💎', category: 'diamonds', price: 17200, image: 'https://picsum.photos/seed/dm-514/200/200' },

  // PUBG Mobile
  { id: 'pubg-600uc', gameId: 'pubg', name: '600 UC', category: 'UC', price: 15000, image: 'https://picsum.photos/seed/pubg-uc/200/200' },
  { id: 'pubg-1800uc', gameId: 'pubg', name: '1800 UC', category: 'UC', price: 45000, image: 'https://picsum.photos/seed/pubg-uc/200/200' },
  { id: 'pubg-3850uc', gameId: 'pubg', name: '3850 UC', category: 'UC', price: 90000, image: 'https://picsum.photos/seed/pubg-uc/200/200' },

  // Honor of Kings
  { id: 'hok-weekly', gameId: 'hok', name: 'Weekly Pass', category: 'Weekly Passes', price: 3000, image: 'https://picsum.photos/seed/hok-pass/200/200' },
  { id: 'hok-monthly', gameId: 'hok', name: 'Monthly Card', category: 'Weekly Passes', price: 10000, image: 'https://picsum.photos/seed/hok-pass/200/200' },
  { id: 'hok-500t', gameId: 'hok', name: '500 Tokens', category: 'Tokens', price: 10000, image: 'https://picsum.photos/seed/hok-token/200/200' },
  { id: 'hok-1000t', gameId: 'hok', name: '1000 Tokens', category: 'Tokens', price: 20000, image: 'https://picsum.photos/seed/hok-token/200/200' },
];

export const staticImages = {
    'banner': {
        imageUrl: `https://picsum.photos/seed/banner/1200/400`,
        description: `Banner for the app`,
        imageHint: `game collage`
    },
    'logo': {
        imageUrl: `https://picsum.photos/seed/logo/400/400`,
        description: `Logo image`,
        imageHint: `letter A logo`
    },
    'default-avatar': {
        imageUrl: `https://picsum.photos/seed/default-avatar/400/400`,
        description: `Default user avatar`,
        imageHint: `abstract avatar`
    }
}
