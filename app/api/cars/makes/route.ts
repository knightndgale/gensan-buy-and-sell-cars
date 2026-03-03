import { NextResponse } from "next/server";
import { getCarMakes } from "@/lib/firestore/cars";

export async function GET() {
  try {
    const makes = await getCarMakes();
    return NextResponse.json(makes);
  } catch (error) {
    console.error("getCarMakes error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
