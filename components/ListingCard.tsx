"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { formatMileage, formatPrice } from "@/lib/format";
import type { Listing } from "@/schema";
import { Car, Clock, Fuel, Gauge, MapPin, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type ListingWithDetails = Listing & {
  makeName?: string;
  modelName?: string;
  primaryImageUrl?: string;
  /** Trim/variant (e.g. "1.3 XE CVT") - placeholder if not available */
  trim?: string;
  /** Fuel efficiency in km/L - placeholder if not available */
  fuelEfficiency?: number;
  /** Engine displacement (e.g. 1.8) - placeholder if not available */
  engineDisplacement?: string;
};

function formatTimeAgo(createdAt?: string): string {
  if (!createdAt) return "N/A";
  try {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  } catch {
    return "N/A";
  }
}

function SpecItem({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="size-4 shrink-0" />
      {label}
    </span>
  );
}

export function ListingCard({ listing }: { listing: ListingWithDetails }) {
  const [imageError, setImageError] = useState(false);
  const titleParts = [listing.year, listing.makeName, listing.modelName, listing.trim].filter(Boolean);
  const title = titleParts.length > 0 ? titleParts.join(" ") : "Car";
  const transmissionLabel = ["cvt", "dct"].includes(listing.transmission.toLowerCase())
    ? listing.transmission.toUpperCase()
    : listing.transmission.charAt(0).toUpperCase() + listing.transmission.slice(1);

  return (
    <Link href={`/cars/${listing.id}`} className="block">
      <Card className="overflow-hidden p-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-4/3 bg-muted">
          {listing.primaryImageUrl && !imageError ? (
            <Image src={listing.primaryImageUrl} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" onError={() => setImageError(true)} />
          ) : (
            <ImagePlaceholder fill className="rounded-none border-0" />
          )}
          <div className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {formatTimeAgo(listing.createdAt)}
            </span>
          </div>
        </div>
        <CardContent className="space-y-2 pb-5">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xl font-bold text-primary">{formatPrice(listing.price)}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <SpecItem icon={Gauge} label={formatMileage(listing.mileage)} />
            <SpecItem icon={Fuel} label={listing.fuelEfficiency ? `${listing.fuelEfficiency} km/L` : "N/A"} />
            <SpecItem icon={Settings} label={transmissionLabel} />
            <SpecItem icon={Car} label={listing.engineDisplacement ? `${listing.engineDisplacement}L` : "N/A"} />
          </div>
          <SpecItem icon={MapPin} label={listing.location || "N/A"} />
        </CardContent>
      </Card>
    </Link>
  );
}
