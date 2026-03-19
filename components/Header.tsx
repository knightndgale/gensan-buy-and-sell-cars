"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { publicNavItems } from "@/lib/nav";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: authMe } = useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<{ uid: string; role: string }>;
    },
    enabled: !!user,
  });

  const isAdmin = authMe?.role === "admin";

  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b bg-background py-3">
      <div className="container mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-3 sm:px-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="shrink-0">
            <Image src="/images/logo-main.webp" alt="Gensan Car Buy & Sell" width={180} height={60} className="h-10 w-auto object-contain sm:h-12" priority />
          </Link>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{isAdmin ? "Admin" : ""}</span>
        </div>

        <div className="ml-auto hidden items-center gap-6 sm:gap-8 md:flex lg:gap-12">
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-base font-medium transition-colors hover:text-primary lg:text-sm ${pathname === item.href ? "text-primary" : "text-muted-foreground"}`}>
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <button
              type="button"
              onClick={() => signOut()}
              className="flex cursor-pointer items-center gap-2 text-base font-medium text-muted-foreground transition-colors hover:text-primary lg:text-sm"
              aria-label="Log out">
              <LogOut className="size-4" />
              Log out
            </button>
          )}
        </div>

        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger asChild>
            <button type="button" className="ml-auto flex size-10 items-center justify-center rounded-md text-foreground hover:bg-muted md:hidden" aria-label="Open menu">
              <Menu className="size-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-[min(85vw,20rem)] flex-col gap-6 bg-muted sm:max-w-sm">
            <SheetTitle className="sr-only">Main menu</SheetTitle>
            <div className="flex items-center gap-2 ml-4">
              <Link href="/" onClick={() => setDrawerOpen(false)} className="shrink-0 py-2">
                <Image src="/images/logo-main.webp" alt="Gensan Car Buy & Sell" width={100} height={10} className="object-contain" />
              </Link>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{isAdmin ? "Admin" : ""}</span>
            </div>

            <div className="flex flex-col gap-2 bg-white p-4">
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={pathname === item.href ? "rounded-lg bg-primary/10 px-4 py-3 text-left font-medium text-primary" : "rounded-lg px-4 py-3 text-left text-muted-foreground hover:bg-muted"}>
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setDrawerOpen(false);
                  }}
                  className="rounded-lg px-4 py-3 text-left text-destructive hover:bg-destructive/10">
                  Log Out
                </button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
