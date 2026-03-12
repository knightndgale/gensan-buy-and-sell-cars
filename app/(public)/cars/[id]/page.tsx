import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/firestore/listings";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";
import { getCarFeaturesByIds } from "@/lib/firestore/features";
import { getListingImages } from "@/lib/firestore/listing-images";
import { getDealerById } from "@/lib/firestore/dealers";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatMileage } from "@/lib/format";
import { CarImageCarousel } from "@/components/CarImageCarousel";
import { CarDetailContactSection } from "@/components/CarDetailContactSection";
import {
  MapPin,
  Gauge,
  Fuel,
  Settings,
  Calendar,
  Car,
  Cog,
  Palette,
} from "lucide-react";

type PageProps = { params: Promise<{ id: string }> };

function formatTransmission(t: string): string {
  return ["cvt", "dct"].includes(t.toLowerCase())
    ? t.toUpperCase()
    : t.charAt(0).toUpperCase() + t.slice(1);
}

function formatFuelType(t: string): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "??";
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing || listing.status !== "active") notFound();

  const [images, models, makes, resolvedFeatures] = await Promise.all([
    getListingImages(id),
    getCarModels(),
    getCarMakes(),
    getCarFeaturesByIds(listing.features ?? []),
  ]);

  const model = typeof listing.modelId === "number" ? models.find((m) => m.id === listing.modelId) : undefined;
  const make = model ? makes.find((m2) => m2.id === model.makeId) : undefined;
  const dealer = listing.dealerId ? await getDealerById(listing.dealerId) : null;

  const derivedTitle = [make?.name, model?.name, listing.year].filter(Boolean).join(" ");
  const title = listing.title?.trim() || derivedTitle;
  const locationLabel = listing.location?.trim() || "N/A";
  const priceLabel = typeof listing.price === "number" ? formatPrice(listing.price) : "N/A";
  const mileageLabel = typeof listing.mileage === "number" ? formatMileage(listing.mileage) : "N/A";
  const yearLabel = typeof listing.year === "number" ? String(listing.year) : "—";

  const detailsContent = (
    <Card className="h-fit">
      <CardContent className="pt-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-2xl font-bold text-primary">
          {priceLabel}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          {locationLabel}
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <Gauge className="size-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Mileage</span>
            <span className="text-sm font-medium">{mileageLabel}</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Fuel className="size-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Fuel</span>
            <span className="text-sm font-medium">{listing.fuelType ? formatFuelType(listing.fuelType) : "—"}</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Settings className="size-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Transmission</span>
            <span className="text-sm font-medium">{listing.transmission ? formatTransmission(listing.transmission) : "—"}</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Calendar className="size-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Year</span>
            <span className="text-sm font-medium">{yearLabel}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <section>
          <h2 className="font-semibold">Description</h2>
          <p className="mt-2 text-muted-foreground">{listing.description?.trim() || "—"}</p>
        </section>

        <Separator className="my-4" />

        <section>
          <h2 className="font-semibold">Specifications</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Car className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <span className="block text-xs text-muted-foreground">Body Type</span>
                <span className="text-sm font-medium">{listing.bodyType || "—"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Cog className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <span className="block text-xs text-muted-foreground">Engine</span>
                <span className="text-sm font-medium">{listing.engine || "—"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Palette className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <span className="block text-xs text-muted-foreground">Color</span>
                <span className="text-sm font-medium">{listing.color || "—"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Fuel className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <span className="block text-xs text-muted-foreground">Fuel Type</span>
                <span className="text-sm font-medium">{listing.fuelType ? formatFuelType(listing.fuelType) : "—"}</span>
              </div>
            </div>
          </div>
        </section>

        {resolvedFeatures.length > 0 && (
          <>
            <Separator className="my-4" />
            <section>
              <h2 className="font-semibold">Features</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {resolvedFeatures.map((f) => (
                  <span
                    key={f.id}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-sm text-foreground"
                  >
                    {f.name}
                  </span>
                ))}
              </div>
            </section>
          </>
        )}

        {dealer && (
          <>
            <Separator className="my-4" />
            <section>
              <h2 className="font-semibold">Seller</h2>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {getInitials(dealer.dealershipName)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium">{dealer.dealershipName}</p>
                  <p className="text-sm text-muted-foreground">{dealer.location}</p>
                </div>
              </div>
            </section>
          </>
        )}

        <Separator className="my-4" />

        <CarDetailContactSection
          dealer={dealer}
          listingId={id}
          carName={title}
        />
      </CardContent>
    </Card>
  );

  return (
    <main className="container mx-auto max-w-7xl px-3 py-8 pb-32 sm:px-4 md:pb-8">
      <div className="mb-4">
        <Link href="/cars" className="text-sm text-primary hover:underline">
          ← Back to listings
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="space-y-4">
          <CarImageCarousel images={images} alt={title} />
        </div>

        <div className="lg:sticky lg:top-24">{detailsContent}</div>
      </div>

      {/* Floating contact bar - mobile only */}
      {dealer && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {getInitials(dealer.dealershipName)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{dealer.dealershipName}</p>
                <p className="truncate text-xs text-muted-foreground">{dealer.location}</p>
              </div>
            </div>
            <CarDetailContactSection
              dealer={dealer}
              listingId={id}
              carName={title}
            />
          </div>
        </div>
      )}
    </main>
  );
}
