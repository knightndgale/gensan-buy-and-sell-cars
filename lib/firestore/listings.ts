import { FieldValue, type Query } from "firebase-admin/firestore";
import type { Listing, ListingInput } from "@/schema";
import { getAdminDbSafe } from "@/lib/firebase/admin";
import { getCarModels } from "@/lib/firestore/cars";

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
    title: (data.title as string) || undefined,
    bodyType: (data.bodyType as string) || undefined,
    engine: (data.engine as string) || undefined,
    color: (data.color as string) || undefined,
    features: features?.length ? features : undefined,
    views: (data.views as number) ?? 0,
    createdAt: ts(data.createdAt),
    updatedAt: ts(data.updatedAt),
    soldAt: ts(data.soldAt) ?? null,
  };
}

function getDb() {
  const db = getAdminDbSafe();
  if (!db) throw new Error("Firebase not configured");
  return db;
}

const FIRESTORE_IN_LIMIT = 10;

export async function getListings(
  filters: {
    status?: string;
    modelId?: number;
    makeId?: number;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    year?: number;
    transmission?: string;
    bodyType?: string;
    limitCount?: number;
  } = {}
): Promise<Listing[]> {
  const db = getAdminDbSafe();
  if (!db) return [];

  let modelIds: number[] | undefined;
  if (filters.modelId) {
    modelIds = [filters.modelId];
  } else if (filters.makeId) {
    const models = await getCarModels(filters.makeId);
    modelIds = models.map((m) => m.id);
    if (modelIds.length === 0) return [];
  }

  const runQuery = async (ids: number[]): Promise<Listing[]> => {
    let q: Query = db.collection(LISTINGS_COLLECTION) as Query;
    if (filters.status) q = q.where("status", "==", filters.status);
    if (ids.length === 1) {
      q = q.where("modelId", "==", ids[0]);
    } else if (ids.length > 0) {
      q = q.where("modelId", "in", ids);
    }
    if (filters.minPrice !== undefined) q = q.where("price", ">=", filters.minPrice);
    if (filters.maxPrice !== undefined) q = q.where("price", "<=", filters.maxPrice);
    if (filters.location) q = q.where("location", "==", filters.location);
    if (filters.year !== undefined) q = q.where("year", "==", filters.year);
    if (filters.transmission) q = q.where("transmission", "==", filters.transmission);
    if (filters.bodyType) q = q.where("bodyType", "==", filters.bodyType);
    q = q.orderBy("createdAt", "desc").limit(filters.limitCount ?? 50);
    const snapshot = await q.get();
    return snapshot.docs.map((d) => toListing(d.id, d.data()));
  };

  if (!modelIds) {
    let q: Query = db.collection(LISTINGS_COLLECTION) as Query;
    if (filters.status) q = q.where("status", "==", filters.status);
    if (filters.minPrice !== undefined) q = q.where("price", ">=", filters.minPrice);
    if (filters.maxPrice !== undefined) q = q.where("price", "<=", filters.maxPrice);
    if (filters.location) q = q.where("location", "==", filters.location);
    if (filters.year !== undefined) q = q.where("year", "==", filters.year);
    if (filters.transmission) q = q.where("transmission", "==", filters.transmission);
    if (filters.bodyType) q = q.where("bodyType", "==", filters.bodyType);
    q = q.orderBy("createdAt", "desc").limit(filters.limitCount ?? 50);
    const snapshot = await q.get();
    return snapshot.docs.map((d) => toListing(d.id, d.data()));
  }

  if (modelIds.length <= FIRESTORE_IN_LIMIT) {
    return runQuery(modelIds);
  }

  const seen = new Set<string>();
  const results: Listing[] = [];
  for (let i = 0; i < modelIds.length; i += FIRESTORE_IN_LIMIT) {
    const chunk = modelIds.slice(i, i + FIRESTORE_IN_LIMIT);
    const chunkResults = await runQuery(chunk);
    for (const l of chunkResults) {
      if (!seen.has(l.id)) {
        seen.add(l.id);
        results.push(l);
      }
    }
  }
  results.sort((a, b) => {
    const aTs = a.createdAt ?? "";
    const bTs = b.createdAt ?? "";
    return bTs.localeCompare(aTs);
  });
  return results.slice(0, filters.limitCount ?? 50);
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
