import { HeaderSearchBar } from "@/components/HeaderSearchBar";
import { publicNavItems } from "@/lib/nav";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex min-w-0 flex-col gap-4 px-3 py-4 sm:px-4">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <Link href="/" className="shrink-0">
            <Image src="/images/logo-full.png" alt="Gensan Car Buy & Sell" width={180} height={60} className="h-10 w-auto object-contain sm:h-12" priority />
          </Link>
          <nav className="flex flex-wrap items-center gap-4 overflow-x-auto sm:flex-nowrap">
            {publicNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground hover:text-primary hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Suspense fallback={<div className="h-10 animate-pulse rounded border bg-muted" />}>
          <div className="w-full min-w-0">
            <HeaderSearchBar />
          </div>
        </Suspense>
      </div>
    </header>
  );
}
