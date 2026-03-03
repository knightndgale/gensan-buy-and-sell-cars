"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/seller", label: "Dashboard" },
  { href: "/seller/listings", label: "Manage Listings" },
  { href: "/seller/listings/new", label: "Add New Listing" },
];

export function SellerNav() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <nav className="flex flex-wrap items-center gap-4 border-b px-4 py-3">
      {/* Mobile: hamburger + logo */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <div className="flex flex-1 items-center gap-3 md:flex-none">
          <SheetTrigger asChild className="md:hidden -ml-1">
            <Button variant="ghost" size="icon-sm" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <Link href="/" className="shrink-0 font-semibold">
            Gensan Car
          </Link>
        </div>
        <SheetContent side="right" className="flex flex-col">
          <div className="flex flex-col gap-2 px-4 pt-14">
            {/* Logo placeholder - clear of close button (top-4 right-4) */}
            <div className="mb-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/50 text-muted-foreground">
              <span className="text-xs">Logo</span>
            </div>
            {links.map(({ href, label }) => (
              <SheetClose asChild key={href}>
                <Button
                  asChild
                  variant={pathname === href ? "default" : "ghost"}
                  size="sm"
                  className="h-10 w-full justify-start px-4"
                >
                  <Link href={href}>{label}</Link>
                </Button>
              </SheetClose>
            ))}
            <div className="my-4 border-t" />
            <SheetClose asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="h-10 w-full justify-start px-4"
              >
                Sign Out
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop: full horizontal nav */}
      <div className="hidden flex-wrap items-center gap-2 md:flex">
        {links.map(({ href, label }) => (
          <Button
            key={href}
            asChild
            variant={pathname === href ? "default" : "ghost"}
            size="sm"
          >
            <Link href={href}>{label}</Link>
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={signOut}
        className="ml-auto hidden shrink-0 md:flex"
      >
        Sign Out
      </Button>
    </nav>
  );
}
