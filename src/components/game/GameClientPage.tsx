
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import ProductGrid from '@/components/ProductGrid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Info, Loader2, Minus, Plus, ShoppingBag } from 'lucide-react';
import {
  doc,
  addDoc,
  updateDoc,
  increment,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendTelegramNotification } from '@/lib/actions';
import { generateOrderId } from '@/lib/utils';
import type { Game, Product } from '@/lib/types';

interface GameClientPageProps {
    game: Game;
    products: Product[];
}

export default function GameClientPage({ game, products }: GameClientPageProps) {
  const router = useRouter();
  const { userProfile, user } = useAuth();
  const { toast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userGameId, setUserGameId] = useState('');
  const [userServerId, setUserServerId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const isPassProduct = selectedProduct?.category === 'pass';
  const is2xProduct = selectedProduct?.category === '2x';
  const isQuantityChangable = isPassProduct || is2xProduct || selectedProduct?.gameId === 'telegram' || selectedProduct?.gameId === 'tiktok';


  const finalPrice = selectedProduct
    ? isQuantityChangable
      ? selectedProduct.price * quantity
      : selectedProduct.price
    : 0;

  const hasSufficientBalance = userProfile
    ? userProfile.walletBalance >= finalPrice
    : false;

  const handleProductClick = (product: Product) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity when a new product is selected
  };

  const handlePurchase = async () => {
    if (!user || !userProfile || !selectedProduct || !game) return;

    if (game.needsUserIdentifier && !userGameId) {
      toast({
        title: 'Error',
        description: `Please enter your ${game.userIdentifierLabel || 'ID'}.`,
        variant: 'destructive',
      });
      return;
    }

    if (game.needsServerId && !userServerId) {
      toast({
        title: 'Error',
        description: 'Please enter your Server ID.',
        variant: 'destructive',
      });
      return;
    }

    setIsPurchasing(true);
    const userDocRef = doc(db, 'users', user.uid);
    const originalBalance = userProfile.walletBalance;

    try {
      // 1. Deduct balance first
      await updateDoc(userDocRef, {
        walletBalance: increment(-finalPrice),
      });

      // 2. Create order document
      const orderId = generateOrderId();
      const orderData = {
        id: orderId,
        userId: user.uid,
        username: userProfile.username,
        gameId: game.id,
        gameName: game.name,
        itemId: selectedProduct.id,
        itemName: `${selectedProduct.name}${
          isQuantityChangable ? ` (x${quantity})` : ''
        }`,
        price: finalPrice,
        gameUserId: userGameId,
        gameServerId: userServerId || '',
        paymentMethod: 'Wallet',
        status: 'Pending' as const,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, `users/${user.uid}/orders`), orderData);

      // 3. Send notification
      const identifierLabel = game.userIdentifierLabel || 'Game User ID';
      const notificationMessage = `
New Order Received!
----------------------
Order ID: \`${orderId}\`
Game: *${orderData.gameName}*
Item: *${orderData.itemName}*
Price: *${finalPrice.toLocaleString()} Ks*
----------------------
Username: \`${userProfile.username}\`
${identifierLabel}: \`${userGameId}\`
${userServerId ? `Game Server ID: \`${userServerId}\`` : ''}
----------------------
Payment: Wallet
Order Time: ${new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Yangon',
      })}
