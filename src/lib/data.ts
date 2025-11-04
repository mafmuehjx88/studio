
import type { Game, Product, SmileCode } from './types';

export const games: Game[] = [
  { id: 'mlbb', name: 'MLBB', image: 'https://i.ibb.co/R47v6TDX/8255033248d018b6c5f3d460b2deec16.jpg', bannerImage: 'https://i.ibb.co/NnNMr8gq/New-Project-85-E9-F449-A.png', needsServerId: true, needsUserIdentifier: true, userIdentifierLabel: 'User ID' },
  { id: 'pubg', name: 'PUBG', image: 'https://i.ibb.co/PsSM1JKc/new3589-516a74d6d701c86c007f668d7cf2891a.jpg', bannerImage: 'https://i.ibb.co/7NGpPr48/7ae05f485fd0725143225238a2ef1cc2.jpg', needsServerId: false, needsUserIdentifier: true, userIdentifierLabel: 'Player ID' },
  { id: 'hok', name: 'HOK', image: 'https://i.ibb.co/PZj5t6PX/new3418-1cff9a1ebb8677d02e5c0d96199b5384.jpg', bannerImage: 'https://i.ibb.co/k3yT8y4/HOK-Banner.jpg', needsServerId: false, needsUserIdentifier: true, userIdentifierLabel: 'Player ID' },
  { id: 'smile-coin', name: 'Smile coin', image: 'https://i.ibb.co/4R3wTGHd/images-1-1.jpg', bannerImage: 'https://i.ibb.co/cCrz0vM/1760334222340-e17f0352-71c1-419b-b0b4-9385d342cc88.png', needsServerId: false, needsUserIdentifier: true, userIdentifierLabel: 'Player ID' },
  { id: 'telegram', name: 'Telegram', image: 'https://i.ibb.co/fVKbf2Bw/01-JZ3-RJE7-RGAM58-RVVTY8-GVBFW.jpg', bannerImage: 'https://i.ibb.co/fVKbf2Bw/01-JZ3-RJE7-RGAM58-RVVTY8-GVBFW.jpg', needsServerId: false, needsUserIdentifier: true, userIdentifierLabel: 'Telegram Link' },
  { id: 'tiktok', name: 'Tiktok', image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png', bannerImage: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png', needsServerId: false, needsUserIdentifier: true, userIdentifierLabel: 'Account/Post Link' },
];

