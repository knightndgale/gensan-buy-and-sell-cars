import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSessionToken } from "@/lib/auth";
import { getDealerByUserId } from "@/lib/firestore/dealers";
import { getCarModelById } from "@/lib/firestore/cars";
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

  const model = typeof listing.modelId === "number" ? await getCarModelById(listing.modelId) : null;
  const makeId = model?.makeId ?? 0;

  return (
    <ListingForm
      initialData={{
        modelId: listing.modelId ?? 0,
        makeId,
        year: listing.year ?? new Date().getFullYear(),
        price: listing.price ?? 0,
        mileage: listing.mileage ?? 0,
        transmission: listing.transmission ?? "automatic",
        fuelType: listing.fuelType ?? "gasoline",
        location: listing.location ?? "",
        description: listing.description ?? "",
        status: listing.status ?? "pending",
        isFeatured: listing.isFeatured,
        title: listing.title ?? "",
        bodyType: listing.bodyType ?? "",
        engine: listing.engine ?? "",
        color: listing.color ?? "",
        features: listing.features ?? [],
      }}
      listingId={id}
      listingStatus={listing.status ?? "pending"}
    />
  );
}