`;
      await sendTelegramNotification(notificationMessage);

      toast({
        title: "အောင်မြင်ပါတယ်",
        description: "Stock ကုန်နေလို့ ခနစောင့်ပေးပါ 10 မိနစ်အတွင်းအကောင့်ထဲရောက်ပါမယ်",
      });

      setSelectedProduct(null);
      setUserGameId('');
      setUserServerId('');
    } catch (error) {
      console.error('Purchase failed:', error);
      toast({
        title: 'Purchase Failed',
        description:
          'An error occurred. We have restored your balance. Please try again.',
        variant: 'destructive',
      });
      // Rollback balance if order creation failed
      await updateDoc(userDocRef, {
        walletBalance: originalBalance, // Restore to original balance
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const getDialogMessage = () => {
    if (selectedProduct?.gameId === 'telegram') {
      if (selectedProduct.category === 'Premium') {
        return 'ဝယ်မဲ့ Account ရဲ့ Username ပေးရုံပါပဲဗျ။ ကြာချိန် - Fast';
      }
      if (selectedProduct.category === 'Boost') {
        return 'တိုးရမဲ့ Ch ရဲ့ Boost linkပို့ပေးပါ။ ကြာချိန်- Fast';
      }
      if (selectedProduct.category === 'Subscribers') {
        return 'မြန်မာ Name Subscribers / Online ဖြစ်ပါတယ်။ တိုးမဲ့ Channal ရဲ့ Username ပဲလိုအပ်ပါတယ်။ သတိ - စထောင်တာမကြာသေးတဲ့Ch ဆိုရင် Not working. ကြာချိန် - 10min to 5hrs / Just For 1M';
      }
    }
     if (selectedProduct?.gameId === 'tiktok') {
      if (selectedProduct.category === 'Views' || selectedProduct.category === 'Likes') {
        return 'တိုးမဲ့ vd link သာထည့်ပေးပါ။ private accမရပါဘူး။ Official မဟုတ်တာမလို့ တက်မတက် လုံးဝအာမမခံပါဘူးဗျ။';
      }
      if (selectedProduct.category === 'Promote') {
        return 'တကယ်မြန်မာနိုင်ငံက လူတွေမြင်ရအောင် Official Boostလုပ်တာပဲဖြစ်ပါတယ်။ Boost orderတင်တဲ့အခါ တိုးမဲ့ Vd linkပဲပို့ပေးပါ။ Orderတင်ပြီးတာနဲ့ ဒီ Acc ကိုစာပို့ပေးပါ - @mario_official_2079';
      }
       if (selectedProduct.category === 'Followers' && selectedProduct.name.includes('$')) {
        return 'တကယ်မြန်မာနိုင်ငံက လူတွေမြင်ရအောင် Official Boostလုပ်တာပဲဖြစ်ပါတယ်။ Boost orderတင်တဲ့အခါ တိုးမဲ့ Vd linkပဲပို့ပေးပါ။ Orderတင်ပြီးတာနဲ့ ဒီ Acc ကိုစာပို့ပေးပါ - @mario_official_2079';
      }
       if (selectedProduct.category === 'Followers' && !selectedProduct.name.includes('$')) {
        return 'ကိုယ့်တိုးမဲ့ Ch Account Link ကိုပဲထည့်ပေးပါ။ Private accဆိုရင်မရပါဘူး။ Official မဟုတ်တာမလို့ တက်မတက် လုံးဝအာမမခံပါ';
       }
    }
    return 'AT Game Hubတွင် ဝယ်ယူအားပေးသည့် Customersများအားလုံးကို ကျေးဇူးတင်ပါတယ် ခင်ဗျာ။';
  };
  
  const renderProductGrids = () => {
    if (!game) return null;

    if (products.length === 0) {
        return (
            <div className="flex h-[40vh] flex-col items-center justify-center space-y-4 text-center text-white">
                <ShoppingBag className="h-16 w-16 text-white/50" strokeWidth={1} />
                <h2 className="text-xl font-bold">Coming Soon</h2>
                <p className="text-white/70">There are no items available for this game yet.</p>
                 <Button variant="outline" onClick={() => router.back()} className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white">
                    Go Back
                </Button>
            </div>
        );
    }

    // A more generic way to group products by category
    const productGroups: { [key: string]: Product[] } = {};
    products.forEach(p => {
        if (!productGroups[p.category]) {
            productGroups[p.category] = [];
        }
        productGroups[p.category].push(p);
    });

    switch (game.id) {
      case 'mlbb':
        return (
          <>
            <ProductGrid
              title="Weekly Pass & Twilight Pass"
              products={productGroups['pass'] || []}
              onProductClick={handleProductClick}
              gridCols="grid-cols-3"
              titleNumber={1}
            />
            <ProductGrid
              title="2x Diamonds"
              products={productGroups['2x'] || []}
              onProductClick={handleProductClick}
              gridCols="grid-cols-3"
              titleNumber={2}
            />
             <ProductGrid
              title="Other Diamonds"
              products={productGroups['diamonds'] || []}
              onProductClick={handleProductClick}
              gridCols="grid-cols-3"
              titleNumber={3}
            />
          </>
        );
      case 'pubg':
        return (
            <ProductGrid
              title="UC Top-Up"
              products={productGroups['UC'] || []}
              onProductClick={handleProductClick}
              gridCols="grid-cols-3"
            />
        );
      case 'hok':
        // This will now render the 'Coming Soon' message as products are empty.
        return null;
      case 'telegram':
         return (
          <>
            <ProductGrid
                title="Premium"
                products={productGroups['Premium'] || []}
                onProductClick={handleProductClick}
                gridCols="grid-cols-3"
            />
             <ProductGrid
                title="Channel/Group Boost"
                products={productGroups['Boost'] || []}
                onProductClick={handleProductClick}
                gridCols="grid-cols-3"
            />
             <ProductGrid
                title="Subscribers"
                products={productGroups['Subscribers'] || []}
                onProductClick={handleProductClick}
                gridCols="grid-cols-3"
            />
          </>
         );
      case 'tiktok':
         return (
            <>
                <ProductGrid
                    title="Views"
                    products={productGroups['Views'] || []}
                    onProductClick={handleProductClick}
                    gridCols="grid-cols-3"
                />
                <ProductGrid
                    title="Likes"
                    products={productGroups['Likes'] || []}
                    onProductClick={handleProductClick}
                    gridCols="grid-cols-3"
                />
                 <ProductGrid
                    title="Promote"
                    products={productGroups['Promote'] || []}
                    onProductClick={handleProductClick}
                    gridCols="grid-cols-3"
                />
                 <ProductGrid
                    title="Followers"
                    products={productGroups['Followers'] || []}
                    onProductClick={handleProductClick}
                    gridCols="grid-cols-3"
                />
            </>
         );
      default:
         return (
            <ProductGrid
                title="Items"
                products={products}
                onProductClick={handleProductClick}
                gridCols="grid-cols-3"
            />
         )
    }
  };

  return (
    <div className="space-y-6">
      {(game.bannerImage || game.image) && (
        <Image
          src={game.bannerImage || game.image}
          alt={game.name}
          width={600}
          height={300}
          className="aspect-[2/1] w-full rounded-lg object-contain"
          priority
        />
      )}

      {renderProductGrids()}

      <Dialog
        open={!!selectedProduct}
        onOpenChange={(isOpen) => !isOpen && setSelectedProduct(null)}
      >
        <DialogContent className="w-[90vw] max-w-sm rounded-xl bg-white p-0 shadow-xl">
           <DialogHeader className="sr-only">
            <DialogTitle>Purchase Item</DialogTitle>
            <DialogDescription>Complete your purchase</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-5">
            {!hasSufficientBalance && (
              <div className="rounded-lg border-l-4 border-[#DC2626] bg-[#FEE2E2] p-3 text-sm text-[#B91C1C]">
                <p className="font-bold">ငွေလက်ကျန်မလုံလောက်ပါ</p>
                <p>ဝယ်ယူမှုပြုလုပ်ရန် သင့် Wallet ထဲတွင် ငွေဖြည့်သွင်းပါ။{' '}
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[#B91C1C]"
                    onClick={() => router.push('/wallet')}
                  >
                    ဖြည့်ရန်သွားမည်
                  </Button>
                </p>
              </div>
            )}
            
            <h3 className="font-bold text-base text-[#111827]">Account Info</h3>

            <div className="space-y-2.5">
               <Input
                  className="h-10 rounded-md border-[#E5E7EB] bg-gray-100 text-black"
                  value={userProfile?.username || ''}
                  readOnly
                  disabled
                />
             {(game.needsUserIdentifier || game.needsServerId) && (
              <div className="flex gap-2.5">
                {game.needsUserIdentifier && (
                    <Input
                        className="h-10 rounded-md border-[#E5E7EB]"
                        value={userGameId}
                        onChange={(e) => setUserGameId(e.target.value)}
                        placeholder={game.userIdentifierLabel || 'User ID'}
                        required
                    />
                )}
                {game.needsServerId && (
                  <Input
                    className="h-10 rounded-md border-[#E5E7EB]"
                    value={userServerId}
                    onChange={(e) => setUserServerId(e.target.value)}
                    placeholder="Server ID"
                  />
                )}
              </div>
             )}
            </div>


            <div className="flex h-[45px] items-center justify-between rounded-md bg-[#F3F4F6] p-2.5 text-sm">
                <span className="text-[#111827]">{selectedProduct?.name}{isQuantityChangable ? ` (x${quantity})` : ''}</span>
                <span className="font-bold text-[#111827]">{finalPrice.toLocaleString()} Ks</span>
            </div>

            {isQuantityChangable && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  className="h-9 w-16 rounded-md border-[#D1D5DB] text-center"
                  value={quantity}
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                   className="h-9 w-9"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex h-[45px] items-center rounded-md border-l-4 border-[#3B82F6] bg-[#DBEAFE] p-3 text-sm">
               <Info className="mr-2 h-4 w-4 text-[#3B82F6]" />
               <span className="text-gray-600">Your Balance:</span>
               <span className="ml-1 font-semibold text-gray-800">{userProfile?.walletBalance.toLocaleString() ?? 0} Ks</span>
            </div>

            <p className="text-center text-sm font-semibold text-red-600">
              {getDialogMessage()}
            </p>

            <div className="flex justify-between text-lg font-bold text-[#111827]">
              <span>Total</span>
              <span>{finalPrice.toLocaleString()} Ks</span>
            </div>
            
          </div>
          <div className="flex gap-2.5 bg-gray-50 px-5 py-3">
            <Button
              variant="outline"
              onClick={() => setSelectedProduct(null)}
              disabled={isPurchasing}
              className="h-[42px] w-full rounded-md border-[#D1D5DB] bg-white text-sm font-bold text-[#111827]"
            >
              မဝယ်သေးပါ
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={!hasSufficientBalance || isPurchasing}
              className="h-[42px] w-full rounded-md bg-[#10B981] text-sm font-bold text-white hover:bg-green-600"
            >
              {isPurchasing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              ဝယ်မည်
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    

    




    

    