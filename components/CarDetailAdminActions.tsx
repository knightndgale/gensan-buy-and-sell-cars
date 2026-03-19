"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ButtonConfig = {
  id: "approve" | "mark-sold" | "mark-for-sale";
  label: string;
  status: "active" | "sold";
  color: "primary" | "orange" | "green";
  confirm: {
    title: string;
    description: string;
    confirmLabel: string;
  };
};

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
  const [openDialogId, setOpenDialogId] = useState<ButtonConfig["id"] | null>(null);

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
    buttons.push(
      {
        id: "approve",
        label: "Approve New Listing",
        status: "active",
        color: "primary",
        confirm: {
          title: "Approve this listing?",
          description: "This will approve the listing and make it visible to buyers as For Sale.",
          confirmLabel: "Approve Listing",
        },
      },
      {
        id: "mark-sold",
        label: "Mark as Sold",
        status: "sold",
        color: "green",
        confirm: {
          title: "Mark this listing as sold?",
          description: "This will remove the listing from active for-sale listings and show it as sold.",
          confirmLabel: "Mark as Sold",
        },
      },
    );
  } else if (listingStatus === "active") {
    buttons.push({
      id: "mark-sold",
      label: "Mark as Sold",
      status: "sold",
      color: "green",
      confirm: {
        title: "Mark this listing as sold?",
        description: "This will remove the listing from active for-sale listings and show it as sold.",
        confirmLabel: "Mark as Sold",
      },
    });
  } else {
    buttons.push({
      id: "mark-for-sale",
      label: "Mark as For Sale",
      status: "active",
      color: "orange",
      confirm: {
        title: "Mark this listing as for sale?",
        description: "This will return the listing to active status and make it visible to buyers.",
        confirmLabel: "Mark as For Sale",
      },
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {buttons.map((b) => (
        <AlertDialog key={b.id} open={openDialogId === b.id} onOpenChange={(open) => setOpenDialogId(open ? b.id : null)}>
          <Button
            variant="outline"
            className={cn(colorClasses[b.color], "w-full justify-center gap-2")}
            disabled={!!loading}
            onClick={() => setOpenDialogId(b.id)}
          >
            {loading === b.status ? "Updating..." : b.label}
          </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{b.confirm.title}</AlertDialogTitle>
              <AlertDialogDescription>{b.confirm.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!loading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={!!loading}
                onClick={(e) => {
                  e.preventDefault();
                  void handleStatusUpdate(b.status).finally(() => setOpenDialogId(null));
                }}
              >
                {loading === b.status ? "Updating..." : b.confirm.confirmLabel}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  );
}
