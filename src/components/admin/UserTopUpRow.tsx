
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
import { cn } from '@/lib/utils';

interface UserTopUpRowProps {
  user: UserProfile;
}

type TopUpTarget = 'main' | 'smileCoin';
type ActionType = 'add' | 'deduct';

const SMILE_COIN_PASSWORD = '580697';

export default function UserTopUpRow({ user }: UserTopUpRowProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [amount, setAmount] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [topUpTarget, setTopUpTarget] = useState<TopUpTarget>('main');
  const [actionType, setActionType] = useState<ActionType>('add');
  const { toast } = useToast();

  const handleOpenDialog = (target: TopUpTarget, action: ActionType) => {
    setTopUpTarget(target);
    setActionType(action);
    if (target === 'smileCoin') {
      setIsPasswordDialogOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handlePasswordConfirm = () => {
    if (passwordInput === SMILE_COIN_PASSWORD) {
      setPasswordInput('');
      setIsPasswordDialogOpen(false);
      setIsDialogOpen(true);
    } else {
      toast({
        title: 'Incorrect Password',
        description: 'The password you entered is incorrect.',
        variant: 'destructive',
      });
    }
  };

  const handleConfirm = async () => {
    const adjustmentAmount = parseFloat(amount);
    if (isNaN(adjustmentAmount) || adjustmentAmount <= 0) {
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
    const finalAmount = actionType === 'add' ? adjustmentAmount : -adjustmentAmount;

    try {
      await updateDoc(userDocRef, {
        [fieldToUpdate]: increment(finalAmount),
      });

      toast({
        title: 'Success!',
        description: `${actionType === 'add' ? 'Added' : 'Deducted'} ${adjustmentAmount.toLocaleString()} ${topUpTarget === 'main' ? 'Ks' : 'Coins'} ${actionType === 'add' ? 'to' : 'from'} ${user.username}'s balance.`,
      });
      setIsDialogOpen(false);
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
        requestResourceData: { [fieldToUpdate]: `increment(${finalAmount})` },
      });
      errorEmitter.emit('permission-error', permissionError);

    } finally {
      setIsUpdating(false);
    }
  };

  const currentBalance = topUpTarget === 'main' ? user.walletBalance : (user.smileCoinBalance ?? 0);
  
  const getDialogTitle = () => {
    const actionText = actionType === 'add' ? 'Top Up' : 'Deduct from';
    const targetText = topUpTarget === 'main' ? 'Wallet' : 'Smile Coins';
    return `${actionText} ${targetText} for ${user.username}`;
  };

  const getDialogDescription = () => {
    const actionText = actionType === 'add' ? 'Add funds to' : 'Deduct funds from';
    const targetText = topUpTarget === 'main' ? "this user's main wallet" : "this user's Smile Coin balance";
    return `${actionText} ${targetText}. The change is immediate.`;
  }
  
  const getLabelText = () => `Amount to ${actionType === 'add' ? 'Add' : 'Deduct'}`;

  return (
    <>
      <Card className="p-3">
         <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-semibold text-primary">{user.username}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
             <div className="text-right">
                <p className="text-sm font-medium text-primary">
                  {user.walletBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} Ks
                </p>
                <p className="text-sm font-medium text-yellow-400">
                  {(user.smileCoinBalance ?? 0).toLocaleString()} Coins
                </p>
            </div>
         </div>
         <div className="mt-3">
            <div className="space-y-1">
                <p className="text-xs font-bold text-center text-muted-foreground">Main Wallet</p>
                <div className="grid grid-cols-2 gap-1">
                    <Button size="sm" className="h-8" onClick={() => handleOpenDialog('main', 'add')}>Top Up</Button>
                    <Button size="sm" className="h-8" variant="destructive" onClick={() => handleOpenDialog('main', 'deduct')}>Deduct</Button>
                </div>
            </div>
         </div>
      </Card>

      {/* Password Dialog for Smile Coin Action */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Password</DialogTitle>
            <DialogDescription>
              A password is required to adjust Smile Coins.
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
      
      {/* Main Action Dialog (Top Up / Deduct) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {getDialogDescription()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">{currentBalance.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">{getLabelText()}</Label>
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
            <Button 
                onClick={handleConfirm} 
                disabled={isUpdating || !amount}
                variant={actionType === 'deduct' ? 'destructive' : 'default'}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