export const products: Product[] = [
  // Mobile Legends - New Data based on user request
  { id: 'twilight-pass', gameId: 'mlbb', name: 'Twilight Pass', category: 'pass', price: 32900, image: 'https://i.ibb.co/spGS17Wr/1760695899008.jpg' },
  { id: 'weekly-pass', gameId: 'mlbb', name: 'Weekly Pass', category: 'pass', price: 5850, image: 'https://i.ibb.co/wZypZFHg/e406adc7efb93d2994b8bfd30b0f25f0.jpg' },
  
  { id: '2x-50', gameId: 'mlbb', name: '50 (2x50) 💎', category: '2x', price: 3400, image: 'https://i.ibb.co/r2GCkBSt/1760334222477-bdd28040-0bd9-4dff-b748-ed7b1a0aecdd.png' },
  { id: '2x-150', gameId: 'mlbb', name: '150 (2x150) 💎', category: '2x', price: 10200, image: 'https://i.ibb.co/SXmLqPqp/1760334222447-c62c5300-1e1f-4f91-90f4-d677eeb054db.png' },
  { id: '2x-250', gameId: 'mlbb', name: '250 (2x250) 💎', category: '2x', price: 17000, image: 'https://i.ibb.co/GfBnfkwr/1760334222388-daa6d2f0-0249-4fa5-bb28-5ce48267c1d8.png' },
  { id: '2x-500', gameId: 'mlbb', name: '500 (2x500) 💎', category: '2x', price: 34000, image: 'https://i.ibb.co/GfBnfkwr/1760334222388-daa6d2f0-0249-4fa5-bb28-5ce48267c1d8.png' },

  { id: 'dm-11', gameId: 'mlbb', name: '11 💎', category: 'diamonds', price: 870, image: 'https://i.ibb.co/YBP7c6wc/1760335241932-2d157ab5-58a3-45e0-9061-7318b1b0415a.png' },
  { id: 'dm-22', gameId: 'mlbb', name: '22 💎', category: 'diamonds', price: 1740, image: 'https://i.ibb.co/YBP7c6wc/1760335241932-2d157ab5-58a3-45e0-9061-7318b1b0415a.png' },
  { id: 'dm-33', gameId: 'mlbb', name: '33 💎', category: 'diamonds', price: 2610, image: 'https://i.ibb.co/YBP7c6wc/1760335241932-2d157ab5-58a3-45e0-9061-7318b1b0415a.png' },
  { id: 'dm-44', gameId: 'mlbb', name: '44 💎', category: 'diamonds', price: 3480, image: 'https://i.ibb.co/YBP7c6wc/1760335241932-2d157ab5-58a3-45e0-9061-7318b1b0415a.png' },
  { id: 'dm-86', gameId: 'mlbb', name: '86 💎', category: 'diamonds', price: 4900, image: 'https://i.ibb.co/GQfMfDhZ/1760335245898-e3d40beb-2e0d-473c-b9ff-be6c797666db.png' },
  { id: 'dm-172', gameId: 'mlbb', name: '172 💎', category: 'diamonds', price: 9800, image: 'https://i.ibb.co/GQfMfDhZ/1760335245898-e3d40beb-2e0d-473c-b9ff-be6c797666db.png' },
  { id: 'dm-257', gameId: 'mlbb', name: '257 💎', category: 'diamonds', price: 14000, image: 'https://i.ibb.co/GQfMfDhZ/1760335245898-e3d40beb-2e0d-473c-b9ff-be6c797666db.png' },
  { id: 'dm-343', gameId: 'mlbb', name: '343 💎', category: 'diamonds', price: 18800, image: 'https://i.ibb.co/8g3fNvzk/1760335245056-efd05219-8413-4d21-b8be-79d49af43c09.png' },
  { id: 'dm-429', gameId: 'mlbb', name: '429 💎', category: 'diamonds', price: 23600, image: 'https://i.ibb.co/8g3fNvzk/1760335245056-efd05219-8413-4d21-b8be-79d49af43c09.png' },
  { id: 'dm-514', gameId: 'mlbb', name: '514 💎', category: 'diamonds', price: 28500, image: 'https://i.ibb.co/nsJWJzSK/1760335244496-8ccf974b-354c-4832-a3f4-c194147570f5.png' },
  { id: 'dm-600', gameId: 'mlbb', name: '600 💎', category: 'diamonds', price: 32888, image: 'https://i.ibb.co/nsJWJzSK/1760335244496-8ccf974b-354c-4832-a3f4-c194147570f5.png' },
  { id: 'dm-706', gameId: 'mlbb', name: '706 💎', category: 'diamonds', price: 37700, image: 'https://i.ibb.co/SwpNnDqk/1760335244180-fc886416-22a7-4a63-9166-5e66419a58c4.png' },
  { id: 'dm-963', gameId: 'mlbb', name: '963 💎', category: 'diamonds', price: 51500, image: 'https://i.ibb.co/SwpNnDqk/1760335244180-fc886416-22a7-4a63-9166-5e66419a58c4.png' },
  { id: 'dm-1049', gameId: 'mlbb', name: '1049 💎', category: 'diamonds', price: 57268, image: 'https://i.ibb.co/SwpNnDqk/1760335244180-fc886416-22a7-4a63-9166-5e66419a58c4.png' },
  { id: 'dm-2098', gameId: 'mlbb', name: '2,098 💎', category: 'diamonds', price: 114536, image: 'https://i.ibb.co/BV24zqgV/1735899441907-5000or-More-MLBB-Diamonds.png' },
  { id: 'dm-3147', gameId: 'mlbb', name: '3,147 💎', category: 'diamonds', price: 171804, image: 'https://i.ibb.co/BV24zqgV/1735899441907-5000or-More-MLBB-Diamonds.png' },
  { id: 'dm-4196', gameId: 'mlbb', name: '4,196 💎', category: 'diamonds', price: 229072, image: 'https://i.ibb.co/BV24zqgV/1735899441907-5000or-More-MLBB-Diamonds.png' },


  // PUBG Mobile
  { id: 'pubg-60uc', gameId: 'pubg', name: '60 UC', category: 'UC', price: 3950, image: 'https://i.ibb.co/tTF4140T/60-PUBG-UC.png' },
  { id: 'pubg-120uc', gameId: 'pubg', name: '120 UC', category: 'UC', price: 7900, image: 'https://i.ibb.co/tTF4140T/60-PUBG-UC.png' },
  { id: 'pubg-180uc', gameId: 'pubg', name: '180 UC', category: 'UC', price: 11850, image: 'https://i.ibb.co/fGCFFh5y/325-PUBG-UC.png' },
  { id: 'pubg-300uc', gameId: 'pubg', name: '300 UC', category: 'UC', price: 19750, image: 'https://i.ibb.co/fGCFFh5y/325-PUBG-UC.png' },
  { id: 'pubg-360uc', gameId: 'pubg', name: '360 UC', category: 'UC', price: 23700, image: 'https://iibb.co/fGCFFh5y/325-PUBG-UC.png' },
  { id: 'pubg-480uc', gameId: 'pubg', name: '480 UC', category: 'UC', price: 31600, image: 'https://i.ibb.co/hFxsWsVs/660-PUBG-UC.png' },
  { id: 'pubg-660uc', gameId: 'pubg', name: '660 UC', category: 'UC', price: 43450, image: 'https://i.ibb.co/hFxsWsVs/660-PUBG-UC.png' },
  { id: 'pubg-1800uc', gameId: 'pubg', name: '1800 UC', category: 'UC', price: 118500, image: 'https://i.ibb.co/8DW7Hp5L/3850-PUBG-UC.png' },
  { id: 'pubg-3850uc', gameId: 'pubg', name: '3850 UC', category: 'UC', price: 252800, image: 'https://i.ibb.co/KjqwNXDG/8100-PUBG-UC.png' },
  { id: 'pubg-8100uc', gameId: 'pubg', name: '8100 UC', category: 'UC', price: 533250, image: 'https://i.ibb.co/KjqwNXDG/8100-PUBG-UC.png' },

  // HOK - No products yet

  // Telegram
  { id: 'telegram-premium-1y', gameId: 'telegram', name: 'Premium 1 Yrs', category: 'Premium', price: 118500, image: 'https://i.ibb.co/fVKbf2Bw/01-JZ3-RJE7-RGAM58-RVVTY8-GVBFW.jpg'},
  { id: 'telegram-premium-3m', gameId: 'telegram', name: 'Premium 3 M', category: 'Premium', price: 49000, image: 'https://i.ibb.co/fVKbf2Bw/01-JZ3-RJE7-RGAM58-RVVTY8-GVBFW.jpg'},
  { id: 'telegram-premium-6m', gameId: 'telegram', name: 'Premium 6 M', category: 'Premium', price: 65000, image: 'https://i.ibb.co/fVKbf2Bw/01-JZ3-RJE7-RGAM58-RVVTY8-GVBFW.jpg'},
  { id: 'telegram-boost-3m', gameId: 'telegram', name: 'Ch/Gp boost 3M', category: 'Boost', price: 2200, image: 'https://i.ibb.co/fVKbf2Bw/01-JZ3-RJE7-RGAM58-RVVTY8-GVBFW.jpg'},
  { id: 'telegram-boost-6m', gameId: 'telegram', name: 'Ch Boost 6M', category: 'Boost', price: 2700, image: 'https://i.ibb.co/fVKbf2Bw/01-JZ3-RJE7-RGAM58-RVVTY8-GVBFW.jpg'},
  { id: 'telegram-subs-100', gameId: 'telegram', name: 'Subscribers(100)', category: 'Subscribers', price: 1800, image: 'https://i.ibb.co/fVKbf2Bw/01-JZ3-RJE7-RGAM58-RVVTY8-GVBFW.jpg'},
  { id: 'telegram-subs-500', gameId: 'telegram', name: 'Subscribers(500)', category: 'Subscribers', price: 6200, image: 'https://i.ibb.co/fVKbf2Bw/01-JZ3-RJE7-RGAM58-RVVTY8-GVBFW.jpg'},
  { id: 'telegram-subs-1k', gameId: 'telegram', name: 'Subscribers(1K)', category: 'Subscribers', price: 12800, image: 'https://i.ibb.co/fVKbf2Bw/01-JZ3-RJE7-RGAM58-RVVTY8-GVBFW.jpg'},

  // Tiktok - New Data
  { id: 'tiktok-view-1k', gameId: 'tiktok', name: 'View 1K', category: 'Views', price: 200, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-view-5k', gameId: 'tiktok', name: 'View 5K', category: 'Views', price: 900, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-view-10k', gameId: 'tiktok', name: 'View 10K', category: 'Views', price: 1500, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-view-100k', gameId: 'tiktok', name: 'View 100K', category: 'Views', price: 2500, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  
  { id: 'tiktok-like-100', gameId: 'tiktok', name: 'Like 100', category: 'Likes', price: 199, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-like-500', gameId: 'tiktok', name: 'Like 500', category: 'Likes', price: 980, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-like-1k', gameId: 'tiktok', name: 'Like 1K', category: 'Likes', price: 1470, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-like-3k', gameId: 'tiktok', name: 'Like 3K', category: 'Likes', price: 4300, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-like-5k', gameId: 'tiktok', name: 'Like 5K', category: 'Likes', price: 7300, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-like-10k', gameId: 'tiktok', name: 'Like 10K', category: 'Likes', price: 13000, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  
  { id: 'tiktok-followers-100', gameId: 'tiktok', name: 'Followers(100)', category: 'Followers', price: 2600, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-followers-500', gameId: 'tiktok', name: 'Followers(500)', category: 'Followers', price: 12500, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-followers-1k', gameId: 'tiktok', name: 'Followers(1K)', category: 'Followers', price: 25000, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-followers-1usd', gameId: 'tiktok', name: 'Followers(1$)', category: 'Followers', price: 6900, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-followers-2usd', gameId: 'tiktok', name: 'Followers(2$)', category: 'Followers', price: 13800, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-followers-3usd', gameId: 'tiktok', name: 'Followers(3$)', category: 'Followers', price: 21500, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  
  { id: 'tiktok-promote-1', gameId: 'tiktok', name: 'Promote View(1$)', category: 'Promote', price: 6900, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-promote-2', gameId: 'tiktok', name: 'Promote View(2$)', category: 'Promote', price: 13800, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
  { id: 'tiktok-promote-3', gameId: 'tiktok', name: 'Promote View(3$)', category: 'Promote', price: 20700, image: 'https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png' },
];

export const smileCoinProducts: Product[] = [
    // Brazil - Updated Prices & New Product
    { id: 'smile-brl-30', gameId: 'smile-coin', country: 'brazil', name: '30 BRL (300 Smile Coins)', price: 300, image: 'https://i.ibb.co/5x1D58DQ/smilecode-brazil.jpg', category: 'Smile Code'},
    { id: 'smile-brl-100', gameId: 'smile-coin', country: 'brazil', name: '100 BRL (1000 Smile Coins)', price: 1000, image: 'https://i.ibb.co/5x1D58DQ/smilecode-brazil.jpg', category: 'Smile Code'},
    { id: 'smile-brl-500', gameId: 'smile-coin', country: 'brazil', name: '500 BRL (5000 Smile Coins)', price: 5000, image: 'https://i.ibb.co/5x1D58DQ/smilecode-brazil.jpg', category: 'Smile Code'},
    { id: 'smile-brl-1000', gameId: 'smile-coin', country: 'brazil', name: '1000 BRL (10000 Smile Coins)', price: 10000, image: 'https://i.ibb.co/5x1D58DQ/smilecode-brazil.jpg', category: 'Smile Code'},
    // Philippines
    { id: 'smile-php-100', gameId: 'smile-coin', country: 'philippines', name: '100 PHP', price: 100, image: 'https://i.ibb.co/Lf5zjQd/smilecode-philippines.jpg', category: 'Smile Code'},
];

// This is now the source of truth for smile codes.
// Add, edit, or remove codes from this array.
// The purchase logic will automatically handle marking them as "used" in memory.
export const smileCodes: SmileCode[] = [
    { id: 'scbr-001', code: '19298838#1', productId: 'smile-brl-30', productName: '30 BRL (300 Smile Coins)', price: 300, isUsed: false, usedBy: null, usedAt: null, createdAt: new Date().toISOString() },
    { id: 'scbr-002', code: '2883829hdj#2', productId: 'smile-brl-30', productName: '30 BRL (300 Smile Coins)', price: 300, isUsed: false, usedBy: null, usedAt: null, createdAt: new Date().toISOString() },
];


export const smileCoinRegions = [
    {
        id: 'brazil',
        name: 'Smile Code Brazil',
        image: 'https://i.ibb.co/5x1D58DQ/smilecode-brazil.jpg'
    },
    {
        id: 'philippines',
        name: 'Smile Code Philippines',
        image: 'https://i.ibb.co/Lf5zjQd/smilecode-philippines.jpg'
    }
]

export const staticImages = {
    'banner': {
        imageUrl: `https://i.ibb.co/rGbVtRFm/IMG-20251101-154555-872.jpg`,
        description: `Banner for the app`,
        imageHint: `game collage`
    },
    'logo': {
        imageUrl: `https://i.ibb.co/7J7VJBGy/IMG-20251031-090933-686.jpg`,
        description: `Logo image`,
        imageHint: `letter A logo`
    },
    'default-avatar': {
        imageUrl: `https://picsum.photos/seed/default-avatar/400/400`,
        description: `Default user avatar`,
        imageHint: `abstract avatar`
    },
    'legal-banner': {
        imageUrl: `https://picsum.photos/seed/legal/400/400`,
        description: `Banner for legal links`,
        imageHint: `customer service`
    },
    'how-to-use-guide-1': {
        imageUrl: `https://i.ibb.co/YTX1wcRr/IMG-20251103-215753-033.jpg`,
        description: `Guide on how to use the app - Step 1`,
        imageHint: `app tutorial`
    },
    'how-to-use-guide-2': {
        imageUrl: `https://i.ibb.co/dKj1Nqg/how-to-use-guide-2.jpg`,
        description: `Guide on how to use the app - Step 2`,
        imageHint: `app tutorial`
    },
    'how-to-use-guide-3': {
        imageUrl: `https://i.ibb.co/PNY5d7G/how-to-use-guide-3.jpg`,
        description: `Guide on how to use the app - Step 3`,
        imageHint: `app tutorial`
    }
}

    