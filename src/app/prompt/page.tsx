"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

const fullPrompt = `### AT Game HUB Application Reconstruction Prompt (Standard Version)

**1. Project Initialization & Core Technologies**

*   **Framework:** Initialize a Next.js 15 project using the App Router.
*   **Language:** Use TypeScript.
*   **Styling:** Set up Tailwind CSS for utility-first styling.
*   **UI Components:** Integrate ShadCN UI library.
*   **Layout:** Create a mobile-first, dark-theme layout. The main container should be centered with a \`max-w-md\` class. The default font should be Poppins.
*   **Backend:** Configure the project to use Firebase for Authentication (Email/Password) and Firestore as the database.
*   **Firebase Configuration:** Use the following Firebase config in \`src/lib/firebase.ts\`:
    \`\`\`typescript
    const firebaseConfig = {
      apiKey: "AIzaSyA93FWGsO63Q8xGprgue4rhJ0Xkqu0vN2A",
      authDomain: "marioapp-a39c5.firebaseapp.com",
      projectId: "marioapp-a39c5",
      storageBucket: "marioapp-a39c5.appspot.com",
      messagingSenderId: "861023932769",
      appId: "1:861023932769:web:28052061e0a9fdc106f520",
      measurementId: "G-TH3MXQ0HDM"
    };
    \`\`\`

**2. Global Styles & Theme (\`src/app/globals.css\`)**

*   Apply the following HSL color variables for the dark theme. The primary colors should be dark blues and near-black, with white/light-gray text and accents.

    \`\`\`css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer base {
      :root {
        --background: 224 71.4% 4.1%;
        --foreground: 210 40% 98%;
        --card: 211 100% 16%;
        --card-foreground: 210 40% 98%;
        --popover: 222.2 84% 4.9%;
        --popover-foreground: 210 40% 98%;
        --primary: 210 40% 98%;
        --primary-foreground: 211 100% 50%;
        --secondary: 217.2 32.6% 17.5%;
        --secondary-foreground: 210 40% 98%;
        --muted: 217.2 32.6% 17.5%;
        --muted-foreground: 215 20.2% 65.1%;
        --accent: 217.2 32.6% 17.5%;
        --accent-foreground: 210 40% 98%;
        --destructive: 0 62.8% 30.6%;
        --destructive-foreground: 210 40% 98%;
        --border: 217.2 32.6% 17.5%;
        --input: 217.2 32.6% 17.5%;
        --ring: 210 40% 98%;
        --radius: 0.5rem;
      }

      .dark {
        /* ... same as :root ... */
      }
    }

    @layer base {
      * { @apply border-border; }
      body { @apply bg-background text-foreground; }
    }
    \`\`\`

**3. Data Structure (\`src/lib/data.ts\` and \`docs/backend.json\`)**

*   Define the data structures for Games, Products, and Static Images in \`src/lib/data.ts\`.
*   **Games Data:**
    *   **MLBB:** id \`mlbb\`, name 'MLBB', image \`https://i.ibb.co/R47v6TDX/8255033248d018b6c5f3d460b2deec16.jpg\`, banner \`https://i.ibb.co/NnNMr8gq/New-Project-85-E9-F449-A.png\`, needs User ID and Server ID.
    *   **PUBG:** id \`pubg\`, name 'PUBG', image \`https://i.ibb.co/PsSM1JKc/new3589-516a74d6d701c86c007f668d7cf2891a.jpg\`, banner \`https://i.ibb.co/7NGpPr48/7ae05f485fd0725143225238a2ef1cc2.jpg\`, needs Player ID.
    *   **Digital Products:** Create a special entry on the homepage named 'Digital Product' with image \`https://i.ibb.co/wFmXwwNg/zproduct.jpg\` that links to a \`/digital-product\` page.
*   **Digital Product Page Data:** This page should statically display two products:
    *   **Telegram:** image \`https://i.ibb.co/fVKbf2Bw/01-JZ3-RJE7-RGAM58-RVVTY8-GVBFW.jpg\`, links to \`/games/telegram\`.
    *   **Tiktok:** image \`https://i.ibb.co/R4ZNmZ0N/01-JZ3-RW989-ZE3-EXHZVG7-BVQJ8-Z.png\`, links to \`/games/tiktok\`.
*   **Product Data:** Define various products for MLBB (Twilight Pass, Weekly Pass, 2x Diamonds, normal Diamonds), PUBG (UC), Telegram (Premium, Boosts, Subscribers), and Tiktok (Views, Likes, Followers, Promote). Prices should be in Burmese Kyat (Ks).
*   **Firestore Structure (\`docs/backend.json\`):**
    *   \`/users/{userId}\`: Stores \`UserProfile\` (username, email, walletBalance, createdAt).
    *   \`/announcements/{announcementId}\`: Stores \`Announcement\` (title, content, createdAt).
    *   \`/settings/marquee\`: Stores \`text\` for the homepage marquee.
    *   \`/users/{userId}/orders/{orderId}\`: Stores order details.
    *   An \`admin\` custom claim (\`boolean\`) in Firebase Auth. The admin email is \`marrci448@gmail.com\`.

**4. Core Functionality & Pages**

*   **Authentication (\`src/contexts/AuthContext.tsx\`):**
    *   Implement an \`AuthProvider\` that manages user state (Firebase user object and Firestore user profile).
    *   It should handle loading states and route protection.
    *   Non-authenticated users can only access Home, Login, Register, and policy pages.
    *   Admin users (email \`marrci448@gmail.com\`) can access the \`/admin\` route.
*   **Home Page (\`src/app/page.tsx\`):**
    *   Display a main banner image.
    *   "ငွေဖြည့်မည်" (Top-Up) and "အော်ဒါများ" (Orders) buttons.
    *   "Website အသုံးပြုနည်း" (How to Use) button.
    *   A scrolling marquee for announcements.
    *   A grid of games (3 columns). Include all games from \`data.ts\` and a special card for "Digital Product".
*   **Top-Up Flow (\`src/app/top-up/page.tsx\`):**
    *   Display a list of admin payment accounts (KBZ Pay, Wave Pay).
    *   Include a "Copy" button for each account number.
    *   Provide fields for the user to enter the top-up \`amount\` and upload a payment \`screenshot\`.
    *   On submission, send the user's name, requested amount, and the screenshot to a Telegram chat for admin approval using a Server Action.
*   **Purchase Flow (\`src/components/game/GameClientPage.tsx\`):**
    *   When a user clicks a product, show a purchase dialog.
    *   The dialog must request necessary info (User ID, Server ID).
    *   It must show the item name, final price, and the user's current wallet balance.
    *   Implement quantity controls (+/-) for specific products like MLBB passes.
    *   On purchase confirmation:
        1.  Deduct the price from the user's \`walletBalance\` in Firestore.
        2.  Create a new document in the \`/users/{userId}/orders\` collection with \`status: 'Pending'\`.
        3.  Send a Telegram notification with order details.
*   **Order History (\`/app/orders/page.tsx\`):**
    *   Display a list of the user's past orders from their Firestore collection.
    *   Show the Item Name and the order Status (Pending, Completed, Failed) with corresponding color-coded badges.
*   **Admin Panel (\`/app/admin/...\`):**
    *   Create a tabbed interface for admin functions.
    *   **Manual Top-Up:** List all users and their main wallet balances. Allow admins to add funds directly.
    *   Other tabs: All Orders (with a button to mark as 'Completed'), Users list, and Content management (for Marquee/Announcements).`;

export default function PromptPage() {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPrompt);
    toast({
      title: 'Prompt Copied!',
      description: 'The full application prompt has been copied to your clipboard.',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Application Reconstruction Prompt</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Full Prompt
            <Button onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Prompt
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm font-mono overflow-x-auto">
            <code>
              {fullPrompt}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
