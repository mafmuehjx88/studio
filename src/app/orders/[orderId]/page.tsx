
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function OrderDetailsPage() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const orderRef = doc(db, `users/${user.uid}/orders`, orderId);
        const docSnap = await getDoc(orderRef);

        if (docSnap.exists()) {
          setOrder({ ...docSnap.data(), id: docSnap.id } as Order);
        } else {
          setOrder(null); // Triggers notFound
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, authLoading, router]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Code Copied!',
      description: 'The code has been copied to your clipboard.',
    });
  };

  if (loading || authLoading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-32" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-6 w-1/2" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
        </div>
    );
  }

  if (!order) {
    return notFound();
  }

  // We only expect Smile Coin orders to land here.
  if (order.gameId !== 'smile-coin') {
      return notFound();
  }

  const codes = order.smileCode?.split(',').map(c => c.trim()) || [];

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      <Card className="bg-card">
        <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <CardTitle className="text-2xl pt-2">Purchase Successful!</CardTitle>
          <CardDescription>Your Smile Coin code(s) are ready.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="rounded-lg border bg-secondary p-4 text-center">
                <p className="text-sm text-muted-foreground">{order.itemName}</p>
                <p className="text-2xl font-bold text-yellow-400">{order.price.toLocaleString()} Coins</p>
            </div>
            
            <div className='space-y-3'>
                {codes.map((code, index) => (
                    <div key={index} className="relative rounded-lg border-2 border-dashed border-primary bg-primary/10 p-4 text-center">
                        <p className="text-sm font-semibold text-primary">Your Code #{index + 1}</p>
                        <p className="text-xl font-bold font-mono break-words text-primary my-2">
                            {code}
                        </p>
                        <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleCopy(code)}
                        >
                            <Copy className="mr-2 h-4 w-4"/>
                            Copy Code
                        </Button>
                    </div>
                ))}
            </div>

             <p className="text-center text-xs text-muted-foreground pt-2">
                These codes have been saved to your order history for future reference.
            </p>
        </CardContent>
        <CardFooter>
            <Button variant="outline" className="w-full" asChild>
                <a href="https://www.smile.one/merchant/mobilelegends" target="_blank" rel="noopener noreferrer">
                    Go to Smile.One to Redeem
                </a>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    