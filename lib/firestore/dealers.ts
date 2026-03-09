import type { Dealer } from "@/schema";
import { getAdminDbSafe } from "@/lib/firebase/admin";

const DEALERS_COLLECTION = "dealers";

function toDealer(id: string, data: Record<string, unknown>): Dealer {
  const ts = (v: unknown) =>
    typeof v === "object" && v !== null && "toDate" in v && typeof (v as { toDate: () => Date }).toDate === "function"
      ? (v as { toDate: () => Date }).toDate().toISOString()
      : undefined;
  return {
    id,
    userId: data.userId as string,
    dealershipName: data.dealershipName as string,
    location: data.location as string,
    ghlLocationId: data.ghlLocationId as string | undefined,
    ghlFormEmbedUrl: data.ghlFormEmbedUrl as string | undefined,
    phone: (data.phone as string) || undefined,
    viberUrl: (data.viberUrl as string) || undefined,
    whatsappUrl: (data.whatsappUrl as string) || undefined,
    messengerUrl: (data.messengerUrl as string) || undefined,
    createdAt: ts(data.createdAt),
    updatedAt: ts(data.updatedAt),
  };
}

export async function getDealerByUserId(userId: string): Promise<Dealer | null> {
  const db = getAdminDbSafe();
  if (!db) return null;
  const snapshot = await db.collection(DEALERS_COLLECTION).where("userId", "==", userId).get();
  const first = snapshot.docs[0];
  if (!first) return null;
  return toDealer(first.id, first.data());
}

export async function getDealerById(id: string): Promise<Dealer | null> {
  const db = getAdminDbSafe();
  if (!db) return null;
  const ref = db.collection(DEALERS_COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  return toDealer(snap.id, snap.data() ?? {});
}
