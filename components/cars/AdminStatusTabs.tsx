"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Clock, LayoutGrid, Tag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type AdminStatusTabsProps = {
  currentStatus: "all" | "active" | "pending" | "sold";
};

const TABS: { value: "all" | "active" | "pending" | "sold"; label: string; icon: typeof LayoutGrid }[] = [
  { value: "all", label: "All", icon: LayoutGrid },
  { value: "active", label: "Active", icon: CheckCircle },
  { value: "pending", label: "Pending", icon: Clock },
  { value: "sold", label: "Sold", icon: Tag },
];

export function AdminStatusTabs({ currentStatus }: AdminStatusTabsProps) {
  const searchParams = useSearchParams();

  const buildUrl = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    return `/cars?${params.toString()}`;
  };

  return (
    <div className="mt-4 mb-2 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Listing status</p>
      <div className="flex flex-nowrap gap-2 overflow-x-auto rounded-lg border border-border bg-card/80 p-1.5 sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.value}
              href={buildUrl(tab.value)}
              className={cn(
                "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                currentStatus === tab.value ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}>
              <Icon className="size-4 shrink-0" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
