import { CarDetailContactSection } from "@/components/CarDetailContactSection";
import { CarDetailMobileFloatingContactBar } from "@/components/CarDetailMobileFloatingContactBar";
import { CarImageCarousel } from "@/components/CarImageCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSessionToken } from "@/lib/auth";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";
import { getDealerById } from "@/lib/firestore/dealers";
import { getCarFeaturesByIds } from "@/lib/firestore/features";
import { getListingImages } from "@/lib/firestore/listing-images";
import { getListingById } from "@/lib/firestore/listings";
import { formatMileage, formatPrice } from "@/lib/format";
import { Calendar, Car, Cog, Fuel, Gauge, MapPin, Palette, Settings } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

function formatTransmission(t: string): string {
  return ["cvt", "dct"].includes(t.toLowerCase()) ? t.toUpperCase() : t.charAt(0).toUpperCase() + t.slice(1);
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
  if (!listing) notFound();

  const headersList = await headers();
  const session = await getSessionToken(headersList.get("cookie"), headersList.get("authorization"));
  const isAdmin = session?.role === "admin";

  // Non-admin users can only view active listings
  if (!isAdmin && listing.status !== "active") notFound();

  const [images, models, makes, resolvedFeatures] = await Promise.all([getListingImages(id), getCarModels(), getCarMakes(), getCarFeaturesByIds(listing.features ?? [])]);

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
        <p className="mt-2 text-2xl font-bold text-primary">{priceLabel}</p>
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
                  <span key={f.id} className="rounded-full bg-primary/10 px-3 py-1.5 text-sm text-foreground">
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
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">{getInitials(dealer.dealershipName)}</div>
                <div className="min-w-0">
                  <p className="font-medium">{dealer.dealershipName}</p>
                  <p className="text-sm text-muted-foreground">{dealer.location}</p>
                </div>
              </div>
            </section>
          </>
        )}

        <Separator className="my-4" />

        {/* This is the main in-page contact section. On mobile, we use a floating
            bar that hides itself when this section is visible, so they don't overlap. */}
        <section id="car-detail-contact-section">
          <CarDetailContactSection
            dealer={dealer}
            listingId={id}
            carName={title}
            isAdmin={isAdmin}
            listingStatus={listing.status as "active" | "pending" | "sold"}
          />
        </section>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto max-w-7xl px-3 py-8 pb-32 sm:px-4 md:pb-8">
      <section className="mb-4">
        <Link href="/cars" className="text-sm text-primary hover:underline">
          ← Back to listings
        </Link>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div className="space-y-4">
          <CarImageCarousel images={images} alt={title} />
        </div>

        <div className="lg:sticky lg:top-24">{detailsContent}</div>
      </div>

      {/* Floating contact bar - mobile only (hides itself when the in-page contact section is visible) */}
      {(dealer || isAdmin) && (
        <CarDetailMobileFloatingContactBar
          dealer={dealer}
          listingId={id}
          carName={title}
          contactSectionId="car-detail-contact-section"
          isAdmin={isAdmin}
          listingStatus={listing.status as "active" | "pending" | "sold"}
        />
      )}
    </div>
  );
}
