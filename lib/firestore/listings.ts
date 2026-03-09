import { FieldValue, type Query } from "firebase-admin/firestore";
import type { Listing, ListingInput } from "@/schema";
import { getAdminDbSafe } from "@/lib/firebase/admin";

const LISTINGS_COLLECTION = "listings";

function toListing(id: string, data: Record<string, unknown>): Listing {
  const ts = (v: unknown) =>
    typeof v === "object" && v !== null && "toDate" in v && typeof (v as { toDate: () => Date }).toDate === "function"
      ? (v as { toDate: () => Date }).toDate().toISOString()
      : typeof v === "string"
        ? v
        : undefined;
  const featuresRaw = data.features;
  const features = Array.isArray(featuresRaw)
    ? (featuresRaw as unknown[]).filter((v): v is string => typeof v === "string")
    : undefined;

  return {
    id,
    dealerId: data.dealerId as string,
    modelId: data.modelId as number,
    year: data.year as number,
    price: data.price as number,
    mileage: data.mileage as number,
    transmission: data.transmission as Listing["transmission"],
    fuelType: data.fuelType as Listing["fuelType"],
    location: data.location as string,
    description: data.description as string,
    status: data.status as Listing["status"],
    isFeatured: (data.isFeatured as boolean) ?? false,
    bodyType: (data.bodyType as string) || undefined,
    engine: (data.engine as string) || undefined,
    color: (data.color as string) || undefined,
    features: features?.length ? features : undefined,
    createdAt: ts(data.createdAt),
    updatedAt: ts(data.updatedAt),
  };
}

function getDb() {
  const db = getAdminDbSafe();
  if (!db) throw new Error("Firebase not configured");
  return db;
}

export async function getListings(
  filters: {
    status?: string;
    modelId?: number;
    makeId?: number;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    limitCount?: number;
  } = {}
): Promise<Listing[]> {
  const db = getAdminDbSafe();
  if (!db) return [];
  let q: Query = db.collection(LISTINGS_COLLECTION) as Query;
  if (filters.status) q = q.where("status", "==", filters.status);
  if (filters.modelId) q = q.where("modelId", "==", filters.modelId);
  if (filters.minPrice !== undefined) q = q.where("price", ">=", filters.minPrice);
  if (filters.maxPrice !== undefined) q = q.where("price", "<=", filters.maxPrice);
  if (filters.location) q = q.where("location", "==", filters.location);
  q = q.orderBy("createdAt", "desc").limit(filters.limitCount ?? 50);

  const snapshot = await q.get();
  return snapshot.docs.map((d) => toListing(d.id, d.data()));
}

export async function getListingById(id: string): Promise<Listing | null> {
  const db = getAdminDbSafe();
  if (!db) return null;
  const ref = db.collection(LISTINGS_COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  return toListing(snap.id, snap.data() ?? {});
}

export async function getListingsByDealer(dealerId: string): Promise<Listing[]> {
  const db = getAdminDbSafe();
  if (!db) return [];
  const snapshot = await db
    .collection(LISTINGS_COLLECTION)
    .where("dealerId", "==", dealerId)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((d) => toListing(d.id, d.data()));
}

export async function getFeaturedListings(limitCount = 6): Promise<Listing[]> {
  const db = getAdminDbSafe();
  if (!db) return [];
  const snapshot = await db
    .collection(LISTINGS_COLLECTION)
    .where("status", "==", "active")
    .where("isFeatured", "==", true)
    .orderBy("createdAt", "desc")
    .limit(limitCount)
    .get();
  return snapshot.docs.map((d) => toListing(d.id, d.data()));
}

export async function createListing(input: ListingInput): Promise<string> {
  const db = getDb();
  const ref = await db.collection(LISTINGS_COLLECTION).add({
    ...input,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateListing(id: string, input: Partial<ListingInput>): Promise<void> {
  const db = getDb();
  const ref = db.collection(LISTINGS_COLLECTION).doc(id);
  await ref.update({
    ...input,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
