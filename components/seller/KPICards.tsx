"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

type KPICardsProps = {
  activeListings: number;
  dealerId?: string;
};

export function KPICards({ activeListings, dealerId }: KPICardsProps) {
  const { data } = useQuery({
    queryKey: ["ghl-analytics", dealerId],
    queryFn: async () => {
      const url = dealerId ? `/api/ghl/analytics?dealerId=${dealerId}` : "/api/ghl/analytics";
      const res = await fetch(url);
      return res.json();
    },
  });

  const newLeads = data?.newLeads ?? 0;
  const pendingSales = data?.pendingSales ?? 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Active Listings</p>
          <p className="text-2xl font-bold">{activeListings}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">New Leads</p>
          <p className="text-2xl font-bold">{newLeads}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Pending Sales</p>
          <p className="text-2xl font-bold">{pendingSales}</p>
        </CardContent>
      </Card>
    </div>
  );
}
