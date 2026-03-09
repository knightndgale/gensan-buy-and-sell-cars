import { SellerDashboardSidebar } from "@/components/seller/SellerDashboardSidebar";
import { SellerListingsSection, type ListingForSection } from "@/components/seller/SellerListingsSection";
import { getSessionToken } from "@/lib/auth";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";
import { getDealerByUserId } from "@/lib/firestore/dealers";
import { getListingImages } from "@/lib/firestore/listing-images";
import { getListingsByDealer } from "@/lib/firestore/listings";
import { headers } from "next/headers";

export default async function SellerDashboardPage() {
  const headersList = await headers();
  const session = await getSessionToken(headersList.get("cookie"));
  const dealer = session ? await getDealerByUserId(session.uid) : null;
  const listings = dealer ? await getListingsByDealer(dealer.id) : [];

  const models = await getCarModels();
  const makes = await getCarMakes();
  const modelMap = new Map(models.map((m) => [m.id, m]));
  const makeMap = new Map(makes.map((m) => [m.id, m.name]));

  const resolved: ListingForSection[] = await Promise.all(
    listings.map(async (listing) => {
      const images = await getListingImages(listing.id);
      const primary = images.find((i) => i.isPrimary) ?? images[0];
      const model = modelMap.get(listing.modelId);
      const derivedTitle = [makeMap.get(model?.makeId ?? 0), model?.name, listing.year].filter(Boolean).join(" ");
      const title = listing.title?.trim() || derivedTitle;
      return {
        id: listing.id,
        title,
        price: listing.price,
        status: listing.status,
        primaryImageUrl: primary?.imageUrl,
        createdAt: listing.createdAt,
        updatedAt: listing.updatedAt,
        soldAt: listing.soldAt ?? undefined,
        views: 0,
      };
    }),
  );

  const counts = {
    total: resolved.length,
    active: resolved.filter((l) => l.status === "active").length,
    sold: resolved.filter((l) => l.status === "sold").length,
    pending: resolved.filter((l) => l.status === "pending").length,
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-6">
          <SellerDashboardSidebar dealerName={dealer?.dealershipName ?? "Seller"} counts={counts} />
        </aside>
        <main>
          <SellerListingsSection listings={resolved} />
        </main>
      </div>
    </div>
  );
}
