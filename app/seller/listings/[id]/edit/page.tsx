import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSessionToken } from "@/lib/auth";
import { getDealerByUserId } from "@/lib/firestore/dealers";
import { getListingById } from "@/lib/firestore/listings";
import { ListingForm } from "@/components/seller/ListingForm";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params;
  const headersList = await headers();
  const session = await getSessionToken(headersList.get("cookie"));
  const dealer = session ? await getDealerByUserId(session.uid) : null;
  const listing = await getListingById(id);

  if (!listing || !dealer || listing.dealerId !== dealer.id) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Edit Listing</h1>
      <ListingForm
        initialData={{
          modelId: listing.modelId,
          year: listing.year,
          price: listing.price,
          mileage: listing.mileage,
          transmission: listing.transmission,
          fuelType: listing.fuelType,
          location: listing.location,
          description: listing.description,
          status: listing.status,
          isFeatured: listing.isFeatured,
        }}
        listingId={id}
      />
    </div>
  );
}
