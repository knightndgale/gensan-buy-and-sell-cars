"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "../ui/badge";

type SellerListingCardProps = {
  id: string;
  title: string;
  price: number;
  status: string;
  primaryImageUrl?: string;
};

const statusBadgeMap = {
  active: <Badge variant="green">Active</Badge>,
  sold: <Badge variant="destructive">Sold</Badge>,
  archived: <Badge variant="outline">Archived</Badge>,
};

export function SellerListingCard({ id, title, price, status, primaryImageUrl }: SellerListingCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSoldConfirm, setShowSoldConfirm] = useState(false);
  const router = useRouter();

  const updateStatus = async (newStatus: "active" | "sold") => {
    setIsUpdating(true);
    setError(null);
    setShowSoldConfirm(false);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update status");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkSoldClick = () => setShowSoldConfirm(true);

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-muted">
        {primaryImageUrl && !imageError ? (
          <Image src={primaryImageUrl} alt={title} fill className="object-cover" sizes="112px" onError={() => setImageError(true)} />
        ) : (
          <ImagePlaceholder fill className="rounded-md border-0" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium">{title || "Untitled"}</h3>
        <p className="text-sm text-muted-foreground">
          {formatPrice(price)} • {statusBadgeMap[status as keyof typeof statusBadgeMap]}
        </p>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {status === "active" && (
          <>
            <Button variant="secondary" size="sm" onClick={handleMarkSoldClick} disabled={isUpdating}>
              {isUpdating ? "Updating…" : "Mark as Sold"}
            </Button>
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
                  <AlertDialogAction onClick={() => updateStatus("sold")}>Mark as Sold</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
        {status === "sold" && (
          <Button variant="secondary" size="sm" onClick={() => updateStatus("active")} disabled={isUpdating}>
            {isUpdating ? "Updating…" : "Mark as Active"}
          </Button>
        )}
        <Button asChild variant="outline" size="sm">
          <Link href={`/seller/listings/${id}/edit`}>Edit</Link>
        </Button>
      </div>
    </div>
  );
}
