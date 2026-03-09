import { getListings } from "@/lib/firestore/listings";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";
import { getListingImages } from "@/lib/firestore/listing-images";
import { ListingCard, type ListingWithDetails } from "@/components/ListingCard";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CarsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const make = typeof params.make === "string" ? params.make : undefined;
  const model = typeof params.model === "string" ? params.model : undefined;
  const minPrice = typeof params.minPrice === "string" ? parseInt(params.minPrice, 10) : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? parseInt(params.maxPrice, 10) : undefined;
  const location = typeof params.location === "string" ? params.location : undefined;

  const [listings, models, makes] = await Promise.all([
    getListings({
      status: "active",
      modelId: model ? parseInt(model, 10) : undefined,
      minPrice,
      maxPrice,
      location,
    }),
    getCarModels(make ? parseInt(make, 10) : undefined),
    getCarMakes(),
  ]);

  const modelMap = new Map(models.map((m) => [m.id, m]));
  const makeMap = new Map(makes.map((m) => [m.id, m.name]));

  const resolved: ListingWithDetails[] = await Promise.all(
    listings.map(async (l) => {
      const modelInfo = modelMap.get(l.modelId);
      const images = await getListingImages(l.id);
      const primary = images.find((i) => i.isPrimary) ?? images[0];
      return {
        ...l,
        makeName: modelInfo ? makeMap.get(modelInfo.makeId) : undefined,
        modelName: modelInfo?.name,
        primaryImageUrl: primary?.imageUrl,
      };
    })
  );

  return (
    <main className="container mx-auto max-w-7xl px-3 py-8 sm:px-4">
      <h1 className="mb-8 text-2xl font-bold">All Listings</h1>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resolved.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      {resolved.length === 0 && (
        <p className="text-muted-foreground">No listings match your filters.</p>
      )}
    </main>
  );
}
