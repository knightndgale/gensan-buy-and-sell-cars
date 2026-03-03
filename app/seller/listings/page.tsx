import { SellerListingCard } from "@/components/seller/SellerListingCard";
import { Button } from "@/components/ui/button";
import { getSessionToken } from "@/lib/auth";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";
import { getDealerByUserId } from "@/lib/firestore/dealers";
import { getListingImages } from "@/lib/firestore/listing-images";
import { getListingsByDealer } from "@/lib/firestore/listings";
import { headers } from "next/headers";
import Link from "next/link";

export default async function SellerListingsPage() {
  const headersList = await headers();
  const session = await getSessionToken(headersList.get("cookie"));
  const dealer = session ? await getDealerByUserId(session.uid) : null;
  const listings = dealer ? await getListingsByDealer(dealer.id) : [];
  const models = await getCarModels();
  const makes = await getCarMakes();
  const modelMap = new Map(models.map((m) => [m.id, m]));
  const makeMap = new Map(makes.map((m) => [m.id, m.name]));

  const resolved = await Promise.all(
    listings.map(async (listing) => {
      const images = await getListingImages(listing.id);
      const primary = images.find((i) => i.isPrimary) ?? images[0];
      const model = modelMap.get(listing.modelId);
      const title = [makeMap.get(model?.makeId ?? 0), model?.name, listing.year].filter(Boolean).join(" ");
      return {
        ...listing,
        title,
        primaryImageUrl: primary?.imageUrl,
      };
    }),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Listings</h1>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link href="/seller/listings/new">Add New Listing</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {resolved.map((listing) => (
          <SellerListingCard key={listing.id} id={listing.id} title={listing.title} price={listing.price} status={listing.status} primaryImageUrl={listing.primaryImageUrl} />
        ))}
      </div>

      {listings.length === 0 && <p className="text-center text-muted-foreground">No listings yet. Add your first one!</p>}
    </div>
  );
}
