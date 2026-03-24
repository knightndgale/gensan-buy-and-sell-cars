import { SellerDashboardGreeting, SellerDashboardSidebar } from "@/components/seller/SellerDashboardSidebar";
import { SellerListingsSection, type ListingForSection } from "@/components/seller/SellerListingsSection";
import { Button } from "@/components/ui/button";
import { getSessionToken } from "@/lib/auth";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";
import { getDealerByUserId } from "@/lib/firestore/dealers";
import { getListingImages } from "@/lib/firestore/listing-images";
import { getListingsByDealer } from "@/lib/firestore/listings";
import { headers } from "next/headers";
import Link from "next/link";

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
      const model = modelMap.get(listing.modelId ?? 0);
      const makeId = model?.makeId ?? 0;
      const derivedTitle = [makeMap.get(makeId), model?.name, listing.year].filter(Boolean).join(" ");
      const title = listing.title?.trim() || derivedTitle;
      return {
        id: listing.id,
        title,
        price: listing.price ?? 0,
        status: listing.status ?? "active",
        primaryImageUrl: primary?.imageUrl,
        createdAt: listing.createdAt,
        updatedAt: listing.updatedAt,
        soldAt: listing.soldAt ?? undefined,
        views: listing.views ?? 0,
      };
    }),
  );

  const counts = {
    total: resolved.length,
    active: resolved.filter((l) => l.status === "active").length,
    sold: resolved.filter((l) => l.status === "sold").length,
    pending: resolved.filter((l) => l.status === "pending").length,
  };

  const dealerName = dealer?.dealershipName ?? "Seller";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[340px_1fr] lg:gap-x-8 lg:gap-y-6">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <SellerDashboardGreeting dealerName={dealerName} />
        </div>

        <div className="hidden min-w-0 items-center justify-end lg:col-start-2 lg:row-start-1 lg:flex">
          <Button asChild className="shrink-0 bg-primary ">
            <Link href="/seller/listings/new">+ Add New Listing</Link>
          </Button>
        </div>

        <aside className="min-w-0 lg:col-start-1 lg:row-start-2">
          <SellerDashboardSidebar counts={counts} />
        </aside>

        <main className="min-w-0 lg:col-start-2 lg:row-start-2 lg:rounded-xl lg:border lg:border-border lg:bg-white lg:p-6">
          <SellerListingsSection listings={resolved} />
        </main>
      </div>
    </div>
  );
}
