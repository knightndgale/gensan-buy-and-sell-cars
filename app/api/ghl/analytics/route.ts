import { getSessionToken } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const CACHE_MAX_AGE = 60 * 5; // 5 minutes

export type GHLAnalytics = {
  activeListings: number;
  newLeads: number;
  pendingSales: number;
  recentLeads: Array<{
    id: string;
    car: string;
    status: string;
  }>;
  salesThisMonth: number;
  referralCommission: number;
  leadsPending: number;
};

async function fetchGHLAnalytics(dealerId?: string): Promise<GHLAnalytics> {
  const token = process.env.GHL_API_TOKEN;
  const locationId = dealerId || process.env.GHL_DEFAULT_LOCATION_ID;

  if (!token || !locationId) {
    return {
      activeListings: 0,
      newLeads: 0,
      pendingSales: 0,
      recentLeads: [],
      salesThisMonth: 0,
      referralCommission: 0,
      leadsPending: 0,
    };
  }

  try {
    const res = await fetch(
      `https://rest.gohighlevel.com/v1/contacts/?locationId=${locationId}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`GHL API error: ${res.status}`);
    }

    const data = (await res.json()) as {
      contacts?: Array<{ id: string; customField?: Record<string, unknown> }>;
    };
    const contacts = data.contacts ?? [];

    const recentLeads = contacts.slice(0, 5).map((c) => ({
      id: `GS-CAR-${String(c.id).slice(-6).toUpperCase()}`,
      car: (c.customField?.["car"] as string) ?? "N/A",
      status: (c.customField?.["status"] as string) ?? "Inquired",
    }));

    return {
      activeListings: 0,
      newLeads: contacts.filter((c) => (c.customField?.["status"] as string) === "Inquired").length,
      pendingSales: contacts.filter((c) => (c.customField?.["status"] as string) === "Contacted").length,
      recentLeads,
      salesThisMonth: 0,
      referralCommission: 0,
      leadsPending: contacts.filter((c) => (c.customField?.["status"] as string) !== "Sold").length,
    };
  } catch (error) {
    console.error("GHL analytics error:", error);
    return {
      activeListings: 0,
      newLeads: 0,
      pendingSales: 0,
      recentLeads: [],
      salesThisMonth: 0,
      referralCommission: 0,
      leadsPending: 0,
    };
  }
}

export async function GET(request: NextRequest) {
  const headersList = await headers();
  const session = await getSessionToken(
    headersList.get("cookie"),
    request.headers.get("authorization")
  );
  if (!session || (session.role !== "seller" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dealerId = request.nextUrl.searchParams.get("dealerId") ?? undefined;
  const analytics = await fetchGHLAnalytics(dealerId);
  return NextResponse.json(analytics, {
    headers: {
      "Cache-Control": `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_MAX_AGE * 2}`,
    },
  });
}
