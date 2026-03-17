"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ButtonConfig = { label: string; status: "active" | "sold"; color: "primary" | "orange" | "green" };

type CarDetailAdminActionsProps = {
  listingId: string;
  listingStatus: "active" | "pending" | "sold";
};

const colorClasses: Record<ButtonConfig["color"], string> = {
  primary: "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground transition-colors",
  orange: "cursor-pointer border-0 bg-[#C66300] text-white hover:bg-[#B35900] hover:text-white transition-colors",
  green: "cursor-pointer border-0 bg-[#00C64C] text-white hover:bg-[#00B044] hover:text-white transition-colors",
};

export function CarDetailAdminActions({ listingId, listingStatus }: CarDetailAdminActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleStatusUpdate(status: "active" | "sold") {
    setLoading(status);
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.error || "Failed to update");
      }
      toast.success(status === "active" ? "Listing marked as for sale." : "Listing marked as sold.");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update listing.");
    } finally {
      setLoading(null);
    }
  }

  const buttons: ButtonConfig[] = [];

  if (listingStatus === "pending") {
    buttons.push({ label: "Approve New Listing", status: "active", color: "primary" }, { label: "Mark as Sold", status: "sold", color: "green" });
  } else if (listingStatus === "active") {
    buttons.push({ label: "Mark as Sold", status: "sold", color: "green" });
  } else {
    buttons.push({ label: "Mark as For Sale", status: "active", color: "orange" });
  }

  return (
    <div className="flex flex-col gap-2">
      {buttons.map((b) => (
        <Button
          key={b.status}
          variant="outline"
          className={cn(colorClasses[b.color], "w-full justify-center gap-2")}
          disabled={!!loading}
          onClick={() => handleStatusUpdate(b.status)}
        >
          {loading === b.status ? "Updating..." : b.label}
        </Button>
      ))}
    </div>
  );
}
