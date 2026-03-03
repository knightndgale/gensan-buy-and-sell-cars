import Link from "next/link";
import { headers } from "next/headers";
import { getSessionToken } from "@/lib/auth";
import { getDealerByUserId } from "@/lib/firestore/dealers";
import { getListingsByDealer } from "@/lib/firestore/listings";
import { KPICards } from "@/components/seller/KPICards";
import { RecentLeadsTable } from "@/components/seller/RecentLeadsTable";
import { EarningsSummary } from "@/components/seller/EarningsSummary";
import { ReferralReminder } from "@/components/seller/ReferralReminder";
import { Button } from "@/components/ui/button";

export default async function SellerDashboardPage() {
  const headersList = await headers();
  const session = await getSessionToken(headersList.get("cookie"));
  const dealer = session ? await getDealerByUserId(session.uid) : null;
  const listings = dealer ? await getListingsByDealer(dealer.id) : [];
  const activeCount = listings.filter((l) => l.status === "active").length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">
          Welcome, {dealer?.dealershipName ?? "Seller"}!
        </h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/seller/listings">Manage Listings</Link>
          </Button>
          <Button asChild variant="default" className="bg-orange-500 hover:bg-orange-600">
            <Link href="/seller/listings/new">Add New Listing</Link>
          </Button>
        </div>
      </div>

      <KPICards
        activeListings={activeCount}
        dealerId={dealer?.ghlLocationId ?? undefined}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <RecentLeadsTable dealerId={dealer?.ghlLocationId} />
        <div className="space-y-8">
          <EarningsSummary dealerId={dealer?.ghlLocationId} />
          <ReferralReminder />
        </div>
      </div>
    </div>
  );
}
