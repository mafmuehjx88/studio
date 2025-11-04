
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import {
  Home,
  ClipboardList,
  Wallet,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";

interface SidebarProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/orders", icon: ClipboardList, label: "Orders" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/profile", icon: User, label: "Profile" },
];

const adminNavItems = [
    { href: "/admin", icon: ShieldCheck, label: "Admin Panel" },
]

export function Sidebar({ isOpen, onOpenChange }: SidebarProps) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    onOpenChange(false); // Close sidebar on logout
    router.replace("/login");
  };

  const handleLinkClick = () => {
    onOpenChange(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-4">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-2xl font-bold text-primary">
            AT Game HUB
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="h-12 justify-start gap-3 text-base"
                asChild
              >
                <Link href={item.href} onClick={handleLinkClick}>
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}

            {isAdmin && (
              <>
                <Separator className="my-2" />
                {adminNavItems.map((item) => (
                    <Button
                        key={item.href}
                        variant="ghost"
                        className="h-12 justify-start gap-3 text-base"
                        asChild
                    >
                        <Link href={item.href} onClick={handleLinkClick}>
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span>{item.label}</span>
                        </Link>
                    </Button>
                ))}
              </>
            )}
          </nav>

          <div className="mt-auto">
            {user ? (
              <Button
                variant="outline"
                className="h-12 w-full justify-start gap-3 text-base text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            ) : (
              <Button
                className="h-12 w-full text-base"
                asChild
              >
                <Link href="/login" onClick={handleLinkClick}>Login</Link>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
