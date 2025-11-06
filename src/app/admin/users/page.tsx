
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserProfile } from "@/lib/types";
import { Input } from "@/components/ui/input";

export default function AdminUsersPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users')
      // Removing orderBy to prevent composite index requirement
      // orderBy("createdAt", "desc") 
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const usersData: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ uid: doc.id, ...doc.data() } as UserProfile);
        });

        // Sort on the client-side
        usersData.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            // @ts-ignore
            return b.createdAt.toMillis() - a.createdAt.toMillis();
          }
          return 0;
        });

        setUsers(usersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching all users:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="p-4">
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>User Management</CardTitle>
         <div className="pt-2">
          <Input 
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm h-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-3 py-2">Username</TableHead>
              <TableHead className="px-3 py-2">Email</TableHead>
              <TableHead className="text-right px-3 py-2">Wallet</TableHead>
              <TableHead className="text-right px-3 py-2">Smile Coin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.uid}>
                <TableCell className="p-3 font-medium">{user.username}</TableCell>
                <TableCell className="p-3 text-muted-foreground text-xs">{user.email}</TableCell>
                <TableCell className="p-3 text-right font-semibold text-primary">
                    {user.walletBalance.toFixed(2)}
                </TableCell>
                <TableCell className="p-3 text-right font-semibold text-yellow-400">
                    {(user.smileCoinBalance ?? 0).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
