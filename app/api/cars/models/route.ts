import { NextRequest, NextResponse } from "next/server";
import { getCarModels } from "@/lib/firestore/cars";

export async function GET(request: NextRequest) {
  try {
    const makeId = request.nextUrl.searchParams.get("makeId");
    const models = await getCarModels(makeId ? parseInt(makeId, 10) : undefined);
    return NextResponse.json(models);
  } catch (error) {
    console.error("getCarModels error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
