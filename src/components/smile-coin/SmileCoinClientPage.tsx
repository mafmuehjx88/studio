
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';

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
    const { user } = useAuth();
    const router = useRouter();
    const [cart, setCart] = useState<{[key: string]: CartItem}>({});

    const handleQuantityChange = (productId: string, product: Product, delta: number) => {
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

    const handleAddToCart = (product: Product) => {
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
                        <Card key={product.id} className="p-4 bg-card">
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <p className="font-semibold text-foreground">{product.name}</p>
                                    <p className="text-lg font-bold text-primary">{product.price.toLocaleString()} Ks</p>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1">
                                        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleQuantityChange(product.id, product, -1)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            className="h-9 w-14 rounded-md border-input bg-background text-center"
                                            value={quantity}
                                            readOnly
                                        />
                                        <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleQuantityChange(product.id, product, 1)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button className="flex-1" onClick={() => handleAddToCart(product)}>
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
