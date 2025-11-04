
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Coins, Loader2, Minus, Plus, ShoppingCart, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { Product, SmileCode } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useToast } from '@/hooks/use-toast';
import { doc, writeBatch, collection, serverTimestamp, increment, query, where, getDocs, limit, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendTelegramNotification } from '@/lib/actions';
import { generateOrderId } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';

interface SmileCoinClientPageProps {
    region: {
        id: string;
        name: string;
        image: string;
    };
    products: Product[];
}

interface CartItem extends Product {
    quantity: number;
}

export default function SmileCoinClientPage({ region, products }: SmileCoinClientPageProps) {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const smileCoinBalance = userProfile?.smileCoinBalance ?? 0;

    const handleQuantityChange = (product: Product, delta: number) => {
        setCart(prevCart => {
            const existingItem = prevCart[product.id];
            const newQuantity = (existingItem?.quantity || 0) + delta;

            if (newQuantity < 1) {
                const newCart = { ...prevCart };
                delete newCart[product.id];
                return newCart;
            }

            return {
                ...prevCart,
                [product.id]: {
                    ...product,
                    quantity: newQuantity,
                }
            };
        });
    };

    const getItemQuantity = (productId: string) => {
        return cart[productId]?.quantity || 0;
    };

    const handleAddToCart = (product: Product) => {
        if (!user) {
            router.push('/login');
            return;
        }
        handleQuantityChange(product, 1);
        toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
        });
    };

    const cartItems = Object.values(cart);
    const totalCartPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const hasSufficientBalance = smileCoinBalance >= totalCartPrice;

    const handleSubmitOrder = async () => {
        if (!user || !userProfile) {
            toast({ title: "Please login to purchase.", variant: "destructive" });
            return;
        }
        if (cartItems.length === 0) {
            toast({ title: "Your cart is empty.", variant: "destructive" });
            return;
        }
        if (!hasSufficientBalance) {
            toast({ title: "Insufficient Smile Coin balance.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);

        try {
            const orderId = generateOrderId();
            const orderTimestamp = serverTimestamp();
            
            let assignedCode: SmileCode | null = null;
            let finalPrice = 0;
            let finalItemName = "";

            const itemToPurchase = cartItems[0];
            finalPrice = itemToPurchase.price * itemToPurchase.quantity;
            finalItemName = `${itemToPurchase.name} (x${itemToPurchase.quantity})`;


            await runTransaction(db, async (transaction) => {
                if (!itemToPurchase) {
                  throw new Error("Cart is empty. Please add an item to purchase.");
                }

                // 1. Find an unused code for the product ID
                const codesRef = collection(db, 'smileCodes');
                const q = query(codesRef, where('productId', '==', itemToPurchase.id), where('isUsed', '==', false), limit(1));
                
                const codesSnapshot = await transaction.get(q);

                if (codesSnapshot.empty) {
                    throw new Error(`Code ကုန်နေပါသည်။ Admin အနေနဲ့ အမြန်ဆုံးပြန်ထည့်ပေးပါမည်။`);
                }

                // 2. Get the code and mark it as used
                const codeDoc = codesSnapshot.docs[0];
                assignedCode = { ...codeDoc.data(), id: codeDoc.id } as SmileCode;
                transaction.update(codeDoc.ref, {
                    isUsed: true,
                    usedBy: user.uid,
                    usedAt: serverTimestamp() // Use server timestamp for accuracy
                });

                // 3. Deduct smileCoinBalance from user
                const userDocRef = doc(db, 'users', user.uid);
                transaction.update(userDocRef, {
                    smileCoinBalance: increment(-finalPrice)
                });
                
                // 4. Create the order document
                const orderDocRef = doc(db, `users/${user.uid}/orders`, orderId);
                 transaction.set(orderDocRef, {
                    id: orderId,
                    userId: user.uid,
                    username: userProfile.username,
                    gameId: 'smile-coin',
                    gameName: region.name,
                    itemId: itemToPurchase.id,
                    itemName: finalItemName,
                    price: finalPrice,
                    paymentMethod: 'SmileCoin Wallet',
                    status: 'Completed' as const, // Mark as completed since code is given
                    createdAt: orderTimestamp,
                    smileCode: assignedCode.code, // Store the code in the order!
                });
            });

            // 5. If transaction is successful, send notification and redirect
             if (assignedCode) {
                const notificationMessage = `
 SMILE COIN Order! 🪙
----------------------
Order ID: \`${orderId}\`
Game: *${region.name}*
Item: *${finalItemName}*
Total Price: *${finalPrice.toLocaleString()} Coins*
----------------------
Username: \`${userProfile.username}\`
----------------------
Code: \`${assignedCode.code}\`
----------------------
Payment: SmileCoin Wallet
Order Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' })}`;

                await sendTelegramNotification(notificationMessage);

                toast({
                    title: "Order Submitted!",
                    description: "Your Smile Coin order has been placed successfully.",
                });

                // Redirect to the new order details page
                router.push(`/orders/${orderId}`);
            } else {
                 throw new Error("Could not assign a code.");
            }

            setCart({});
            setIsCartOpen(false);

        } catch (error: any) {
            console.error("Order submission failed:", error);
            toast({
                title: "Order Failed",
                description: error.message || "An error occurred. Please check your balance and try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-bold">{region.name}</h1>
            </div>

            <Card className="overflow-hidden bg-card">
                <Image
                    src={region.image}
                    alt={region.name}
                    width={600}
                    height={300}
                    className="w-full object-contain"
                />
            </Card>

            <div className="space-y-4">
                {products.map((product) => {
                    const quantity = getItemQuantity(product.id);
                    return (
                        <Card key={product.id} className="p-3 bg-card">
                            <div className="flex flex-col space-y-3">
                                <div>
                                    <p className="font-semibold text-foreground">{product.name}</p>
                                    <p className="text-lg font-bold text-yellow-400">{product.price.toLocaleString()}</p>
                                </div>
                                {quantity > 0 ? (
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleQuantityChange(product, -1)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            className="h-9 w-14 rounded-md border-input bg-background text-center"
                                            value={quantity}
                                            readOnly
                                        />
                                        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleQuantityChange(product, 1)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button className="w-full" onClick={() => handleAddToCart(product)}>
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Add to Cart
                                    </Button>
                                )}
                            </div>
                        </Card>
                    )
                })}
            </div>

            {cartItems.length > 0 && (
                <div className="fixed bottom-16 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
                    <Button className="w-full h-12 text-lg shadow-lg" onClick={() => setIsCartOpen(true)}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        View Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                    </Button>
                </div>
            )}

            <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                <DialogContent className="w-[90vw] max-w-sm rounded-xl bg-white p-0 shadow-xl">
                    <DialogHeader className="p-5 pb-0">
                        <DialogTitle>သင်၏ Smile Coin Cart</DialogTitle>
                        <DialogDescription>
                            အောက်တွင် သင်ဝယ်ယူမည့်ပစ္စည်းများကို စစ်ဆေးပါ။
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 p-5">
                        <div className="flex items-center rounded-md border-l-4 border-yellow-400 bg-yellow-400/10 p-3 text-sm">
                           <Coins className="mr-2 h-4 w-4 text-yellow-500" />
                           <span className="text-gray-600">သင်၏လက်ကျန်ငွေ:</span>
                           <span className="ml-1 font-semibold text-gray-800">{smileCoinBalance.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="max-h-48 space-y-3 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                    <div className='flex-1'>
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} x {item.price.toLocaleString()}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900">{(item.quantity * item.price).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                            <span>စုစုပေါင်း</span>
                            <span>{totalCartPrice.toLocaleString()}</span>
                        </div>
                         {!hasSufficientBalance && (
                            <p className="text-center text-sm font-semibold text-red-600">
                                သင်၏ Smile Coin လက်ကျန်ငွေ မလုံလောက်ပါ။
                            </p>
                        )}
                    </div>
                    <DialogFooter className="flex-col space-y-2 bg-gray-50 px-5 py-3">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button
                                    disabled={!hasSufficientBalance || isSubmitting || cartItems.length === 0}
                                    className="h-[42px] w-full"
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    ဝယ်ယူမည်
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>ဝယ်ယူမှာ သေချာပါသလား?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    သင်၏ Smile Coin {totalCartPrice.toLocaleString()} ကို အသုံးပြု၍ ဝယ်ယူတော့မှာဖြစ်ပါတယ်။ ဒီလုပ်ဆောင်ချက်ကို နောက်ပြန်ပြင်လို့မရပါ။
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>မဝယ်တော့ပါ</AlertDialogCancel>
                                <AlertDialogAction onClick={handleSubmitOrder}>အတည်ပြုသည်</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button
                            variant="outline"
                            onClick={() => setIsCartOpen(false)}
                            disabled={isSubmitting}
                            className="h-[42px] w-full"
                        >
                            မဝယ်သေးပါ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

    