"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/seller", label: "Dashboard" },
  { href: "/seller/listings/new", label: "Add Car" },
];

function NavLinksAndUser({
  pathname,
  displayName,
  email,
  avatarLetter,
  isLoadingSeller,
  onSignOut,
  onLinkClick,
}: {
  pathname: string;
  displayName: string;
  email: string;
  avatarLetter: string;
  isLoadingSeller: boolean;
  onSignOut: () => void;
  onLinkClick?: () => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-6 border-b pb-6 md:flex-row md:items-center md:gap-8 md:border-r-2 md:border-b-0 md:pb-0 md:pr-4">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onLinkClick}
            className={`text-base font-medium transition-colors hover:text-primary md:text-sm ${pathname === href ? "text-primary" : "text-muted-foreground"}`}>
            {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary" aria-hidden>
          {avatarLetter}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          {isLoadingSeller ? <div className="h-4 w-24 animate-pulse rounded bg-muted" aria-hidden /> : <span className="truncate text-sm font-medium text-foreground">{displayName}</span>}
          <span className="truncate text-xs text-muted-foreground">{email}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            onSignOut();
            onLinkClick?.();
          }}
          className="shrink-0 rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Sign out">
          <LogOut className="size-5" />
        </button>
      </div>
    </>
  );
}

export function SellerNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isLoginPage = pathname === "/seller/login";

  const { data: sellerMe, isLoading: isLoadingSeller } = useQuery({
    queryKey: ["seller-me"],
    queryFn: async () => {
      const res = await fetch("/api/seller/me");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<{ dealershipName: string | null; email: string | null }>;
    },
    enabled: !isLoginPage && !!user,
  });

  const displayName = sellerMe?.dealershipName ?? sellerMe?.email ?? user?.email ?? "Seller";
  const email = sellerMe?.email ?? user?.email ?? "";
  const avatarLetter = (displayName?.[0] ?? email?.[0] ?? "?").toUpperCase();

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b bg-background px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/" className="shrink-0">
          <Image src="/images/logo-full.png" alt="Gensan Buy and Sell Cars" width={180} height={60} className="h-10 w-auto object-contain sm:h-12" priority />
        </Link>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">Seller</span>
      </div>

      {!isLoginPage && (
        <>
          {/* Desktop: horizontal nav - hidden on mobile */}
          <div className="ml-auto hidden items-center gap-4 md:flex">
            <NavLinksAndUser pathname={pathname} displayName={displayName} email={email} avatarLetter={avatarLetter} isLoadingSeller={isLoadingSeller} onSignOut={signOut} />
          </div>

          {/* Mobile: hamburger + drawer */}
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <button type="button" className="ml-auto flex size-10 items-center justify-center rounded-md text-foreground hover:bg-muted md:hidden" aria-label="Open menu">
                <Menu className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[min(85vw,20rem)] flex-col gap-6 sm:max-w-sm bg-muted">
              <SheetTitle className="sr-only">Seller menu</SheetTitle>
              <div className="flex items-center gap-2">
                <Link href="/" onClick={() => setDrawerOpen(false)} className="shrink-0 py-2">
                  <Image src="/images/logo-full.png" alt="Gensan Buy and Sell Cars" width={150} height={30} className="object-contain" />
                </Link>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">Seller</span>
              </div>

              {/* Nav links: Dashboard, Add Car, Log Out - stacked with horizontal padding */}
              <div className="flex flex-col bg-white px-4 pb-4 gap-2">
                <div className="flex items-center py-4 ">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary" aria-hidden>
                    {avatarLetter}
                  </div>
                  <div className="flex min-w-0 flex-col pl-2">
                    {isLoadingSeller ? <div className="h-4 w-28 animate-pulse rounded bg-muted" aria-hidden /> : <span className="font-medium text-foreground">{displayName}</span>}
                    <span className="text-sm text-muted-foreground">{email}</span>
                  </div>
                </div>

                {links.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className={pathname === href ? "rounded-lg font-medium bg-primary/10 px-4 py-3 text-left text-primary" : "rounded-lg px-4 py-3 text-left  text-muted-foreground hover:bg-muted"}>
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setDrawerOpen(false);
                  }}
                  className="rounded-lg px-4 py-3 text-left text-destructive hover:bg-destructive/10">
                  Log Out
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </nav>
  );
}
