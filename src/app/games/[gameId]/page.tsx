
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { products as allProducts, games as allGames } from '@/lib/data';
import ProductGrid from '@/components/ProductGrid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Info, Loader2, Minus, Plus } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import type { Game, Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export async function generateStaticParams() {
  return allGames.map((game) => ({
    gameId: game.id,
  }));
}

export default function GameItemsPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile, user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const gameId = params.gameId as string;

  const [game, setGame] = useState<Game | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userGameId, setUserGameId] = useState('');
  const [userServerId, setUserServerId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (!gameId) return;

    setDataLoading(true);
    const currentGame = allGames.find((g) => g.id === gameId) || null;
    const gameProducts = allProducts.filter((p) => p.gameId === gameId);

    setGame(currentGame);
    setProducts(gameProducts);
    setDataLoading(false);
  }, [gameId]);

  const isPassProduct = selectedProduct?.category === 'pass';
  const is2xProduct = selectedProduct?.category === '2x';

  const finalPrice = selectedProduct
    ? isPassProduct || is2xProduct
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

    if (!userGameId) {
      toast({
        title: 'Error',
        description: 'Please enter your Game ID.',
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
        gameId: gameId,
        gameName: game.name,
        itemId: selectedProduct.id,
        itemName: `${selectedProduct.name}${
          isPassProduct || is2xProduct ? ` (x${quantity})` : ''
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
      const notificationMessage = `
New Order Received!
----------------------
Order ID: \`${orderId}\`
Game: *${orderData.gameName}*
Item: *${orderData.itemName}*
Price: *${finalPrice.toLocaleString()} Ks*
----------------------
Username: \`${userProfile.username}\`
Game User ID: \`${userGameId}\`
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
  
    const renderProductGrids = () => {
    if (!game) return null;

    const passes = products.filter(p => p.category === 'pass');
    const diamonds2x = products.filter(p => p.category === '2x');
    const otherDiamonds = products.filter(p => p.category === 'diamonds');

    switch (game.id) {
      case 'mlbb':
        return (
          <>
            <ProductGrid
              title="Weekly Pass & Twilight Pass"
              products={passes}
              onProductClick={handleProductClick}
              gridCols="grid-cols-2"
              titleNumber={1}
            />
            <ProductGrid
              title="2x Diamonds"
              products={diamonds2x}
              onProductClick={handleProductClick}
              gridCols="grid-cols-3"
              titleNumber={2}
            />
             <ProductGrid
              title="Other Diamonds"
              products={otherDiamonds}
              onProductClick={handleProductClick}
              gridCols="grid-cols-3"
              titleNumber={3}
            />
          </>
        );
      case 'pubg':
        return (
          <>
            <ProductGrid
              title="UC Top-Up"
              products={products.filter((p) => p.category === 'UC')}
              onProductClick={handleProductClick}
              gridCols="grid-cols-3"
            />
          </>
        );
      case 'hok':
        return (
          <>
             <ProductGrid
              title="Weekly Passes"
              products={products.filter((p) => p.category === 'Weekly Passes')}
              onProductClick={handleProductClick}
              gridCols="grid-cols-2"
            />
            <ProductGrid
              title="Tokens"
              products={products.filter((p) => p.category === 'Tokens')}
              onProductClick={handleProductClick}
              gridCols="grid-cols-2"
            />
          </>
        );
      default:
         return (
            <ProductGrid
                title="Items"
                products={products}
                onProductClick={handleProductClick}
                gridCols="grid-cols-2"
            />
         )
    }
  };


  if (authLoading || dataLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="aspect-[2/1] w-full rounded-lg" />
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Game Not Found</h1>
        <p className="text-muted-foreground">
          The game you are looking for does not exist.
        </p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

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
              <div className="flex gap-2.5">
                <Input
                  className="h-10 rounded-md border-[#E5E7EB]"
                  value={userGameId}
                  onChange={(e) => setUserGameId(e.target.value)}
                  placeholder="Game ID"
                  required
                />
                {game.needsServerId && (
                  <Input
                    className="h-10 rounded-md border-[#E5E7EB]"
                    value={userServerId}
                    onChange={(e) => setUserServerId(e.target.value)}
                    placeholder="Server ID"
                  />
                )}
              </div>
            </div>


            <div className="flex h-[45px] items-center justify-between rounded-md bg-[#F3F4F6] p-2.5 text-sm">
                <span className="text-[#111827]">{selectedProduct?.name}{isPassProduct || is2xProduct ? ` (x${quantity})` : ''}</span>
                <span className="font-bold text-[#111827]">{finalPrice.toLocaleString()} Ks</span>
            </div>

            {(isPassProduct || is2xProduct) && (
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

            <p className="text-center text-sm font-semibold text-green-600">
                AT Game Hubတွင် ဝယ်ယူအားပေးသည့် Customersများအားလုံးကို ကျေးဇူးတင်ပါတယ် ခင်ဗျာ။
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
