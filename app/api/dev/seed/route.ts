import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { CAR_MAKES, CAR_MODELS, SEED_USERS } from "@/lib/seed/data";

const MAKES_COLLECTION = "carMakes";
const MODELS_COLLECTION = "carModels";
const DEALERS_COLLECTION = "dealers";
const LISTINGS_COLLECTION = "listings";
const IMAGES_COLLECTION = "listingImages";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  // Dev guard: 404 in production (route appears non-existent)
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Password auth
  const password = await (async () => {
    const header = request.headers.get("X-Seed-Password");
    if (header) return header;
    try {
      const body = await request.json();
      return (body as { password?: string })?.password ?? null;
    } catch {
      return null;
    }
  })();

  const expectedPassword = process.env.SEED_PASSWORD;
  if (!expectedPassword || password !== expectedPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const seeded: Record<string, number> = {
    carMakes: 0,
    carModels: 0,
    users: 0,
    dealers: 0,
    listings: 0,
    listingImages: 0,
  };

  const db = getAdminDb();
  const auth = getAdminAuth();

  try {
    // 1. carMakes
    const makesCol = db.collection(MAKES_COLLECTION);
    for (const make of CAR_MAKES) {
      await makesCol.doc(`make-${make.id}`).set({ id: make.id, name: make.name }, { merge: true });
      seeded.carMakes++;
    }

    // 2. carModels
    const modelsCol = db.collection(MODELS_COLLECTION);
    for (const model of CAR_MODELS) {
      await modelsCol.doc(`model-${model.id}`).set(
        { id: model.id, makeId: model.makeId, name: model.name },
        { merge: true }
      );
      seeded.carModels++;
    }

    // 3. Firebase Auth users
    const userIds: string[] = [];
    for (const u of SEED_USERS) {
      let uid: string;
      try {
        const existing = await auth.getUserByEmail(u.email);
        uid = existing.uid;
      } catch {
        const user = await auth.createUser({
          email: u.email,
          password: u.password,
          displayName: u.displayName,
        });
        uid = user.uid;
      }
      await auth.setCustomUserClaims(uid, { role: "seller" });
      userIds.push(uid);
      seeded.users++;
    }

    // 4. dealers
    const dealersCol = db.collection(DEALERS_COLLECTION);
    const dealerIds: string[] = [];
    const dealerData = [
      { dealershipName: "Gensan Auto Hub", location: "General Santos City" },
      { dealershipName: "Mindanao Motors", location: "General Santos City" },
    ];
    for (let i = 0; i < dealerData.length && i < userIds.length; i++) {
      const ref = await dealersCol.add({
        userId: userIds[i],
        dealershipName: dealerData[i].dealershipName,
        location: dealerData[i].location,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      dealerIds.push(ref.id);
      seeded.dealers++;
    }

    // 5. listings
    const listingsCol = db.collection(LISTINGS_COLLECTION);
    const listingIds: string[] = [];
    const listingData = [
      { modelId: 1, year: 2022, price: 850_000, mileage: 15_000, transmission: "automatic" as const, fuelType: "gasoline" as const },
      { modelId: 6, year: 2021, price: 1_200_000, mileage: 25_000, transmission: "cvt" as const, fuelType: "gasoline" as const },
      { modelId: 17, year: 2023, price: 1_450_000, mileage: 8_000, transmission: "manual" as const, fuelType: "diesel" as const },
      { modelId: 19, year: 2022, price: 1_350_000, mileage: 20_000, transmission: "automatic" as const, fuelType: "diesel" as const },
      { modelId: 13, year: 2024, price: 1_150_000, mileage: 5_000, transmission: "automatic" as const, fuelType: "gasoline" as const },
      { modelId: 4, year: 2021, price: 1_800_000, mileage: 30_000, transmission: "automatic" as const, fuelType: "diesel" as const },
      { modelId: 9, year: 2023, price: 1_550_000, mileage: 12_000, transmission: "cvt" as const, fuelType: "gasoline" as const },
    ];
    for (let i = 0; i < listingData.length; i++) {
      const dealerId = dealerIds[i % dealerIds.length];
      const data = listingData[i];
      const ref = await listingsCol.add({
        dealerId,
        modelId: data.modelId,
        year: data.year,
        price: data.price,
        mileage: data.mileage,
        transmission: data.transmission,
        fuelType: data.fuelType,
        location: "General Santos City",
        description: `Well-maintained ${data.year} vehicle. Low mileage, good condition.`,
        status: "active",
        isFeatured: i < 2,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      listingIds.push(ref.id);
      seeded.listings++;
    }

    // 6. listingImages
    const imagesCol = db.collection(IMAGES_COLLECTION);
    const placeholderBase = "https://placehold.co/600x400/1a1a2e/eaeaea";
    for (let i = 0; i < listingIds.length; i++) {
      const listingId = listingIds[i];
      const count = 1 + (i % 3); // 1-3 images per listing
      for (let j = 0; j < count; j++) {
        await imagesCol.add({
          listingId,
          imageUrl: `${placeholderBase}?text=Photo+${j + 1}`,
          isPrimary: j === 0,
        });
        seeded.listingImages++;
      }
    }

    return NextResponse.json({ ok: true, seeded });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 }
    );
  }
}
