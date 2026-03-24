"use client";

import { SellerNavWrapper } from "@/components/SellerNavWrapper";
import { UnsavedListingNavigationProvider } from "@/components/seller/unsaved-listing-navigation";
import type { ReactNode } from "react";

export function SellerLayoutShell({ children }: { children: ReactNode }) {
  return (
    <UnsavedListingNavigationProvider>
      <SellerNavWrapper />
      {children}
    </UnsavedListingNavigationProvider>
  );
}
