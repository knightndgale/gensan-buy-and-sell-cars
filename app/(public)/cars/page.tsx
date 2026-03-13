import { BrowseCarsFilter } from "@/components/cars/BrowseCarsFilter";
import { CarsFilterDrawer, CarsFilterSidebar } from "@/components/cars/CarsFilter";
import { CarsListWithLoadMore } from "@/components/cars/CarsListWithLoadMore";
import { CarsPagination } from "@/components/cars/CarsPagination";
import { CarsSortSelect } from "@/components/cars/CarsSortSelect";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ListingCard, type ListingWithDetails } from "@/components/ListingCard";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";
import { getListingImages } from "@/lib/firestore/listing-images";
import { getListings } from "@/lib/firestore/listings";
import { Suspense } from "react";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const DEFAULT_PAGE_SIZE = 6;

function matchesKeyword(listing: ListingWithDetails, q: string): boolean {
  const term = q.toLowerCase();
  const fields = [listing.title, listing.makeName, listing.modelName, listing.description].filter(Boolean) as string[];
  return fields.some((f) => f.toLowerCase().includes(term));
}

export default async function CarsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const make = typeof params.make === "string" ? params.make : undefined;
  const model = typeof params.model === "string" ? params.model : undefined;
  const q = typeof params.q === "string" ? params.q.trim() : undefined;
  const minPrice = typeof params.minPrice === "string" ? parseInt(params.minPrice, 10) : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? parseInt(params.maxPrice, 10) : undefined;
  const year = typeof params.year === "string" ? parseInt(params.year, 10) : undefined;
  const minMileage = typeof params.minMileage === "string" ? parseInt(params.minMileage, 10) : undefined;
  const maxMileage = typeof params.maxMileage === "string" ? parseInt(params.maxMileage, 10) : undefined;
  const transmission = typeof params.transmission === "string" ? params.transmission : undefined;
  const bodyType = typeof params.bodyType === "string" ? params.bodyType : undefined;
  const location = typeof params.location === "string" ? params.location : undefined;
  const sort = typeof params.sort === "string" && ["newest", "price_asc", "price_desc"].includes(params.sort) ? params.sort : "newest";
  const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1);
  const pageSize = Math.min(24, Math.max(6, parseInt(typeof params.pageSize === "string" ? params.pageSize : "6", 10) || 6)) || DEFAULT_PAGE_SIZE;

  const [listings, models, makes] = await Promise.all([
    getListings({
      status: "active",
      makeId: make ? parseInt(make, 10) : undefined,
      modelId: model ? parseInt(model, 10) : undefined,
      minPrice,
      maxPrice,
      location,
      year,
      transmission,
      bodyType,
    }),
    getCarModels(make ? parseInt(make, 10) : undefined),
    getCarMakes(),
  ]);

  const modelMap = new Map(models.map((m) => [m.id, m]));
  const makeMap = new Map(makes.map((m) => [m.id, m.name]));

  const resolved: ListingWithDetails[] = await Promise.all(
    listings.map(async (l) => {
      const modelInfo = typeof l.modelId === "number" ? modelMap.get(l.modelId) : undefined;
      const images = await getListingImages(l.id);
      const primary = images.find((i) => i.isPrimary) ?? images[0];
      return {
        ...l,
        makeName: modelInfo ? makeMap.get(modelInfo.makeId) : undefined,
        modelName: modelInfo?.name,
        primaryImageUrl: primary?.imageUrl,
      };
    }),
  );

  let filtered = resolved;

  if (minMileage !== undefined && !isNaN(minMileage)) {
    filtered = filtered.filter((l) => typeof l.mileage === "number" && l.mileage >= minMileage);
  }
  if (maxMileage !== undefined && !isNaN(maxMileage)) {
    filtered = filtered.filter((l) => typeof l.mileage === "number" && l.mileage <= maxMileage);
  }
  if (q) {
    filtered = filtered.filter((l) => matchesKeyword(l, q));
  }

  const sorted =
    sort === "price_asc"
      ? [...filtered].sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY))
      : sort === "price_desc"
        ? [...filtered].sort((a, b) => (b.price ?? Number.NEGATIVE_INFINITY) - (a.price ?? Number.NEGATIVE_INFINITY))
        : filtered;

  const totalCount = sorted.length;
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main>
      <section className="container mx-auto max-w-7xl px-3 py-8 sm:px-4">
        <div className="flex gap-8">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-muted" />}>
            <CarsFilterSidebar makes={makes} models={models} />
          </Suspense>

          <div className="min-w-0 flex-1">
            <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-muted" />}>
              <BrowseCarsFilter makes={makes} listingCount={totalCount} />
            </Suspense>

            <div className="mt-6 flex flex-row  items-center justify-between gap-3">
              <div className="lg:hidden">
                <Suspense fallback={<div className="h-9 w-24 animate-pulse rounded-md bg-muted" />}>
                  <CarsFilterDrawer makes={makes} models={models} listingCount={totalCount} />
                </Suspense>
              </div>
              <p className="mt-3 text-sm text-muted-foreground hidden lg:block">
                {totalCount} car{totalCount !== 1 ? "s" : ""} found
              </p>
              <Suspense fallback={<div className="h-9 animate-pulse rounded-md bg-muted" />}>
                <CarsSortSelect />
              </Suspense>
            </div>

            <p className="mt-3 text-sm text-muted-foreground block lg:hidden">
              {totalCount} car{totalCount !== 1 ? "s" : ""} found
            </p>

            {filtered.length === 0 && <p className="mt-6 text-muted-foreground">No listings match your filters.</p>}

            {/* Desktop: server-rendered grid + pagination */}
            {totalCount > 0 && (
              <div className="hidden lg:block">
                <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                  {paginated.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
                <div className="mt-8">
                  <CarsPagination totalCount={totalCount} pageSize={pageSize} currentPage={page} />
                </div>
              </div>
            )}

            {/* Mobile: client component with Load More */}
            {totalCount > 0 && (
              <div className="lg:hidden">
                <CarsListWithLoadMore
                  initialListings={sorted.slice(0, pageSize)}
                  initialHasMore={pageSize < totalCount}
                  pageSize={pageSize}
                  searchParams={params}
                />
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="bg-[#F5F5F7] py-12">
        <HowItWorks />
      </section>
    </main>
  );
}
