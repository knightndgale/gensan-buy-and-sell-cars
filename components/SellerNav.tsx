"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/seller", label: "Dashboard" },
  { href: "/seller/listings/new", label: "Add Car" },
];

export function SellerNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
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
        <div className="ml-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-8 border-r-2 pr-4 ">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className={`text-sm font-medium transition-colors hover:text-primary ${pathname === href ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary" aria-hidden>
              {avatarLetter}
            </div>
            <div className="flex flex-col min-w-0 gap-1">
              {isLoadingSeller ? (
                <div className="h-4 w-24 animate-pulse rounded bg-muted" aria-hidden />
              ) : (
                <span className="truncate text-sm font-medium text-foreground">{displayName}</span>
              )}
              <span className="truncate text-xs text-muted-foreground">{email}</span>
            </div>
            <button type="button" onClick={() => signOut()} className="shrink-0 rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Sign out">
              <LogOut className="size-5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
