"use client";

import { ListingCard, type ListingWithDetails } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";

type CarsListWithLoadMoreProps = {
  initialListings: ListingWithDetails[];
  initialHasMore: boolean;
  pageSize: number;
  searchParams: Record<string, string | string[] | undefined>;
};

function buildBaseSearchParams(params: Record<string, string | string[] | undefined>): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "page") continue;
    const str = Array.isArray(value) ? value[0] : value;
    if (str !== undefined && str !== "") {
      sp.set(key, str);
    }
  }
  return sp;
}

export function CarsListWithLoadMore({ initialListings, initialHasMore, pageSize, searchParams }: CarsListWithLoadMoreProps) {
  const [listings, setListings] = useState<ListingWithDetails[]>(initialListings);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = currentPage + 1;
    const baseParams = buildBaseSearchParams(searchParams);
    baseParams.set("page", String(nextPage));
    baseParams.set("pageSize", String(pageSize));
    const url = `/api/cars/browse?${baseParams.toString()}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = (await res.json()) as { listings: ListingWithDetails[]; hasMore: boolean };
      setListings((prev) => [...prev, ...data.listings]);
      setHasMore(data.hasMore);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Load more error:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentPage, searchParams, pageSize]);

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button variant="default" size="lg" onClick={loadMore} disabled={loading} className="gap-2">
            {loading ? (
              "Loading..."
            ) : (
              <>
                <ChevronDown className="size-4" />
                Load More Cars
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}
