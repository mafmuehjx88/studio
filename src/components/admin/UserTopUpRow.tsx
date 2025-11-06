
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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface UserTopUpRowProps {
  user: UserProfile;
}

type TopUpTarget = 'main' | 'smileCoin';

const SMILE_COIN_PASSWORD = '580697';

export default function UserTopUpRow({ user }: UserTopUpRowProps) {
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [amount, setAmount] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [topUpTarget, setTopUpTarget] = useState<TopUpTarget>('main');
  const { toast } = useToast();

  const handleOpenDialog = (target: TopUpTarget) => {
    setTopUpTarget(target);
    if (target === 'smileCoin') {
      setIsPasswordDialogOpen(true);
    } else {
      setIsTopUpDialogOpen(true);
    }
  };

  const handlePasswordConfirm = () => {
    if (passwordInput === SMILE_COIN_PASSWORD) {
      setPasswordInput('');
      setIsPasswordDialogOpen(false);
      setIsTopUpDialogOpen(true);
    } else {
      toast({
        title: 'Incorrect Password',
        description: 'The password you entered is incorrect.',
        variant: 'destructive',
      });
    }
  };

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
    const fieldToUpdate = topUpTarget === 'main' ? 'walletBalance' : 'smileCoinBalance';

    try {
      await updateDoc(userDocRef, {
        [fieldToUpdate]: increment(topUpAmount),
      });

      toast({
        title: 'Success!',
        description: `Added ${topUpAmount.toLocaleString()} to ${user.username}'s ${topUpTarget === 'main' ? 'main wallet' : 'Smile Coin balance'}.`,
      });
      setIsTopUpDialogOpen(false);
      setAmount('');
    } catch (error: any) {
      console.error('Error updating wallet balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to update wallet balance. Please try again.',
        variant: 'destructive',
      });
      
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'update',
        requestResourceData: { [fieldToUpdate]: `increment(${topUpAmount})` },
      });
      errorEmitter.emit('permission-error', permissionError);

    } finally {
      setIsUpdating(false);
    }
  };

  const currentBalance = topUpTarget === 'main' ? user.walletBalance : (user.smileCoinBalance ?? 0);
  const dialogTitle = topUpTarget === 'main' 
    ? `Top Up Wallet for ${user.username}`
    : `Top Up Smile Coins for ${user.username}`;
  const dialogDescription = topUpTarget === 'main'
    ? "Add funds to this user's main wallet. The change is immediate."
    : "Add funds to this user's Smile Coin balance. The change is immediate.";

  return (
    <>
      <Card className="flex items-center justify-between p-4">
        <div className="space-y-1">
          <p className="font-semibold text-primary">{user.username}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <div className="flex gap-4 text-sm">
            <p className="font-medium">
              Wallet: {user.walletBalance.toLocaleString()} Ks
            </p>
            <p className="font-medium text-yellow-400">
              Smile: {(user.smileCoinBalance ?? 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
            <Button size="sm" onClick={() => handleOpenDialog('main')}>Top Up Wallet</Button>
            <Button size="sm" variant="secondary" onClick={() => handleOpenDialog('smileCoin')}>Top Up Smile</Button>
        </div>
      </Card>

      {/* Password Dialog for Smile Coin Top-Up */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Password</DialogTitle>
            <DialogDescription>
              A password is required to top up Smile Coins.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="password">Admin Password</Label>
            <Input
              id="password"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••"
              onKeyUp={(e) => e.key === 'Enter' && handlePasswordConfirm()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePasswordConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Top-Up Dialog */}
      <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">{currentBalance.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Add</Label>
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
              onClick={() => setIsTopUpDialogOpen(false)}
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
