"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, User, Shield, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/orders", icon: ClipboardList, label: "Orders" },
  { href: "/profile", icon: User, label: "Profile" },
];

const adminNavItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/admin/top-ups", icon: ClipboardList, label: "Requests" },
    { href: "/admin/manual-top-up", icon: Wallet, label: "Top-up" },
    { href: "/admin", icon: Shield, label: "Admin" },
];

export default function Footer() {
  const pathname = usePathname();
  const { isAdmin, user, loading } = useAuth();
  
  // The footer should not be visible on login/register pages
  if (pathname === '/login' || pathname === '/register') return null;

  // if user is logged in, show the appropriate nav items
  if (user) {
    const items = isAdmin ? adminNavItems : navItems;
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-20 mx-auto h-16 w-full max-w-md border-t border-border/50 bg-background/80 backdrop-blur-lg">
          <nav className="flex h-full items-center justify-around">
            {items.map((item) => {
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

  // If user is not logged in, show a simplified footer
  const guestNavItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/login", icon: User, label: "Login" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 mx-auto h-16 w-full max-w-md border-t border-border/50 bg-background/80 backdrop-blur-lg">
      <nav className="flex h-full items-center justify-around">
        {guestNavItems.map((item) => {
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
