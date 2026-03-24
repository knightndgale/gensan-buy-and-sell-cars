import { getSessionToken } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const headersList = await headers();
  const session = await getSessionToken(headersList.get("cookie"), headersList.get("authorization"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    uid: session.uid,
    email: null,
    role: session.role,
  });
}
