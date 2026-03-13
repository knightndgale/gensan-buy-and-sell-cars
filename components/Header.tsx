"use client";

import { publicNavItems } from "@/lib/nav";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b bg-background px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/" className="shrink-0">
          <Image src="/images/logo-main.webp" alt="Gensan Car Buy & Sell" width={180} height={60} className="h-10 w-auto object-contain sm:h-12" priority />
        </Link>
      </div>

      {/* Desktop nav - hidden on mobile */}
      <nav className="ml-auto flex items-center gap-6 pr-2 sm:gap-8 sm:pr-6 lg:gap-12 lg:pr-10">
        {publicNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-base font-medium transition-colors hover:text-primary lg:text-sm ${pathname === item.href ? "text-primary" : "text-muted-foreground"}`}>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile hamburger - visible on lg and below */}
      {/* <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button type="button" className="ml-auto flex size-10 items-center justify-center rounded-md text-foreground hover:bg-muted lg:hidden" aria-label="Open menu">
            <Menu className="size-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-[min(85vw,20rem)] flex-col gap-6 sm:max-w-sm bg-muted">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex items-center gap-2">
            <Link href="/" onClick={() => setOpen(false)} className="shrink-0 py-2">
              <Image src="/images/logo-main.webp" alt="Gensan Car Buy & Sell" width={150} height={30} className="object-contain" />
            </Link>
          </div>

          <div className="flex flex-col gap-2 bg-white px-4 pb-4">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={pathname === item.href ? "rounded-lg px-4 py-3 text-left font-medium text-primary bg-primary/10" : "rounded-lg px-4 py-3 text-left text-muted-foreground hover:bg-muted"}>
                {item.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet> */}
    </header>
  );
}
