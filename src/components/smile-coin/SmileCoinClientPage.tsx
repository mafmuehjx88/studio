
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import WalletBalance from '../layout/WalletBalance';
import { useRouter } from 'next/navigation';

interface SmileCoinProduct {
    id: string;
    name: string;
    price: number;
}

interface SmileCoinClientPageProps {
    region: {
        id: string;
        name: string;
        image: string;
    };
    products: SmileCoinProduct[];
}

interface CartItem extends SmileCoinProduct {
    quantity: number;
}


export default function SmileCoinClientPage({ region, products }: SmileCoinClientPageProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [cart, setCart] = useState<{[key: string]: CartItem}>({});

    const handleQuantityChange = (productId: string, product: SmileCoinProduct, delta: number) => {
        setCart(prevCart => {
            const existingItem = prevCart[productId];
            const newQuantity = (existingItem?.quantity || 0) + delta;

            if (newQuantity < 1) {
                const newCart = { ...prevCart };
                delete newCart[productId];
                return newCart;
            }

            return {
                ...prevCart,
                [productId]: {
                    ...product,
                    quantity: newQuantity,
                }
            };
        });
    };
    
    const getItemQuantity = (productId: string) => {
        return cart[productId]?.quantity || 0;
    }

    const handleAddToCart = (product: SmileCoinProduct) => {
         if (!user) {
            router.push('/login');
            return;
        }
        setCart(prevCart => {
            const existingItem = prevCart[product.id];
            return {
                ...prevCart,
                [product.id]: {
                    ...product,
                    quantity: (existingItem?.quantity || 0) + 1,
                }
            }
        });
    }

    return (
        <div className="bg-white text-black min-h-screen">
            <header className="sticky top-0 z-10 bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Smile Code MM</h1>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <WalletBalance />
                            <Button variant="ghost" size="icon">
                                <ShoppingCart className="h-6 w-6"/>
                                {/* Add cart count here later */}
                            </Button>
                        </>
                    ) : (
                         <Button onClick={() => router.push('/login')}>Login</Button>
                    )}
                </div>
            </header>

            <main className="p-4 space-y-6">
                <Card className="overflow-hidden">
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
                            <Card key={product.id} className="p-4">
                                <div className="flex flex-col space-y-3">
                                    <div>
                                        <p className="font-semibold">{product.name}</p>
                                        <p className="text-lg font-bold text-blue-600">{product.price.toLocaleString()} Ks</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleQuantityChange(product.id, product, -1)}>
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <Input
                                                className="h-9 w-16 rounded-md border-gray-300 text-center"
                                                value={quantity}
                                                readOnly
                                            />
                                            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleQuantityChange(product.id, product, 1)}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleAddToCart(product)}>
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </main>
             {/* Fake footer to match screenshot */}
            <footer className="fixed bottom-0 left-0 right-0 z-10 mx-auto max-w-md bg-white border-t">
                <div className="flex justify-around items-center h-16">
                    <Button variant="ghost" className="flex flex-col h-auto">
                        <span className="text-blue-600 font-bold">Product</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-auto">
                        <span>Top Up</span>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-auto relative">
                        <span>Cart</span>
                        <div className="absolute -top-1 -right-2 bg-yellow-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                            {Object.keys(cart).length}
                        </div>
                    </Button>
                    <Button variant="ghost" className="flex flex-col h-auto">
                        <span>Profile</span>
                    </Button>
                </div>
            </footer>
        </div>
    );
}

