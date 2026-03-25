"use client";

import { SellerListingCard, type CarListingDetails } from "@/components/seller/SellerListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Car, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export type ListingForSection = CarListingDetails;

type SellerListingsSectionProps = {
  listings: ListingForSection[];
};

type FilterTab = "all" | "active" | "pending" | "sold";

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "sold", label: "Sold" },
];

function getCountByStatus(listings: ListingForSection[]) {
  const active = listings.filter((l) => l.status === "active").length;
  const pending = listings.filter((l) => l.status === "pending").length;
  const sold = listings.filter((l) => l.status === "sold").length;
  return { all: listings.length, active, pending, sold };
}

function SellerListingsEmptyState() {
  const title = "No listings in this category";
  const description = "Try switching to a different tab";

  return (
    <div role="status" className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-12 text-center sm:px-10 sm:py-16">
      <div className="mb-4 flex size-16 shrink-0 items-center justify-center rounded-full bg-muted sm:mb-5 sm:size-20">
        <Car className="size-8 text-muted-foreground sm:size-10" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-bold text-foreground sm:text-lg">{title}</h3>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}

export function SellerListingsSection({ listings }: SellerListingsSectionProps) {
  const [tab, setTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => getCountByStatus(listings), [listings]);

  const filtered = useMemo(() => {
    let result = listings;

    if (tab !== "all") {
      result = result.filter((l) => l.status === tab);
    }

    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter((l) => (l.title || "").toLowerCase().includes(term));
    }

    // When "All" tab is active, sort by status: active → pending → sold
    if (tab === "all") {
      const statusOrder: Record<string, number> = { active: 0, pending: 1, sold: 2 };
      result = [...result].sort((a, b) => {
        const aOrder = statusOrder[a.status] ?? 3;
        const bOrder = statusOrder[b.status] ?? 3;
        return aOrder - bOrder;
      });
    }

    return result;
  }, [listings, tab, search]);

  return (
    <div className="flex flex-col gap-6 pb-10 sm:pb-0">
      {/* Floating mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 shadow-lg sm:hidden bg-white">
        <Button asChild className="h-12 w-full shrink-0 bg-primary text-sm shadow-xl">
          <Link href="/seller/listings/new" className="flex items-center justify-center gap-2">
            <Plus className="size-4" />
            Add new car
          </Link>
        </Button>
      </div>
      <section className="rounded-md bg-transparent pb-4 ">
        <div className="mb-4 flex flex-row items-center justify-between gap-2">
          <h2 className="text-md font-bold tracking-wide  sm:text-2xl">My Listings</h2>
          <p className="hidden text-xs text-muted-foreground sm:block sm:text-base">
            {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <section className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={cn(
                  "bg-white sm:bg-transparent shrink-0 rounded-[60px] px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-1 sm:text-sm",
                  tab === t.value ? "border-0 bg-primary text-white" : "border border-muted-foreground text-muted-foreground hover:text-foreground",
                )}>
                {t.label} ({counts[t.value]})
              </button>
            ))}
          </div>
          <div className="relative w-full min-w-0 sm:w-40 md:w-64 lg:w-96">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:size-5" />
            <Input type="search" placeholder="Search your listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 border bg-white pl-9 text-xs sm:h-11 sm:text-base" />
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:gap-4">
          {filtered.map((listing) => (
            <SellerListingCard key={listing.id} car={listing} />
          ))}
        </div>

        {filtered.length === 0 && <SellerListingsEmptyState />}
      </section>
    </div>
  );
}
