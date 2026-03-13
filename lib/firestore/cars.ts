import type { CarMake, CarModel } from "@/schema";
import { getAdminDbSafe } from "@/lib/firebase/admin";

const MAKES_COLLECTION = "carMakes";
const MODELS_COLLECTION = "carModels";
const LISTINGS_COLLECTION = "listings";

export async function getCarMakes(): Promise<CarMake[]> {
  const db = getAdminDbSafe();
  if (!db) return [];
  const snapshot = await db.collection(MAKES_COLLECTION).get();
  return snapshot.docs.map((d) => {
    const data = d.data();
    return { id: (data.id as number) ?? parseInt(d.id, 10), name: data.name as string };
  });
}

export async function getCarModels(makeId?: number): Promise<CarModel[]> {
  const db = getAdminDbSafe();
  if (!db) return [];
  const col = db.collection(MODELS_COLLECTION);
  const q = makeId ? col.where("makeId", "==", makeId) : col;
  const snapshot = await q.get();
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: (data.id as number) ?? parseInt(d.id, 10),
      makeId: data.makeId as number,
      name: data.name as string,
    };
  });
}

export async function getCarModelById(id: number): Promise<CarModel | null> {
  const models = await getCarModels();
  return models.find((m) => m.id === id) ?? null;
}

export async function getTotalActiveListingsCount(): Promise<number> {
  const db = getAdminDbSafe();
  if (!db) return 0;

  const snapshot = await db.collection(LISTINGS_COLLECTION)
    .where("status", "==", "active")
    .get();

  console.log("Total active listings:", snapshot.size);
  return snapshot.size;
}

