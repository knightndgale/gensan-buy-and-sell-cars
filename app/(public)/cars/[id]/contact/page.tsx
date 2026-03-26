import { GHLFormEmbed } from "@/components/GHLFormEmbed";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Separator } from "@/components/ui/separator";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";
import { getCarFeaturesByIds } from "@/lib/firestore/features";
import { getListingImages } from "@/lib/firestore/listing-images";
import { getListingById } from "@/lib/firestore/listings";

import { formatMileage, formatPrice } from "@/lib/format";
import { GHL_FORM_EMBED_FALLBACK_URL } from "@/lib/ghl-form";
import { ArrowLeft, Calendar, Fuel, Gauge, MapPin, Settings, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ id: string }> };

const CONTACT_NEXT_STEPS = ["We will review your contact information", "We'll reach out via phone or text within 24 hours", "You can arrange a test drive at a safe, public location"] as const;

function ContactPostFormSection({ listingId }: { listingId: string }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-muted px-4 py-5 sm:px-5">
        <h3 className="text-center text-base font-semibold text-foreground md:text-left">What Happens Next?</h3>
        <ol className="mt-4 list-none space-y-3 p-0">
          {CONTACT_NEXT_STEPS.map((text, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground" aria-hidden>
                {i + 1}
              </span>
              <p className="min-w-0 pt-0.5 text-sm leading-snug text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 shrink-0 text-primary" aria-hidden />
          <p className="text-sm font-semibold text-primary">Safety Reminder</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-primary">Always meet in a public place for test drives. SM GenSan parking area is a popular and safe meetup spot for car transactions.</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
        <Button asChild className="w-full rounded-lg md:flex-1" size="lg">
          <Link href={`/cars/${listingId}`}>Back to Car Details</Link>
        </Button>
        <Button asChild variant="outline" className="w-full rounded-lg border-border md:flex-1" size="lg">
          <Link href="/cars">Browse More Cars</Link>
        </Button>
      </div>
    </div>
  );
}

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

  const sortedImages = [...images].sort((a, b) => (a.isPrimary ? -1 : b.isPrimary ? 1 : 0));
  const coverImage = sortedImages[0];

  return (
    <div className="container mx-auto max-w-7xl px-3 py-6 pb-32 sm:px-4 md:pb-8 lg:py-8">
      {/* Mobile: back + page title + divider (matches design) */}
      <header className="mb-4 lg:hidden">
        <div className="flex items-center gap-3">
          <Link href={`/cars/${id}`} className="flex size-9 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-muted" aria-label="Back to listing">
            <ArrowLeft className="size-5" aria-hidden />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Leave Contact Info</h1>
        </div>
        <Separator className="mt-4" />
      </header>

      <div className="mb-4 hidden lg:block">
        <Link href={`/cars/${id}`} className="inline-flex items-center gap-2 text-sm text-foreground hover:underline">
          <ArrowLeft className="size-4" aria-hidden />
          <span>Back to listing</span>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-start lg:gap-8 ">
        {/* Car summary: mobile = horizontal thumb + text; desktop = stacked hero + full details */}
        <Card className="h-fit overflow-hidden  bg-muted p-0 lg:bg-card shadow-none ">
          <div className="flex gap-3 p-3 lg:flex-col lg:gap-0 lg:p-0">
            <div className="relative size-22 shrink-0 overflow-hidden rounded-lg bg-muted lg:aspect-video lg:size-auto lg:rounded-none">
              {coverImage ? (
                <Image src={coverImage.imageUrl} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 88px, 50vw" />
              ) : (
                <ImagePlaceholder fill className="rounded-lg border-0 lg:rounded-none" />
              )}
            </div>
            <CardContent className="min-w-0 flex-1 space-y-1.5 p-0 lg:space-y-3 lg:px-6 lg:pb-6 lg:pt-4">
              <p className="text-base font-bold leading-snug text-foreground lg:text-xl">{title}</p>
              <p className="text-lg font-bold text-primary lg:text-2xl">{priceLabel}</p>
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground lg:items-center lg:text-sm">
                <MapPin className="mt-0.5 size-3.5 shrink-0 lg:mt-0 lg:size-4" />
                {locationLabel}
              </div>

              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Gauge className="size-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{mileageLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="size-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{listing.transmission ? formatTransmission(listing.transmission) : "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="size-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{listing.fuelType ? formatFuelType(listing.fuelType) : "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{yearLabel}</span>
                  </div>
                </div>

                {resolvedFeatures.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="pt-2">
                      <h3 className="font-semibold">Features</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {resolvedFeatures.map((f) => (
                          <span key={f.id} className="rounded-full bg-primary/10 px-3 py-1.5 text-sm text-foreground">
                            {f.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Form column */}
        <div className="space-y-4 lg:sticky lg:top-24 md:border md:rounded-xl md:p-4">
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold">Leave Your Contact Info</h2>
            <p className="mt-1 text-sm text-muted-foreground">Fill in your contact details below. We will reach out to you directly.</p>
          </div>
          <p className="text-sm text-muted-foreground lg:hidden">Fill in your contact details below. We will reach out to you directly.</p>
          <div className="rounded-lg shadow-none">
            <GHLFormEmbed formUrl={GHL_FORM_EMBED_FALLBACK_URL} />
          </div>
          <ContactPostFormSection listingId={id} />
        </div>
      </div>
    </div>
  );
}
