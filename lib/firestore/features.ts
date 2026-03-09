import { getAdminDbSafe } from "@/lib/firebase/admin";

const FEATURES_COLLECTION = "carFeatures";

export type CarFeature = {
  id: string;
  name: string;
};

export async function getCarFeatures(): Promise<CarFeature[]> {
  const db = getAdminDbSafe();
  if (!db) return [];
  const snapshot = await db.collection(FEATURES_COLLECTION).get();
  const features = snapshot.docs.map((d) => ({
    id: d.id,
    name: (d.data().name as string) ?? "",
  }));
  return features.sort((a, b) => a.name.localeCompare(b.name));
}

export async function addCarFeature(name: string): Promise<CarFeature> {
  const db = getAdminDbSafe();
  if (!db) throw new Error("Firebase not configured");

  const trimmed = name.trim();
  if (!trimmed) throw new Error("Feature name is required");

  const existing = await getCarFeatures();
  const isDuplicate = existing.some((f) => f.name.toLowerCase() === trimmed.toLowerCase());
  if (isDuplicate) {
    throw new Error("DUPLICATE");
  }

  const ref = await db.collection(FEATURES_COLLECTION).add({ name: trimmed });
  return { id: ref.id, name: trimmed };
}
