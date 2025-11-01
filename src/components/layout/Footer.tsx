"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/orders", icon: ClipboardList, label: "Orders" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function Footer() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage && !user) {
    return null;
  }
  
  if (loading) {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-20 mx-auto h-16 w-full max-w-md border-t border-border/50 bg-background/95 backdrop-blur-lg">
            <div className="flex h-full items-center justify-around">
                <div className="h-8 w-1/4 animate-pulse rounded-md bg-muted"></div>
                <div className="h-8 w-1/4 animate-pulse rounded-md bg-muted"></div>
                <div className="h-8 w-1/4 animate-pulse rounded-md bg-muted"></div>
                <div className="h-8 w-1/4 animate-pulse rounded-md bg-muted"></div>
            </div>
        </footer>
    )
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 mx-auto h-16 w-full max-w-md border-t border-border/50 bg-background/95 backdrop-blur-lg">
      <nav className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          // If user is not logged in, only show Home and Profile
          if (!user && item.href !== "/" && item.href !== "/profile") {
            return null;
          }
          const isActive = (pathname === "/" && item.href === "/") || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
