import { NextRequest, NextResponse } from "next/server";
import { getCarFeatures, addCarFeature } from "@/lib/firestore/features";

export async function GET() {
  try {
    const features = await getCarFeatures();
    return NextResponse.json(features);
  } catch (error) {
    console.error("getCarFeatures error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name : "";
    if (!name.trim()) {
      return NextResponse.json({ error: "Feature name is required" }, { status: 400 });
    }

    const feature = await addCarFeature(name);
    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE") {
      return NextResponse.json({ error: "This feature already exists" }, { status: 409 });
    }
    console.error("addCarFeature error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add feature" },
      { status: 500 }
    );
  }
}
