import { FieldValue } from "firebase-admin/firestore";
import type { ListingImage } from "@/schema";
import { getAdminDbSafe } from "@/lib/firebase/admin";

const IMAGES_COLLECTION = "listingImages";

export async function getListingImageById(imageId: string): Promise<ListingImage | null> {
  const db = getAdminDbSafe();
  if (!db) return null;
  const ref = db.collection(IMAGES_COLLECTION).doc(imageId);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return {
    id: snap.id,
    listingId: data.listingId as string,
    imageUrl: data.imageUrl as string,
    isPrimary: (data.isPrimary as boolean) ?? false,
  };
}

export async function getListingImages(listingId: string): Promise<ListingImage[]> {
  const db = getAdminDbSafe();
  if (!db) return [];
  const snapshot = await db
    .collection(IMAGES_COLLECTION)
    .where("listingId", "==", listingId)
    .get();
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      listingId: data.listingId as string,
      imageUrl: data.imageUrl as string,
      isPrimary: (data.isPrimary as boolean) ?? false,
    };
  });
}

export async function addListingImage(
  listingId: string,
  imageUrl: string,
  isPrimary = false
): Promise<string> {
  const db = getAdminDbSafe();
  if (!db) throw new Error("Firebase not configured");
  const ref = await db.collection(IMAGES_COLLECTION).add({
    listingId,
    imageUrl,
    isPrimary,
    createdAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateListingImage(
  imageId: string,
  updates: { isPrimary?: boolean }
): Promise<void> {
  const db = getAdminDbSafe();
  if (!db) throw new Error("Firebase not configured");
  const ref = db.collection(IMAGES_COLLECTION).doc(imageId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Image not found");
  const listingId = snap.data()?.listingId as string;

  if (updates.isPrimary === true) {
    const others = await db
      .collection(IMAGES_COLLECTION)
      .where("listingId", "==", listingId)
      .get();
    const batch = db.batch();
    others.docs.forEach((d) => {
      batch.update(d.ref, { isPrimary: d.id === imageId });
    });
    await batch.commit();
  } else {
    await ref.update(updates);
  }
}

export async function deleteListingImage(imageId: string): Promise<void> {
  const db = getAdminDbSafe();
  if (!db) throw new Error("Firebase not configured");
  await db.collection(IMAGES_COLLECTION).doc(imageId).delete();
}

export async function setPrimaryImage(listingId: string, imageId: string): Promise<void> {
  const db = getAdminDbSafe();
  if (!db) throw new Error("Firebase not configured");
  const ref = db.collection(IMAGES_COLLECTION).doc(imageId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Image not found");
  const docListingId = snap.data()?.listingId as string;
  if (docListingId !== listingId) throw new Error("Image does not belong to listing");

  const others = await db
    .collection(IMAGES_COLLECTION)
    .where("listingId", "==", listingId)
    .get();
  const batch = db.batch();
  others.docs.forEach((d) => {
    batch.update(d.ref, { isPrimary: d.id === imageId });
  });
  await batch.commit();
}
