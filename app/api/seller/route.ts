import { sendSellerWelcomeEmail } from "@/lib/email";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { generateSecurePassword } from "@/lib/password";
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

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
    const password = generateSecurePassword();
    let uid: string;
    try {
      await auth.getUserByEmail(email);
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    } catch {
      const user = await auth.createUser({
        email,
        password,
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

    const emailSent = await sendSellerWelcomeEmail(email, password, dealershipName);
    if (!emailSent) {
      console.warn("Seller created but welcome email was not sent");
    }

    return NextResponse.json({ uid, email, emailSent }, { status: 201 });
  } catch (error) {
    console.error("Create seller error:", error);
    return NextResponse.json({ error: "Failed to create seller" }, { status: 500 });
  }
}
