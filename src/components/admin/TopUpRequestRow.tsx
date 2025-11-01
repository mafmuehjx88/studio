
'use client';

import { useState } from 'react';
import { TopUpRequest } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, increment, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface TopUpRequestRowProps {
  request: TopUpRequest;
}

export default function TopUpRequestRow({ request }: TopUpRequestRowProps) {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<'approving' | 'rejecting' | null>(null);
  const { toast } = useToast();

  const handleUpdateStatus = async (status: 'Approved' | 'Rejected') => {
    setIsUpdating(status === 'Approved' ? 'approving' : 'rejecting');

    const batch = writeBatch(db);
    const requestDocRef = doc(db, 'topUpRequests', request.id);

    try {
        // Step 1: Update the request status
        batch.update(requestDocRef, { status });

        // Step 2: If approved, update the user's wallet balance
        if (status === 'Approved') {
            const userDocRef = doc(db, 'users', request.userId);
            batch.update(userDocRef, {
                walletBalance: increment(request.amount),
            });
        }
        
        // Step 3: Commit the batch
        await batch.commit();

        toast({
            title: `Request ${status}`,
            description: `The request from ${request.username} for ${request.amount.toLocaleString()} Ks has been ${status.toLowerCase()}.`,
        });
    } catch (error) {
        console.error('Error updating request status:', error);
        toast({
            title: 'Error',
            description: 'Failed to update request. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsUpdating(null);
    }
  };

  const statusColors: Record<TopUpRequest["status"], string> = {
    Approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <>
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between">
            <div className="space-y-1">
                <p className="font-semibold text-primary">{request.username}</p>
                <p className="text-sm text-muted-foreground">
                    {request.amount.toLocaleString()} Ks
                </p>
                 <p className="text-xs text-muted-foreground">
                    {request.createdAt ? formatDistanceToNow(request.createdAt.toDate(), { addSuffix: true }) : 'N/A'}
                 </p>
            </div>
            <Badge 
                variant="outline"
                className={cn("text-xs", statusColors[request.status])}
            >
                {request.status}
            </Badge>
        </div>
        
        <div className="flex items-center gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsImageOpen(true)}>
                View Screenshot
            </Button>
            {request.status === 'Pending' && (
                <>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                        onClick={() => handleUpdateStatus('Rejected')}
                        disabled={!!isUpdating}
                    >
                        {isUpdating === 'rejecting' ? <Loader2 className="animate-spin"/> : <X />}
                    </Button>
                    <Button 
                        size="icon"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleUpdateStatus('Approved')}
                        disabled={!!isUpdating}
                    >
                        {isUpdating === 'approving' ? <Loader2 className="animate-spin"/> : <Check />}
                    </Button>
                </>
            )}
        </div>
      </Card>

      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-md p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>Screenshot for {request.username}</DialogTitle>
          </DialogHeader>
          <Image
            src={request.screenshotUrl}
            alt={`Screenshot for ${request.username}`}
            width={800}
            height={1200}
            className="w-full h-auto rounded-md"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
