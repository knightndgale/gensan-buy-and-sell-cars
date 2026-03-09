import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth";
import { getAdminAuth } from "@/lib/firebase/admin";
import { getDealerByUserId } from "@/lib/firestore/dealers";

export async function GET() {
  const headersList = await headers();
  const session = await getSessionToken(headersList.get("cookie"), headersList.get("authorization"));

  if (!session || session.role !== "seller") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [dealer, fbUser] = await Promise.all([
      getDealerByUserId(session.uid),
      getAdminAuth().getUser(session.uid),
    ]);

    const email = fbUser.email ?? null;
    const dealershipName = dealer?.dealershipName ?? null;

    return NextResponse.json({
      dealershipName,
      email,
    });
  } catch (error) {
    console.error("Seller me error:", error);
    return NextResponse.json({ error: "Failed to fetch seller info" }, { status: 500 });
  }
}
