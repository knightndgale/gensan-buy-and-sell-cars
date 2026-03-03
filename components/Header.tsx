import { Suspense } from "react";
import Link from "next/link";
import { HeaderSearchBar } from "@/components/HeaderSearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex min-w-0 flex-col gap-4 px-3 py-4 sm:px-4">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <Link href="/" className="truncate text-base font-bold sm:text-xl">
            Gensan Car Buy & Sell
          </Link>
          <Link
            href="/seller/login"
            className="text-sm text-primary hover:underline"
          >
            Seller Login
          </Link>
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
