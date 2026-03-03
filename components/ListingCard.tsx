"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Button } from "@/components/ui/button";
import { formatPrice, formatMileage } from "@/lib/format";
import type { Listing } from "@/schema";

export type ListingWithDetails = Listing & {
  makeName?: string;
  modelName?: string;
  primaryImageUrl?: string;
};

export function ListingCard({ listing }: { listing: ListingWithDetails }) {
  const [imageError, setImageError] = useState(false);
  const title = [listing.makeName, listing.modelName, listing.year].filter(Boolean).join(" ") || "Car";
  const specs = [
    formatMileage(listing.mileage),
    listing.transmission.charAt(0).toUpperCase() + listing.transmission.slice(1),
    listing.location,
  ].join(", ");

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted">
        {listing.primaryImageUrl && !imageError ? (
          <Image
            src={listing.primaryImageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <ImagePlaceholder fill className="rounded-none border-0" />
        )}
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-lg font-bold text-primary">{formatPrice(listing.price)}</p>
        <p className="text-sm text-muted-foreground">{specs}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="default" className="w-full">
          <Link href={`/cars/${listing.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
