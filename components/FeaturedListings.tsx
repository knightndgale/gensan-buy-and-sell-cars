import { getFeaturedListings } from "@/lib/firestore/listings";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";
import { getListingImages } from "@/lib/firestore/listing-images";
import { ListingCard, type ListingWithDetails } from "@/components/ListingCard";

export async function FeaturedListings() {
  const [listings, models, makes] = await Promise.all([
    getFeaturedListings(6),
    getCarModels(),
    getCarMakes(),
  ]);

  const modelMap = new Map(models.map((m) => [m.id, m]));
  const makeMap = new Map(makes.map((m) => [m.id, m.name]));

  const resolved: ListingWithDetails[] = await Promise.all(
    listings.map(async (l) => {
      const model = modelMap.get(l.modelId);
      const images = await getListingImages(l.id);
      const primary = images.find((i) => i.isPrimary) ?? images[0];
      return {
        ...l,
        makeName: model ? makeMap.get(model.makeId) : undefined,
        modelName: model?.name,
        primaryImageUrl: primary?.imageUrl,
      };
    })
  );

  if (resolved.length === 0) {
    return (
      <section className="py-12">
        <h2 className="mb-6 text-2xl font-bold">Featured Listings</h2>
        <p className="text-muted-foreground">No featured listings at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="mb-6 text-2xl font-bold">Featured Listings</h2>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resolved.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
