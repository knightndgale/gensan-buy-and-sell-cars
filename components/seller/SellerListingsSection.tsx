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
    <div className="flex flex-col gap-6 pb-20 sm:pb-0">
      <div className="hidden flex-col gap-4 sm:flex-row sm:items-center sm:justify-end md:flex">
        <Button asChild className="bg-primary shrink-0">
          <Link href="/seller/listings/new">+ Add New Listing</Link>
        </Button>
      </div>

      {/* Floating mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:hidden z-50 shadow-lg">
        <Button asChild className="w-full bg-primary shrink-0 h-12">
          <Link href="/seller/listings/new" className="flex items-center justify-center gap-2">
            <Plus className="size-5" />
            Add new car
          </Link>
        </Button>
      </div>
      <section className="bg-transparent lg:bg-white rounded-md p-4 ">
        <div className="flex flex-row justify-between items-center gap-2 mb-4">
          <h2 className="text-xl font-bold">My Listings</h2>
          <p className="text-sm text-muted-foreground hidden sm:block">
            {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <section className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-nowrap gap-2 p-1 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
            {TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                className={cn(
                  "shrink-0 px-3 py-1 text-sm font-medium transition-colors rounded-[60px]",
                  tab === t.value ? "bg-primary text-white border-0" : "  border border-muted-foreground text-muted-foreground hover:text-foreground]",
                )}>
                {t.label} ({counts[t.value]})
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-40 md:w-50 lg:w-96">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search your listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 py-6 border bg-white" />
          </div>
        </section>

        <div className="flex flex-col gap-4">
          {filtered.map((listing) => (
            <SellerListingCard key={listing.id} car={listing} />
          ))}
        </div>

        {filtered.length === 0 && <p className="py-12 text-center text-muted-foreground">{listings.length === 0 ? "No listings yet. Add your first one!" : "No listings match your filters."}</p>}
      </section>
    </div>
  );
}
