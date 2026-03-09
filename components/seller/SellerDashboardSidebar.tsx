"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Camera, CheckCircle2, Cloud, Eye, FileText, Info } from "lucide-react";
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

      <Link href="/seller/listings/new" className="block">
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

      <div className="p-4 rounded-lg  bg-white">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Overview</h2>
        <div className="grid grid-cols-2 gap-3">
          <section className="px-4 py-3 flex items-center  justify-between w-full gap-3 border border-muted-foreground rounded-lg">
            <div className="min-w-0">
              <p className="text-2xl font-bold">{counts.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <FileText className="size-5" />
            </div>
          </section>

          <section className="px-4 py-3 flex items-center justify-between w-full  gap-3 border border-muted-foreground rounded-lg">
            <div className="min-w-0">
              <p className="text-2xl font-bold">{counts.active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Cloud className="size-5" />
            </div>
          </section>
          <section className="px-4 py-3 flex items-center justify-between w-full  gap-3 border border-muted-foreground rounded-lg">
            <div className="min-w-0">
              <p className="text-2xl font-bold">{counts.sold}</p>
              <p className="text-xs text-muted-foreground">Sold</p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center  rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 className="size-5" />
            </div>
          </section>
          <section className="px-4 py-3  flex items-center justify-between w-full  gap-3 border border-muted-foreground rounded-lg">
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

      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30">
        <CardContent className="flex gap-2 p-4 align-top">
          <div className="flex size-10 shrink-0 items-center justify-center p-0  text-blue-700 dark:bg-blue-800/50 dark:text-blue-300">
            <Info className="size-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-blue-900 dark:text-blue-100">How GBSC works for sellers</h3>
            <p className="text-sm text-blue-800/90 dark:text-blue-200/80 mt-1">
              You list your car here. When a buyer is interested, our team will contact you directly with the buyer&apos;s details. You don&apos;t need to worry about inquiries, we handle that for
              you.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
