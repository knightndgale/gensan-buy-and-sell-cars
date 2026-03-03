import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSessionToken } from "@/lib/auth";
import { getDealerByUserId } from "@/lib/firestore/dealers";
import { getListingById } from "@/lib/firestore/listings";
import { getListingImages } from "@/lib/firestore/listing-images";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headersList = await headers();
    const session = await getSessionToken(
      headersList.get("cookie"),
      _request.headers.get("authorization")
    );
    if (!session || (session.role !== "seller" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dealer = await getDealerByUserId(session.uid);
    if (!dealer) {
      return NextResponse.json({ error: "Dealer profile not found" }, { status: 403 });
    }

    const listing = await getListingById(id);
    if (!listing || listing.dealerId !== dealer.id) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const images = await getListingImages(id);
    return NextResponse.json(images);
  } catch (error) {
    console.error("Get listing images error:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
