import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { CAR_MAKES, CAR_MODELS, SEED_FEATURES, SEED_USERS } from "@/lib/seed/data";

const MAKES_COLLECTION = "carMakes";
const MODELS_COLLECTION = "carModels";
const FEATURES_COLLECTION = "carFeatures";
const DEALERS_COLLECTION = "dealers";
const LISTINGS_COLLECTION = "listings";
const IMAGES_COLLECTION = "listingImages";

async function deleteAllInCollection(
  db: Awaited<ReturnType<typeof getAdminDb>>,
  collectionName: string
): Promise<void> {
  const col = db.collection(collectionName);
  while (true) {
    const snapshot = await col.limit(500).get();
    if (snapshot.empty) break;
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  // Dev guard: 404 in production (route appears non-existent)
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Parse body once for password and tearDown
  let body: { password?: string; tearDown?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    // Body may be empty or invalid
  }

  const password =
    request.headers.get("X-Seed-Password") ?? body.password ?? null;
  const tearDown =
    body.tearDown === true ||
    request.nextUrl.searchParams.get("tearDown") === "true";

  const expectedPassword = process.env.SEED_PASSWORD;
  if (!expectedPassword || password !== expectedPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const seeded: Record<string, number> = {
    carMakes: 0,
    carModels: 0,
    carFeatures: 0,
    users: 0,
    dealers: 0,
    listings: 0,
    listingImages: 0,
  };

  const db = getAdminDb();
  const auth = getAdminAuth();

  try {
    if (tearDown) {
      await deleteAllInCollection(db, IMAGES_COLLECTION);
      await deleteAllInCollection(db, LISTINGS_COLLECTION);
      await deleteAllInCollection(db, DEALERS_COLLECTION);
      await deleteAllInCollection(db, FEATURES_COLLECTION);
      await deleteAllInCollection(db, MODELS_COLLECTION);
      await deleteAllInCollection(db, MAKES_COLLECTION);
    }

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

    // 3. carFeatures
    const featuresCol = db.collection(FEATURES_COLLECTION);
    const featureNameToId = new Map<string, string>();
    for (const name of SEED_FEATURES) {
      const ref = await featuresCol.add({ name });
      featureNameToId.set(name, ref.id);
      seeded.carFeatures++;
    }

    // 4. Firebase Auth users
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

    // 5. dealers
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

    // 6. listings
    const listingsCol = db.collection(LISTINGS_COLLECTION);
    const listingIds: string[] = [];
    const listingData: Array<{
      modelId: number;
      year: number;
      price: number;
      mileage: number;
      transmission: "manual" | "automatic" | "cvt" | "dct";
      fuelType: "gasoline" | "diesel" | "hybrid" | "electric";
      bodyType: string;
      engine: string;
      color: string;
      features: readonly string[];
      status: "active" | "pending" | "sold";
      location: string;
    }> = [
      { modelId: 1, year: 2022, price: 850_000, mileage: 15_000, transmission: "automatic", fuelType: "gasoline", bodyType: "Sedan", engine: "1.3L", color: "White", features: ["Touchscreen Infotainment", "Backup Camera", "Keyless Entry", "ABS Brakes", "Power Windows"], status: "active", location: "Brgy. Fatima, General Santos City" },
      { modelId: 6, year: 2021, price: 1_200_000, mileage: 25_000, transmission: "cvt", fuelType: "gasoline", bodyType: "Sedan", engine: "1.5L", color: "Silver", features: ["Touchscreen Infotainment", "Backup Camera", "Apple CarPlay", "Android Auto", "LED Headlamps"], status: "active", location: "Brgy. Lagao, General Santos City" },
      { modelId: 17, year: 2023, price: 1_450_000, mileage: 8_000, transmission: "manual", fuelType: "diesel", bodyType: "Pickup", engine: "3.0L", color: "Black", features: ["Backup Camera", "ABS Brakes", "Parking Sensors", "Bluetooth Audio", "USB Port"], status: "active", location: "General Santos City" },
      { modelId: 19, year: 2022, price: 1_350_000, mileage: 20_000, transmission: "automatic", fuelType: "diesel", bodyType: "Pickup", engine: "2.0L", color: "Gray", features: ["Backup Camera", "Cruise Control", "Push Start", "Leather Seats"], status: "pending", location: "Brgy. Calumpang, General Santos City" },
      { modelId: 13, year: 2024, price: 1_150_000, mileage: 5_000, transmission: "automatic", fuelType: "gasoline", bodyType: "MPV", engine: "1.5L", color: "Pearl White", features: ["Touchscreen Infotainment", "Backup Camera", "Keyless Entry", "Power Windows"], status: "active", location: "Brgy. Dadiangas South, General Santos City" },
      { modelId: 4, year: 2021, price: 1_800_000, mileage: 30_000, transmission: "automatic", fuelType: "diesel", bodyType: "SUV", engine: "2.8L", color: "Navy Blue", features: ["Touchscreen Infotainment", "Backup Camera", "Sunroof", "Leather Seats", "Navigation System"], status: "sold", location: "Brgy. Apopong, General Santos City" },
      { modelId: 9, year: 2023, price: 1_550_000, mileage: 12_000, transmission: "cvt", fuelType: "gasoline", bodyType: "SUV", engine: "2.0L", color: "Red", features: ["Backup Camera", "Cruise Control", "Push Start", "Airbags"], status: "active", location: "Brgy. Bula, General Santos City" },
    ];
    let featuredActiveCount = 0;
    for (let i = 0; i < listingData.length; i++) {
      const dealerId = dealerIds[i % dealerIds.length];
      const data = listingData[i];
      const model = CAR_MODELS.find((m) => m.id === data.modelId);
      const make = model ? CAR_MAKES.find((m) => m.id === model.makeId) : undefined;
      const title = make && model ? `${data.year} ${make.name} ${model.name}` : undefined;
      const isFeatured = data.status === "active" && featuredActiveCount < 2;
      if (data.status === "active") featuredActiveCount++;
      const featureIds = data.features
        .map((name) => featureNameToId.get(name))
        .filter((id): id is string => id != null);

      const ref = await listingsCol.add({
        dealerId,
        modelId: data.modelId,
        year: data.year,
        price: data.price,
        mileage: data.mileage,
        transmission: data.transmission,
        fuelType: data.fuelType,
        location: data.location,
        description: `Well-maintained ${data.year} vehicle. Low mileage, good condition.`,
        status: data.status,
        isFeatured,
        ...(title && { title }),
        bodyType: data.bodyType,
        engine: data.engine,
        color: data.color,
        features: featureIds,
        views: 0,
        ...(data.status === "sold" && { soldAt: FieldValue.serverTimestamp() }),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      listingIds.push(ref.id);
      seeded.listings++;
    }

    // 7. listingImages
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
