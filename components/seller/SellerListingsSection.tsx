"use client";

import { SellerListingCard, type CarListingDetails } from "@/components/seller/SellerListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, Search } from "lucide-react";
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
      <div className="hidden flex-col gap-4 sm:flex-row sm:items-center sm:justify-end md:flex">
        <Button asChild className="shrink-0 bg-primary text-sm sm:text-base">
          <Link href="/seller/listings/new">+ Add New Listing</Link>
        </Button>
      </div>

      {/* Floating mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 shadow-lg sm:hidden">
        <Button asChild className="h-12 w-full shrink-0 bg-primary text-sm">
          <Link href="/seller/listings/new" className="flex items-center justify-center gap-2">
            <Plus className="size-4" />
            Add new car
          </Link>
        </Button>
      </div>
      <section className="rounded-md bg-transparent pb-4 lg:bg-white">
        <div className="mb-4 flex flex-row items-center justify-between gap-2">
          <h2 className="text-md font-semibold uppercase tracking-wide text-primary sm:text-2xl">My Listings</h2>
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
                  "shrink-0 rounded-[60px] px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-1 sm:text-sm",
                  tab === t.value ? "border-0 bg-primary text-white" : "border border-muted-foreground text-muted-foreground hover:text-foreground",
                )}>
                {t.label} ({counts[t.value]})
              </button>
            ))}
          </div>
          <div className="relative w-full min-w-0 sm:w-40 md:w-64 lg:w-96">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:size-5" />
            <Input
              type="search"
              placeholder="Search your listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 border bg-white pl-9 text-xs sm:h-11 sm:text-base"
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:gap-4">
          {filtered.map((listing) => (
            <SellerListingCard key={listing.id} car={listing} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-xs text-muted-foreground sm:text-base">
            {listings.length === 0 ? "No listings yet. Add your first one!" : "No listings match your filters."}
          </p>
        )}
      </section>
    </div>
  );
}
