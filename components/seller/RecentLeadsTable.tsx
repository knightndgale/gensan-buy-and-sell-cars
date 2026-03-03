"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type RecentLeadsTableProps = {
  dealerId?: string;
};

const statusColors: Record<string, string> = {
  Inquired: "bg-green-500/20 text-green-700",
  Contacted: "bg-green-500/20 text-green-700",
  Sold: "bg-orange-500/20 text-orange-700",
};

export function RecentLeadsTable({ dealerId }: RecentLeadsTableProps) {
  const { data } = useQuery({
    queryKey: ["ghl-analytics", dealerId],
    queryFn: async () => {
      const url = dealerId ? `/api/ghl/analytics?dealerId=${dealerId}` : "/api/ghl/analytics";
      const res = await fetch(url);
      return res.json();
    },
  });

  const leads = data?.recentLeads ?? [];

  return (
    <div className="rounded-lg border">
      <h2 className="border-b px-4 py-3 font-semibold">Recent Leads</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lead ID</TableHead>
            <TableHead>Car</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No leads yet
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead: { id: string; car: string; status: string }) => (
              <TableRow key={lead.id}>
                <TableCell className="font-mono text-sm">{lead.id}</TableCell>
                <TableCell>{lead.car}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[lead.status] ?? ""}
                  >
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      Update
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark Sold
                    </Button>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
