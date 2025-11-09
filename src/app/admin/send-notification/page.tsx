
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function SendNotificationPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const usersCollectionRef = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(
      usersCollectionRef,
      (snapshot) => {
        const usersData = snapshot.docs.map(
          (doc) => ({ ...doc.data(), uid: doc.id } as UserProfile)
        );
        usersData.sort((a, b) => (a.username > b.username ? 1 : -1));
        setUsers(usersData);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to fetch users:", err);
        setError(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [isAdmin]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }
    return users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleUserClick = (user: UserProfile) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleSendNotification = async () => {
    if (!selectedUser || !notificationTitle || !notificationMessage) {
      toast({ title: "Missing Fields", description: "Please fill in title and message.", variant: "destructive" });
      return;
    }
    
    setIsSending(true);
    try {
      const notificationRef = collection(db, `users/${selectedUser.uid}/notifications`);
      await addDoc(notificationRef, {
        title: notificationTitle,
        message: notificationMessage,
        isRead: false,
        createdAt: serverTimestamp(),
      });
      toast({ title: "Success", description: `Notification sent to ${selectedUser.username}.` });
      setIsDialogOpen(false);
      setNotificationTitle('');
      setNotificationMessage('');
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({ title: "Error", description: "Could not send notification.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  if (!isAdmin) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>You do not have permission to view this page.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Send Notification</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select a User</CardTitle>
          <CardDescription>Find a user to send a direct notification to.</CardDescription>
          <div className="relative pt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to load user data. Please try again later.</AlertDescription>
            </Alert>
          )}

          {!loading && !error && (
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Button variant="outline" className="w-full justify-start h-auto py-2" key={user.uid} onClick={() => handleUserClick(user)}>
                    <div className="text-left">
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No users found.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send to {selectedUser?.username}</DialogTitle>
            <DialogDescription>
              Compose the notification message below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                className="col-span-3"
                disabled={isSending}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="message" className="text-right pt-2">Message</Label>
              <Textarea
                id="message"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                className="col-span-3"
                rows={4}
                disabled={isSending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSending}>Cancel</Button>
            <Button onClick={handleSendNotification} disabled={isSending || !notificationTitle || !notificationMessage}>
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
