"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Camera, Car, CheckCircle2, Eye, FileText, Info } from "lucide-react";
import Link from "next/link";

type ListingCounts = {
  total: number;
  active: number;
  sold: number;
  pending: number;
};

type SellerDashboardSidebarProps = {
  dealerName: string;
  counts: ListingCounts;
};

function getGreetingName(dealershipName: string): string {
  if (!dealershipName?.trim()) return "Seller";
  const firstWord = dealershipName.trim().split(/\s+/)[0];
  return firstWord.replace(/'s$/, "") || "Seller";
}

export function SellerDashboardSidebar({ dealerName, counts }: SellerDashboardSidebarProps) {
  const name = getGreetingName(dealerName);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Hi, {name}!</h1>
        <p className="text-muted-foreground mt-1">Manage your car listings below.</p>
      </div>

      <Link href="/seller/listings/new" className="hidden sm:block">
        <Card className="border-primary bg-primary text-primary-foreground overflow-hidden transition-colors hover:bg-primary/90">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/20">
              <Camera className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">Sell Your Car</h3>
              <p className="text-sm opacity-90">List your car now and we&apos;ll connect you with interested buyers in GenSan</p>
            </div>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20">
              <ArrowRight className="size-5 shrink-0" />
            </span>
          </CardContent>
        </Card>
      </Link>

      <div className="rounded-lg bg-white px-0 py-0 sm:p-4 border">
        <h2 className="mb-3 hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:block">Overview</h2>
        <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:gap-3">
          <section className="flex min-w-0 items-center justify-between gap-2 border border-muted-foreground rounded-lg px-3 py-3 sm:gap-3 sm:px-4">
            <div className="min-w-0">
              <p className="text-2xl font-bold">{counts.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <FileText className="size-5" />
            </div>
          </section>

          <section className="flex min-w-0 items-center justify-between gap-2 border border-muted-foreground rounded-lg px-3 py-3 sm:gap-3 sm:px-4">
            <div className="min-w-0">
              <p className="text-2xl font-bold">{counts.active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Car className="size-5" />
            </div>
          </section>
          <section className="flex min-w-0 items-center justify-between gap-2 border border-muted-foreground rounded-lg px-3 py-3 sm:gap-3 sm:px-4">
            <div className="min-w-0">
              <p className="text-2xl font-bold">{counts.sold}</p>
              <p className="text-xs text-muted-foreground">Sold</p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 className="size-5" />
            </div>
          </section>
          <section className="flex min-w-0 items-center justify-between gap-2 border border-muted-foreground rounded-lg px-3 py-3 sm:gap-3 sm:px-4">
            <div className="min-w-0">
              <p className="text-2xl font-bold">—</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Eye className="size-5" />
            </div>
          </section>
        </div>
      </div>

      <div className="w-full min-w-0 max-w-full rounded-lg border border-blue-200 bg-[#2B44E41A]/5 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
        <div className="flex gap-3">
          <Info className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium  dark:text-blue-100">How GBSC works for sellers</h3>
            <p className="mt-1 text-sm leading-relaxed  dark:text-blue-200">
              You list your car here. When a buyer is interested, our team will contact you directly with the buyer&apos;s details. You don&apos;t need to worry about inquiries, we handle that for
              you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
