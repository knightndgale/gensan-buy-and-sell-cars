"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { publicNavItems } from "@/lib/nav";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

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
        </div>

        {/* Desktop nav - hidden on mobile */}
        <nav className="ml-auto flex items-center gap-6 sm:gap-8 lg:gap-12">
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
              className="flex items-center gap-2 text-base font-medium text-muted-foreground transition-colors hover:text-primary lg:text-sm cursor-pointer"
              aria-label="Log out">
              <LogOut className="size-4" />
              Log out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
