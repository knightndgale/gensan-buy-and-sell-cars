"use client";

import { CarDetailContactSection } from "@/components/CarDetailContactSection";
import type { Dealer } from "@/schema";
import { useEffect, useState } from "react";

type CarDetailMobileFloatingContactBarProps = {
  dealer: Dealer | null;
  listingId: string;
  carName: string;
  /** The id of the in-page contact section element that this bar should avoid overlapping with. */
  contactSectionId: string;
  isAdmin?: boolean;
  listingStatus?: "active" | "pending" | "sold";
};

export function CarDetailMobileFloatingContactBar({ dealer, listingId, carName, contactSectionId, isAdmin, listingStatus }: CarDetailMobileFloatingContactBarProps) {
  const [isContactSectionVisible, setIsContactSectionVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // Hide the floating bar when the main contact section is in view (they "touch"),
  // show it again when the user scrolls away from that section.
  useEffect(() => {
    const targets: Element[] = [];

    if (contactSectionId) {
      const contactTarget = document.getElementById(contactSectionId);
      if (contactTarget) targets.push(contactTarget);
    }

    // Also hide the floating bar when the global footer is visible,
    // so it doesn't sit on top of the page footer.
    const footerEl = document.querySelector("footer");
    if (footerEl) targets.push(footerEl);

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === contactSectionId) {
            setIsContactSectionVisible(entry.isIntersecting);
          }
          if (entry.target === footerEl) {
            setIsFooterVisible(entry.isIntersecting);
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, [contactSectionId]);

  if (!dealer && !isAdmin) return null;
  // Hide the floating bar if the main contact section OR the page footer is visible.
  if (isContactSectionVisible || isFooterVisible) return null;

  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || "??";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
      <div className="container mx-auto max-w-7xl">
        <CarDetailContactSection dealer={dealer} listingId={listingId} carName={carName} isAdmin={isAdmin} listingStatus={listingStatus} />
      </div>
    </div>
  );
}
