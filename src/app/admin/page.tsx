"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrdersPage from "./orders/page";
import AdminUsersPage from "./users/page";
import AdminContentPage from "./content/page";
import AdminSmileCodesPage from "./smile-codes/page";

export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/");
    }
  }, [isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="smile-codes">Smile Codes</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <AdminOrdersPage />
        </TabsContent>
        <TabsContent value="users">
          <AdminUsersPage />
        </TabsContent>
        <TabsContent value="content">
            <AdminContentPage />
        </TabsContent>
         <TabsContent value="smile-codes">
            <AdminSmileCodesPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
