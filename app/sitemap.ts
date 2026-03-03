import { MetadataRoute } from "next";
import { getListings } from "@/lib/firestore/listings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gensancars.com";
  let listingUrls: MetadataRoute.Sitemap = [];
  try {
    const listings = await getListings({ status: "active", limitCount: 500 });
    listingUrls = listings.map((l) => ({
      url: `${baseUrl}/cars/${l.id}`,
      lastModified: l.updatedAt ? new Date(l.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: l.isFeatured ? 0.8 : 0.6,
    }));
  } catch {
    // Firebase may not be configured during build
  }

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/cars`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...listingUrls,
  ];
}
