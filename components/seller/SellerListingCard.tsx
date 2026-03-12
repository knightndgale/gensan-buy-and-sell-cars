"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { formatPrice } from "@/lib/format";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Clock, EyeIcon, Hourglass, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "../ui/badge";

export type CarListingDetails = {
  id: string;
  title: string;
  price: number;
  status: string;
  primaryImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  soldAt?: string | null;
  views?: number;
};

type SellerListingCardProps = {
  car: CarListingDetails;
};

dayjs.extend(relativeTime);

function formatListedAt(createdAt?: string): string {
  if (!createdAt) return "Recently listed";
  const date = dayjs(createdAt);
  if (date.isAfter(dayjs().subtract(1, "minute"))) return "Just now";
  return date.fromNow();
}

const statusBadgeMap: Record<string, React.ReactNode> = {
  active: (
    <Badge className="bg-[#DCFCE7] flex flex-row items-center gap-2 text-green-500 font-medium">
      <span className="size-2 rounded-full bg-green-500"></span>Active
    </Badge>
  ),
  sold: (
    <Badge className="bg-[#DBEAFE] flex flex-row items-center gap-2 text-primary font-medium">
      <span className="size-2 rounded-full bg-primary"></span>Sold
    </Badge>
  ),

  pending: (
    <Badge className="bg-[#FFEDD4] flex flex-row items-center gap-2 text-orange-500 font-medium">
      <span className="size-2 rounded-full bg-orange-500"></span>For Approval
    </Badge>
  ),
};

export function SellerListingCard({ car }: SellerListingCardProps) {
  const { id, title, price, status, primaryImageUrl, createdAt, soldAt, views = 0 } = car;
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSoldConfirm, setShowSoldConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: "active" | "sold") => {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update status");
      }
    },
    onSuccess: () => {
      setShowSoldConfirm(false);
      setError(null);
      router.refresh();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to update status");
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to archive listing");
      }
    },
    onSuccess: () => {
      setShowDeleteConfirm(false);
      setError(null);
      router.refresh();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to archive listing");
    },
  });

  const isUpdating = updateStatusMutation.isPending || archiveMutation.isPending;

  const statusBadge = statusBadgeMap[status] ?? <Badge variant="outline">{status}</Badge>;

  const timelineText =
    status === "pending"
      ? "Waiting for admin approval"
      : status === "active"
        ? `${formatListedAt(createdAt)} • Visible to buyers`
        : status === "sold"
          ? `Sold on ${formatListedAt(soldAt ?? undefined)}`
          : formatListedAt(createdAt);

  const displayViews = views > 0 ? views.toLocaleString() : "0";

  return (
    <div className="rounded-lg border  bg-card overflow-hidden">
      <div className="flex gap-4 p-4 border-b w-full">
        <div className="relative h-30 w-30 shrink-0 overflow-hidden rounded-t-md rounded-b-none bg-muted">
          {primaryImageUrl && !imageError ? (
            <Image src={primaryImageUrl} alt={title} fill className="object-cover" sizes="144px" onError={() => setImageError(true)} />
          ) : (
            <ImagePlaceholder fill className="rounded-t-md rounded-b-none border-0" />
          )}
          {status === "sold" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded bg-destructive/90 px-2 py-1 text-xs font-semibold text-white">SOLD</span>
            </div>
          )}
          {status === "pending" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded bg-orange-500 px-2 py-1 text-xs font-semibold text-white">PENDING</span>
            </div>
          )}
        </div>

        <section className=" flex flex-col flex-1 h-auto justify-between">
          <article>
            <section className="flex flex-row items-center gap-4 justify-between w-full">
              <h3 className="font-medium">{title || "Untitled"}</h3>

              <div className="flex shrink-0 items-start gap-2">
                {status === "active" && (
                  <>
                    <AlertDialog open={showSoldConfirm} onOpenChange={setShowSoldConfirm}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Mark this car as sold?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will update the listing status to &quot;sold&quot; and remove it from active listings. You can mark it as active again later if needed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => updateStatusMutation.mutate("sold")}>Mark as Sold</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Archive this listing?</AlertDialogTitle>
                      <AlertDialogDescription>This will archive the listing and hide it from buyers. You can restore it to active later if needed.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => archiveMutation.mutate()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Archive
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="More options">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/seller/listings/${id}/edit`}>
                        <Pencil className="size-4" />
                        Edit Listing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" disabled={isUpdating} onSelect={() => setShowDeleteConfirm(true)}>
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </section>
            <p className="text-lg font-semibold text-primary">{formatPrice(price)}</p>
          </article>
          <article className="flex flex-row items-center gap-4 justify-between w-full  ">
            <div className="mt-1 flex flex-wrap items-center gap-4">
              {statusBadge}
              <span className="text-sm text-muted-foreground flex flex-row items-center gap-2">
                <EyeIcon className="size-4" />
                {displayViews} views
              </span>
            </div>
          </article>
          {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </section>
      </div>

      <p className="text-sm text-muted-foreground px-4 py-2"> {timelineText}</p>

      {status === "pending" && (
        <div className="flex items-center gap-2 border-t bg-orange-50 px-4 py-2 text-sm text-orange-800 dark:bg-orange-950/30 dark:text-orange-200">
          <Hourglass className="size-4 text-orange-600 dark:text-orange-400" />
          Waiting for admin approval - your listing will go live once approved
        </div>
      )}
    </div>
  );
}
