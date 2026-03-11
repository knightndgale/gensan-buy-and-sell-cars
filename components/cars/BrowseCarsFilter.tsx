"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CarMake } from "@/schema";
import { Car, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type BrowseCarsFilterProps = {
  makes: CarMake[];
  listingCount: number;
};

const SEARCH_DEBOUNCE_MS = 300;

export function BrowseCarsFilter({ makes, listingCount }: BrowseCarsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const makeParam = searchParams.get("make") ?? "";
  const qParam = searchParams.get("q") ?? "";

  const [searchValue, setSearchValue] = useState(qParam);

  useEffect(() => {
    setSearchValue(qParam);
  }, [qParam]);

  const updateUrl = useCallback(
    (updates: { make?: string; q?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if ("make" in updates) {
        const value = updates.make?.trim() ?? "";
        if (value) params.set("make", value);
        else params.delete("make");
      }
      if ("q" in updates) {
        const value = updates.q?.trim() ?? "";
        if (value) params.set("q", value);
        else params.delete("q");
      }
      const qs = params.toString();
      router.push(qs ? `/cars?${qs}` : "/cars", { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== qParam) {
        updateUrl({ q: searchValue });
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchValue, qParam, updateUrl]);

  const handleBrandClick = (makeId: string) => {
    updateUrl({ make: makeId || undefined });
  };

  return (
    <section className="rounded-xl bg-primary/95 bg-linear-to-br from-primary to-primary/80 px-4 py-6 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
            <Car className="size-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-primary-foreground sm:text-2xl">Browse Cars</h2>
            <p className="mt-1 text-sm text-primary-foreground/85">
              {listingCount} car listing{listingCount !== 1 ? "s" : ""} in General Santos City
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary-foreground/60" />
            <Input
              type="search"
              placeholder="Search by brand, model, or keyword..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-11 rounded-lg border-0 bg-primary-foreground/10 pl-10 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-2 focus-visible:ring-primary-foreground/30"
              aria-label="Search cars"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide ">
            <button
              type="button"
              onClick={() => handleBrandClick("")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                !makeParam ? "bg-primary-foreground text-primary" : "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30",
              )}>
              All
            </button>
            {makes.map((make) => (
              <button
                key={make.id}
                type="button"
                onClick={() => handleBrandClick(String(make.id))}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  makeParam === String(make.id) ? "bg-primary-foreground text-primary" : "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30",
                )}>
                {make.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
