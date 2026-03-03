"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

type EarningsSummaryProps = {
  dealerId?: string;
};

export function EarningsSummary({ dealerId }: EarningsSummaryProps) {
  const { data } = useQuery({
    queryKey: ["ghl-analytics", dealerId],
    queryFn: async () => {
      const url = dealerId ? `/api/ghl/analytics?dealerId=${dealerId}` : "/api/ghl/analytics";
      const res = await fetch(url);
      return res.json();
    },
  });

  const salesThisMonth = data?.salesThisMonth ?? 0;
  const referralCommission = data?.referralCommission ?? 0;
  const leadsPending = data?.leadsPending ?? 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="mb-4 font-semibold">Earnings Summary</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="text-muted-foreground">Sales This Month</span>
            <span className="font-medium">{formatPrice(salesThisMonth)}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Referral Commission</span>
            <span className="font-medium">{formatPrice(referralCommission)}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Leads Pending</span>
            <span className="font-medium">{leadsPending}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
