import { GHLFormEmbed } from "@/components/GHLFormEmbed";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Separator } from "@/components/ui/separator";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";
import { getCarFeaturesByIds } from "@/lib/firestore/features";
import { getListingImages } from "@/lib/firestore/listing-images";
import { getListingById } from "@/lib/firestore/listings";

import { formatMileage, formatPrice } from "@/lib/format";
import { GHL_FORM_EMBED_FALLBACK_URL } from "@/lib/ghl-form";
import { ArrowLeft, Calendar, Fuel, Gauge, MapPin, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

function formatTransmission(t: string): string {
  return ["cvt", "dct"].includes(t.toLowerCase()) ? t.toUpperCase() : t.charAt(0).toUpperCase() + t.slice(1);
}

function formatFuelType(t: string): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export default async function CarContactPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing || listing.status !== "active") notFound();

  const [images, models, makes, resolvedFeatures] = await Promise.all([getListingImages(id), getCarModels(), getCarMakes(), getCarFeaturesByIds(listing.features ?? [])]);

  const model = typeof listing.modelId === "number" ? models.find((m) => m.id === listing.modelId) : undefined;
  const make = model ? makes.find((m2) => m2.id === model.makeId) : undefined;

  const derivedTitle = [make?.name, model?.name, listing.year].filter(Boolean).join(" ");
  const title = listing.title?.trim() || derivedTitle;
  const locationLabel = listing.location?.trim() || "N/A";
  const priceLabel = typeof listing.price === "number" ? formatPrice(listing.price) : "N/A";
  const mileageLabel = typeof listing.mileage === "number" ? formatMileage(listing.mileage) : "N/A";
  const yearLabel = typeof listing.year === "number" ? String(listing.year) : "—";

  return (
    <div className="container mx-auto max-w-7xl px-3 py-8 pb-32 sm:px-4 md:pb-8">
      <div className="mb-4">
        <Link href={`/cars/${id}`} className="text-sm text-primary items-center gap-2 inline-flex hover:underline">
          <ArrowLeft className="size-4" aria-hidden />
          <span>Back to listing</span>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-start">
        {/* Left: Car summary card */}
        <Card className="h-fit self-start overflow-hidden p-0">
          <div className="relative aspect-video bg-muted">
            {images.length > 0 ? (
              <Image src={[...images].sort((a, b) => (a.isPrimary ? -1 : b.isPrimary ? 1 : 0))[0].imageUrl} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <ImagePlaceholder fill className="rounded-none border-0" />
            )}
          </div>
          <CardContent className="space-y-3 pb-6 pt-4">
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="text-2xl font-bold text-primary">{priceLabel}</p>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {locationLabel}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2">
                <Gauge className="size-4 shrink-0 text-primary" />
                <div>
                  <span className="text-sm font-medium">{mileageLabel}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="size-4 shrink-0 text-primary" />
                <div>
                  <span className="text-sm font-medium">{listing.transmission ? formatTransmission(listing.transmission) : "—"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="size-4 shrink-0 text-primary" />
                <div>
                  <span className="text-sm font-medium">{listing.fuelType ? formatFuelType(listing.fuelType) : "—"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0 text-primary" />
                <div>
                  <span className="text-sm font-medium">{yearLabel}</span>
                </div>
              </div>
            </div>

            <Separator className="my-4" />
            {resolvedFeatures.length > 0 && (
              <div className="pt-2">
                <h2 className="font-semibold">Features</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {resolvedFeatures.map((f) => (
                    <span key={f.id} className="rounded-full bg-primary/10 px-3 py-1.5 text-sm text-foreground">
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Header + GHL form iframe */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div>
            <h2 className="text-xl font-bold">Leave Your Contact Info</h2>
            <p className="mt-1 text-sm text-muted-foreground">Fill in your contact details below. We will reach out to you directly.</p>
          </div>
          <div className="rounded-lg shadow-none">
            <GHLFormEmbed formUrl={GHL_FORM_EMBED_FALLBACK_URL} />
          </div>
        </div>
      </div>
    </div>
  );
}
