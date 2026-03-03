import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSessionToken } from "@/lib/auth";
import { getDealerByUserId } from "@/lib/firestore/dealers";
import { getListingById } from "@/lib/firestore/listings";
import { getListingImageById, setPrimaryImage, deleteListingImage } from "@/lib/firestore/listing-images";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id: listingId, imageId } = await params;
    const headersList = await headers();
    const session = await getSessionToken(
      headersList.get("cookie"),
      request.headers.get("authorization")
    );
    if (!session || (session.role !== "seller" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dealer = await getDealerByUserId(session.uid);
    if (!dealer) {
      return NextResponse.json({ error: "Dealer profile not found" }, { status: 403 });
    }

    const listing = await getListingById(listingId);
    if (!listing || listing.dealerId !== dealer.id) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const image = await getListingImageById(imageId);
    if (!image || image.listingId !== listingId) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const body = await request.json();
    if (body?.isPrimary === true) {
      await setPrimaryImage(listingId, imageId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set primary image error:", error);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id: listingId, imageId } = await params;
    const headersList = await headers();
    const session = await getSessionToken(
      headersList.get("cookie"),
      request.headers.get("authorization")
    );
    if (!session || (session.role !== "seller" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dealer = await getDealerByUserId(session.uid);
    if (!dealer) {
      return NextResponse.json({ error: "Dealer profile not found" }, { status: 403 });
    }

    const listing = await getListingById(listingId);
    if (!listing || listing.dealerId !== dealer.id) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const image = await getListingImageById(imageId);
    if (!image || image.listingId !== listingId) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await deleteListingImage(imageId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
