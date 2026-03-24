import { parseUpdateListingForm } from "@/lib/api/multipart";
import { getSessionToken } from "@/lib/auth";
import { getDealerByUserId } from "@/lib/firestore/dealers";
import { addListingImage, deleteListingImage, setPrimaryImage } from "@/lib/firestore/listing-images";
import { getListingById, updateListing } from "@/lib/firestore/listings";
import { uploadListingImage } from "@/lib/storage/upload";
import { ListingInputSchema } from "@/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function isMultipart(request: NextRequest): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.includes("multipart/form-data");
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const headersList = await headers();
    const session = await getSessionToken(headersList.get("cookie"), request.headers.get("authorization"));
    if (!session) {
      return NextResponse.json({ error: "Unauthorized", detail: "No valid session. Log in or provide Authorization: Bearer <session-token>" }, { status: 401 });
    }
    if (session.role !== "seller" && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden", detail: "Seller or admin role required" }, { status: 403 });
    }

    const listing = await getListingById(id);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (session.role === "seller") {
      const dealer = await getDealerByUserId(session.uid);
      if (!dealer || listing.dealerId !== dealer.id) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }
    }

    if (isMultipart(request)) {
      const { listing: listingData, images, primaryImageId, removedImageIds } = await parseUpdateListingForm(request);

      if (Object.keys(listingData).length > 0) {
        const parsed = ListingInputSchema.partial().safeParse(listingData);
        if (!parsed.success) {
          return NextResponse.json({ error: parsed.error.message }, { status: 400 });
        }
        if (session.role === "seller" && listing.status === "pending" && parsed.data.status === "active") {
          return NextResponse.json({ error: "Forbidden", detail: "Only an admin can approve a pending listing" }, { status: 403 });
        }
        await updateListing(id, parsed.data);
      }

      for (const imageId of removedImageIds) {
        await deleteListingImage(imageId);
      }

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadListingImage(id, buffer, file.type, file.name);
        const isPrimary = i === 0 && images.length > 0 && !primaryImageId;
        await addListingImage(id, url, isPrimary);
      }

      if (primaryImageId && primaryImageId.trim()) {
        await setPrimaryImage(id, primaryImageId);
      }

      return NextResponse.json({ success: true });
    }

    const body = await request.json();
    const parsed = ListingInputSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    if (session.role === "seller" && listing.status === "pending" && parsed.data.status === "active") {
      return NextResponse.json({ error: "Forbidden", detail: "Only an admin can approve a pending listing" }, { status: 403 });
    }

    const updateData = { ...parsed.data };
    if (updateData.status === "sold") {
      updateData.soldAt = new Date().toISOString();
    } else if (updateData.status === "active") {
      updateData.soldAt = null;
    }

    await updateListing(id, updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update listing error:", error);
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
  }
}
