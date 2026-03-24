import type { ListingWithDetails } from "@/components/ListingCard";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";
import { getListingImages } from "@/lib/firestore/listing-images";
import { getListings } from "@/lib/firestore/listings";

export type BrowseParams = {
  make?: string;
  model?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  minMileage?: number;
  maxMileage?: number;
  transmission?: string;
  bodyType?: string;
  location?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  pageSize?: number;
  status?: "all" | "active" | "pending" | "sold";
};

function matchesKeyword(listing: ListingWithDetails, q: string): boolean {
  const term = q.toLowerCase();
  const fields = [listing.title, listing.makeName, listing.modelName, listing.description].filter(Boolean) as string[];
  return fields.some((f) => f.toLowerCase().includes(term));
}

export async function getBrowseListingsPage(params: BrowseParams): Promise<{
  listings: ListingWithDetails[];
  totalCount: number;
  hasMore: boolean;
}> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(24, Math.max(6, params.pageSize ?? 6)) || 6;

  const makeId = params.make ? parseInt(params.make, 10) : undefined;
  const modelId = params.model ? parseInt(params.model, 10) : undefined;

  const statusFilter = params.status === "all" ? undefined : (params.status ?? "active");

  const [listings, models, makes] = await Promise.all([
    getListings({
      status: statusFilter,
      makeId,
      modelId,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      location: params.location,
      year: params.year,
      transmission: params.transmission,
      bodyType: params.bodyType,
    }),
    getCarModels(makeId),
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

  if (params.minMileage !== undefined && !isNaN(params.minMileage)) {
    filtered = filtered.filter((l) => typeof l.mileage === "number" && l.mileage >= params.minMileage!);
  }
  if (params.maxMileage !== undefined && !isNaN(params.maxMileage)) {
    filtered = filtered.filter((l) => typeof l.mileage === "number" && l.mileage <= params.maxMileage!);
  }
  if (params.q) {
    filtered = filtered.filter((l) => matchesKeyword(l, params.q!));
  }

  const sort = params.sort ?? "newest";
  const sorted =
    sort === "price_asc"
      ? [...filtered].sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY))
      : sort === "price_desc"
        ? [...filtered].sort((a, b) => (b.price ?? Number.NEGATIVE_INFINITY) - (a.price ?? Number.NEGATIVE_INFINITY))
        : filtered;

  const totalCount = sorted.length;
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const hasMore = page * pageSize < totalCount;

  return { listings: paginated, totalCount, hasMore };
}
