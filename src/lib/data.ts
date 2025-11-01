import type { Game, Product } from './types';

export const games: Game[] = [
  { id: 'mlbb', name: 'MLBB', image: 'https://i.ibb.co/R47v6TDX/8255033248d018b6c5f3d460b2deec16.jpg', bannerImage: 'https://i.ibb.co/NnNMr8gq/New-Project-85-E9-F449-A.png', needsServerId: true },
  { id: 'pubg', name: 'PUBG', image: 'https://i.ibb.co/XMTZkvX/new3589-516a74d6d701c86c007f668d7cf2891a.jpg', needsServerId: false },
  { id: 'hok', name: 'HOK', image: 'https://i.ibb.co/PZj5t6PX/new3418-1cff9a1ebb8677d02e5c0d96199b5384.jpg', needsServerId: false },
];

export const products: Product[] = [
  // Mobile Legends - New Data based on screenshot
  { id: 'twilight-pass', gameId: 'mlbb', name: 'Twilight Pass', category: 'pass', price: 30342, image: 'https://i.ibb.co/C0qP8b0/twilight-pass.png' },
  { id: 'weekly-pass', gameId: 'mlbb', name: 'Weekly Pass', category: 'pass', price: 5740, image: 'https://i.ibb.co/9vVw2mX/weekly-pass.png' },
  
  { id: '2x-50', gameId: 'mlbb', name: '50+50 အပိုရ', category: '2x', price: 3243, image: 'https://i.ibb.co/VvZv7gM/diamond-pile-1.png' },
  { id: '2x-150', gameId: 'mlbb', name: '150+150 အပိုရ', category: '2x', price: 9372, image: 'https://i.ibb.co/Rbm5y1V/diamond-pile-2.png' },
  { id: '2x-250', gameId: 'mlbb', name: '250+250 အပိုရ', category: '2x', price: 14969, image: 'https://i.ibb.co/Rbm5y1V/diamond-pile-2.png' },
  { id: '2x-500', gameId: 'mlbb', name: '500+500 အပိုရ', category: '2x', price: 30567, image: 'https://i.ibb.co/Q8Q0p6j/diamond-pile-3.png' },

  { id: 'dm-11', gameId: 'mlbb', name: '11 💎 Diamond', category: 'diamonds', price: 500, image: 'https://i.ibb.co/GtnS1gS/diamond-1.png' },
  { id: 'dm-22', gameId: 'mlbb', name: '22 💎 Diamond', category: 'diamonds', price: 1000, image: 'https://i.ibb.co/GtnS1gS/diamond-1.png' },
  { id: 'dm-44', gameId: 'mlbb', name: '44 💎 Diamond', category: 'diamonds', price: 1500, image: 'https://i.ibb.co/GtnS1gS/diamond-1.png' },
  { id: 'dm-59', gameId: 'mlbb', name: '59 💎 Diamond', category: 'diamonds', price: 2000, image: 'https://i.ibb.co/VvZv7gM/diamond-pile-1.png' },
  { id: 'dm-86', gameId: 'mlbb', name: '86 💎 Diamond', category: 'diamonds', price: 2900, image: 'https://i.ibb.co/VvZv7gM/diamond-pile-1.png' },
  { id: 'dm-172', gameId: 'mlbb', name: '172 💎 Diamond', category: 'diamonds', price: 5700, image: 'https://i.ibb.co/Rbm5y1V/diamond-pile-2.png' },
  { id: 'dm-257', gameId: 'mlbb', name: '257 💎 Diamond', category: 'diamonds', price: 8600, image: 'https://i.ibb.co/Rbm5y1V/diamond-pile-2.png' },
  { id: 'dm-344', gameId: 'mlbb', name: '344 💎 Diamond', category: 'diamonds', price: 11400, image: 'https://i.ibb.co/Q8Q0p6j/diamond-pile-3.png' },
  { id: 'dm-429', gameId: 'mlbb', name: '429 💎 Diamond', category: 'diamonds', price: 14300, image: 'https://i.ibb.co/Q8Q0p6j/diamond-pile-3.png' },
  { id: 'dm-514', gameId: 'mlbb', name: '514 💎 Diamond', category: 'diamonds', price: 17200, image: 'https://i.ibb.co/Q8Q0p6j/diamond-pile-3.png' },


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
        imageUrl: `https://i.ibb.co/rGbVtRFm/IMG-20251101-154555-872.jpg`,
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
