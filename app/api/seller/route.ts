import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_PASSWORD = "dev-seller-123";
const DEALERS_COLLECTION = "dealers";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: { email?: string; dealershipName?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const dealershipName = typeof body.dealershipName === "string" ? body.dealershipName.trim() : "New Dealer";
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  const auth = getAdminAuth();
  const db = getAdminDb();

  try {
    let uid: string;
    try {
      await auth.getUserByEmail(email);
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    } catch {
      const user = await auth.createUser({
        email,
        password: DEFAULT_PASSWORD,
      });
      uid = user.uid;
    }

    await auth.setCustomUserClaims(uid, { role: "seller" });

    await db.collection(DEALERS_COLLECTION).add({
      userId: uid,
      dealershipName,
      location: "General Santos City",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ uid, email }, { status: 201 });
  } catch (error) {
    console.error("Create seller error:", error);
    return NextResponse.json({ error: "Failed to create seller" }, { status: 500 });
  }
}
