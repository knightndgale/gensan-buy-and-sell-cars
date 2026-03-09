import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/firestore/listings";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";
import { getListingImages } from "@/lib/firestore/listing-images";
import { getDealerById } from "@/lib/firestore/dealers";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, formatMileage } from "@/lib/format";
import { GHLFormEmbed } from "@/components/GHLFormEmbed";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

type PageProps = { params: Promise<{ id: string }> };

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing || listing.status !== "active") notFound();

  const [images, models, makes] = await Promise.all([
    getListingImages(id),
    getCarModels(),
    getCarMakes(),
  ]);

  const model = models.find((m) => m.id === listing.modelId);
  const make = model ? makes.find((m2) => m2.id === model.makeId) : undefined;
  const dealer = await getDealerById(listing.dealerId);

  const title = [make?.name, model?.name, listing.year].filter(Boolean).join(" ");

  return (
    <main className="container mx-auto max-w-7xl px-3 py-8 sm:px-4">
      <div className="mb-6">
        <Link href="/cars" className="text-primary hover:underline">
          ← Back to listings
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            {images.length > 0 ? (
              <Image
                src={images.find((i) => i.isPrimary)?.imageUrl ?? images[0].imageUrl}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <ImagePlaceholder fill className="rounded-lg border-0" />
            )}
          </div>
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="mt-2 text-2xl font-bold text-primary">
                {formatPrice(listing.price)}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>Mileage: {formatMileage(listing.mileage)}</li>
                <li>Transmission: {listing.transmission}</li>
                <li>Fuel: {listing.fuelType}</li>
                <li>Location: {listing.location}</li>
              </ul>
              <p className="mt-4 text-muted-foreground">{listing.description}</p>
              {dealer && (
                <p className="mt-2 text-sm">
                  Dealer: {dealer.dealershipName} • {dealer.location}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Interested? Submit your details</h2>
          <GHLFormEmbed
            formUrl={dealer?.ghlFormEmbedUrl}
            listingId={id}
            carName={title}
          />
        </div>
      </div>
    </main>
  );
}
