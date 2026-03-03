import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSessionToken } from "@/lib/auth";
import { getDealerByUserId } from "@/lib/firestore/dealers";
import { createListing } from "@/lib/firestore/listings";
import { addListingImage } from "@/lib/firestore/listing-images";
import { uploadListingImage } from "@/lib/storage/upload";
import { parseCreateListingForm } from "@/lib/api/multipart";
import { ListingInputSchema } from "@/schema";

function isMultipart(request: NextRequest): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.includes("multipart/form-data");
}

export async function POST(request: NextRequest) {
  try {
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

    if (isMultipart(request)) {
      const { listing, images, primaryImageIndex } = await parseCreateListingForm(request);
      const parsed = ListingInputSchema.safeParse({
        ...listing,
        dealerId: dealer.id,
      });

      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.message }, { status: 400 });
      }

      const id = await createListing(parsed.data);

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadListingImage(id, buffer, file.type, file.name);
        const isPrimary = primaryImageIndex !== null ? i === primaryImageIndex : i === 0;
        await addListingImage(id, url, isPrimary);
      }

      return NextResponse.json({ id });
    }

    const body = await request.json();
    const parsed = ListingInputSchema.safeParse({
      ...body,
      dealerId: dealer.id,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    const id = await createListing(parsed.data);
    return NextResponse.json({ id });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
