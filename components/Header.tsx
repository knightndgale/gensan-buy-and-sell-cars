"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { publicNavItems } from "@/lib/nav";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex min-w-0 flex-col gap-4 px-3 py-4 sm:px-4">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <Link href="/" className="shrink-0">
            <Image src="/images/logo-full.png" alt="Gensan Car Buy & Sell" width={180} height={60} className="h-10 w-auto object-contain sm:h-12" priority />
          </Link>

          {/* Desktop nav - hidden on mobile */}
          <nav className="hidden items-center gap-4 lg:flex">
            {publicNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground hover:text-primary hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger - visible on lg and below */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button type="button" className="flex size-10 items-center justify-center rounded-md text-foreground hover:bg-muted lg:hidden" aria-label="Open menu">
                <Menu className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4">
                {publicNavItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-base font-medium text-foreground hover:text-primary hover:underline">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
