'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface UserTopUpRowProps {
  user: UserProfile;
}

export default function UserTopUpRow({ user }: UserTopUpRowProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleTopUp = async () => {
    const topUpAmount = parseFloat(amount);
    if (isNaN(topUpAmount) || topUpAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number.',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);
    const userDocRef = doc(db, 'users', user.uid);

    try {
      await updateDoc(userDocRef, {
        walletBalance: increment(topUpAmount),
      });

      toast({
        title: 'Success!',
        description: `Added ${topUpAmount.toLocaleString()} Ks to ${user.username}'s wallet.`,
      });
      setIsDialogOpen(false);
      setAmount('');
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to update wallet balance. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Card className="flex items-center justify-between p-4">
        <div className="space-y-1">
          <p className="font-semibold text-primary">{user.username}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <p className="text-sm font-medium">
            Balance: {user.walletBalance.toLocaleString()} Ks
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>Top Up</Button>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Top Up Wallet for {user.username}</DialogTitle>
            <DialogDescription>
              Add funds to this user's wallet. The change is immediate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">{user.walletBalance.toLocaleString()} Ks</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Add (Ks)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 10000"
                disabled={isUpdating}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleTopUp} disabled={isUpdating || !amount}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Top Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
