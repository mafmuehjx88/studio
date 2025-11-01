'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { products as allProducts, Product } from '@/lib/data';
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
import { AlertCircle, Loader2, Minus, Plus } from 'lucide-react';
import {
  doc,
  addDoc,
  updateDoc,
  increment,
  collection,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendTelegramNotification } from '@/lib/actions';
import { generateOrderId } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { Game } from '@/lib/types';

export default function GameItemsPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile, user, loading } = useAuth();
  const { toast } = useToast();

  const [gameData, setGameData] = useState<{game: Game | null, bannerUrl: string | null}>({ game: null, bannerUrl: null });
  const [dataLoading, setDataLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userGameId, setUserGameId] = useState('');
  const [userServerId, setUserServerId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const gameId = params.gameId as string;

  useEffect(() => {
    if (!gameId) return;

    const fetchGameData = async () => {
      setDataLoading(true);
      try {
        const gameDocRef = doc(db, "games", gameId);
        const gameDoc = await getDoc(gameDocRef);
        
        let fetchedGame: Game | null = null;
        if (gameDoc.exists()) {
          fetchedGame = { id: gameDoc.id, ...gameDoc.data() } as Game;
        }

        const imagesDocRef = doc(db, "settings", "placeholderImages");
        const imagesDoc = await getDoc(imagesDocRef);
        let bannerUrl: string | null = null;
        if (imagesDoc.exists() && fetchedGame) {
           bannerUrl = imagesDoc.data().images[fetchedGame.image]?.imageUrl || null;
        }
        
        setGameData({ game: fetchedGame, bannerUrl });
      } catch (error) {
        console.error("Error fetching game data:", error);
        toast({ title: "Error", description: "Could not load game data.", variant: "destructive" });
      } finally {
        setDataLoading(false);
      }
    };

    fetchGameData();
  }, [gameId, toast]);


  const products = useMemo(
    () => allProducts.filter((p) => p.gameId === gameId),
    [gameId]
  );
  
  const { game, bannerUrl } = gameData;

  const isPassProduct =
    selectedProduct?.category.toLowerCase().includes('pass') ||
    selectedProduct?.category.toLowerCase().includes('card') ||
    selectedProduct?.category.toLowerCase().includes('weekly');

  const totalPrice = selectedProduct
    ? isPassProduct
      ? selectedProduct.price * quantity
      : selectedProduct.price
    : 0;
  const hasSufficientBalance = userProfile
    ? userProfile.walletBalance >= totalPrice
    : false;

  const handleProductClick = (product: Product) => {
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
        walletBalance: increment(-totalPrice),
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
          isPassProduct ? ` (x${quantity})` : ''
        }`,
        price: totalPrice,
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
Price: *${totalPrice.toLocaleString()} Ks*
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
        title: 'Purchase Successful!',
        description: `Your order for ${orderData.itemName} has been placed.`,
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

    switch (game.id) {
      case 'mlbb':
        return (
          <>
            <ProductGrid
              title="Passes"
              products={products.filter((p) => p.category === 'weekly')}
              onProductClick={handleProductClick}
            />
            <ProductGrid
              title="First Recharge Bonus"
              products={products.filter((p) => p.category === '2x')}
              onProductClick={handleProductClick}
            />
             <ProductGrid
              title="Diamonds"
              products={products.filter((p) => p.category === 'diamonds')}
              onProductClick={handleProductClick}
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
            />
            <ProductGrid
              title="Tokens"
              products={products.filter((p) => p.category === 'Tokens')}
              onProductClick={handleProductClick}
            />
          </>
        );
      default:
        return <p>No products available for this game.</p>;
    }
  };

  if (loading || dataLoading) {
      return (
          <div className="space-y-6">
              <Skeleton className="aspect-[2/1] w-full rounded-lg" />
              <Skeleton className="h-8 w-1/3" />
              <div className="grid grid-cols-3 gap-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="aspect-square w-full rounded-lg" />
              </div>
          </div>
      )
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
      {bannerUrl && (
        <Image
          src={bannerUrl}
          alt={game.name}
          width={600}
          height={300}
          className="aspect-[2/1] w-full rounded-lg object-cover"
          priority
        />
      )}

      {renderProductGrids()}

      <Dialog
        open={!!selectedProduct}
        onOpenChange={(isOpen) => !isOpen && setSelectedProduct(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>အချက်အလက်များဖြည့်သွင်းပါ</DialogTitle>
            <DialogDescription>
              ကျေးဇူးပြု၍ သင်၏ဂိမ်းအချက်အလက်များကို မှန်ကန်စွာ
              ဖြည့်သွင်းပါ။
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {!hasSufficientBalance && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>ငွေလက်ကျန်မလုံလောက်ပါ</AlertTitle>
                <AlertDescription>
                  ဝယ်ယူမှုပြုလုပ်ရန် သင့် Wallet ထဲတွင် ငွေဖြည့်သွင်းပါ။{' '}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => router.push('/wallet')}
                  >
                    ဖြည့်ရန်သွားမည်
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
              <span className="text-muted-foreground">Your Balance:</span>
              <span className="font-semibold text-primary">
                {userProfile?.walletBalance.toLocaleString() ?? 0} Ks
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={userProfile?.username || ''}
                readOnly
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="game-id">Game ID</Label>
              <Input
                id="game-id"
                value={userGameId}
                onChange={(e) => setUserGameId(e.target.value)}
                placeholder="Enter your game user ID"
                required
              />
            </div>
            {game.needsServerId && (
              <div className="space-y-2">
                <Label htmlFor="server-id">Server ID</Label>
                <Input
                  id="server-id"
                  value={userServerId}
                  onChange={(e) => setUserServerId(e.target.value)}
                  placeholder="Enter server ID if needed"
                />
              </div>
            )}

            {isPassProduct && (
              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    className="w-16 text-center"
                    value={quantity}
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2 rounded-lg border p-4">
              <h3 className="font-semibold">Order Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {selectedProduct?.name}
                  {isPassProduct && ` (x${quantity})`}
                </span>
                <span className="font-medium">
                  {totalPrice.toLocaleString()} Ks
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{totalPrice.toLocaleString()} Ks</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedProduct(null)}
              disabled={isPurchasing}
            >
              မဝယ်သေးပါ
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={!hasSufficientBalance || isPurchasing}
            >
              {isPurchasing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              ဝယ်မည်
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
