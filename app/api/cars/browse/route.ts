import { NextRequest, NextResponse } from "next/server";
import { getBrowseListingsPage } from "@/lib/cars/browse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const make = searchParams.get("make") ?? undefined;
    const model = searchParams.get("model") ?? undefined;
    const q = searchParams.get("q") ?? undefined;
    const minPrice = searchParams.get("minPrice")
      ? parseInt(searchParams.get("minPrice")!, 10)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseInt(searchParams.get("maxPrice")!, 10)
      : undefined;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : undefined;
    const minMileage = searchParams.get("minMileage")
      ? parseInt(searchParams.get("minMileage")!, 10)
      : undefined;
    const maxMileage = searchParams.get("maxMileage")
      ? parseInt(searchParams.get("maxMileage")!, 10)
      : undefined;
    const transmission = searchParams.get("transmission") ?? undefined;
    const bodyType = searchParams.get("bodyType") ?? undefined;
    const location = searchParams.get("location") ?? undefined;
    const sortParam = searchParams.get("sort");
    const sort =
      sortParam && ["newest", "price_asc", "price_desc"].includes(sortParam)
        ? (sortParam as "newest" | "price_asc" | "price_desc")
        : "newest";
    const page = Math.max(
      1,
      searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1
    );
    const pageSizeParam = searchParams.get("pageSize");
    const pageSize = pageSizeParam
      ? Math.min(24, Math.max(6, parseInt(pageSizeParam, 10) || 6))
      : 6;

    const { listings, hasMore } = await getBrowseListingsPage({
      make,
      model,
      q,
      minPrice,
      maxPrice,
      year,
      minMileage,
      maxMileage,
      transmission,
      bodyType,
      location,
      sort,
      page,
      pageSize,
    });

    return NextResponse.json({ listings, hasMore });
  } catch (error) {
    console.error("Browse API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
