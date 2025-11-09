
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Newspaper, 
    BellRing, 
    Users, 
    Megaphone, 
    ShoppingBag, 
    Wallet, 
    CheckCheck,
    Smile
} from "lucide-react";
import { cn } from "@/lib/utils";


const adminNavItems = [
    {
        title: "All Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
        description: "View and manage all recent user orders."
    },
    {
        title: "User Management",
        href: "/admin/users",
        icon: Users,
        description: "Browse and view all registered users."
    },
    {
        title: "Manual Top-Up",
        href: "/admin/manual-top-up",
        icon: Wallet,
        description: "Manually adjust user wallet balances."
    },
    {
        title: "Top-Up Requests",
        href: "/admin/top-up-requests",
        icon: CheckCheck,
        description: "Approve or reject user top-up requests."
    },
    {
        title: "Home Notice",
        href: "/admin/home-notice",
        icon: Megaphone,
        description: "Update the homepage's scrolling marquee text."
    },
    {
        title: "Announce Notice",
        href: "/admin/announce-notice",
        icon: Newspaper,
        description: "Post a site-wide announcement to all users."
    },
     {
        title: "Send Notification",
        href: "/admin/send-notification",
        icon: BellRing,
        description: "Send a direct notification to a specific user."
    },
    {
        title: "Smile Codes",
        href: "/admin/smile-codes",
        icon: Smile,
        description: "Manage Smile.One codes for the store."
    }
];

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
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {adminNavItems.map((item) => (
            <Link href={item.href} key={item.title}>
                <Card className="hover:bg-primary/5 hover:border-primary/20 transition-colors h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {item.title}
                        </CardTitle>
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            {item.description}
                        </p>
                    </CardContent>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  );
}
