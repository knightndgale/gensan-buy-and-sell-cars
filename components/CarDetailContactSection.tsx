"use client";

import { CarDetailAdminActions } from "@/components/CarDetailAdminActions";
import { GHLFormEmbed } from "@/components/GHLFormEmbed";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { GHL_FORM_EMBED_FALLBACK_URL } from "@/lib/ghl-form";
import { Icons } from "@/lib/icons";
import type { Dealer } from "@/schema";
import { MessageCircle, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type CarDetailContactSectionProps = {
  dealer: Dealer | null;
  listingId: string;
  carName: string;
  hideGhlButton?: boolean;
  /** When true, show admin action buttons instead of contact/social */
  isAdmin?: boolean;
  listingStatus?: "active" | "pending" | "sold";
};

function normalizePhoneForWa(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("63")) return digits;
  if (digits.startsWith("0")) return "63" + digits.slice(1);
  return "63" + digits;
}

export function CarDetailContactSection({ dealer, listingId, carName, isAdmin, listingStatus }: CarDetailContactSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  if (isAdmin && listingStatus) {
    return (
      <div className="space-y-4">
        <CarDetailAdminActions listingId={listingId} listingStatus={listingStatus} />
      </div>
    );
  }

  const phone = "+639171338178";
  const viberUrl = dealer?.viberUrl ?? (phone ? `viber://add?number=${normalizePhoneForWa(phone)}` : null);
  const whatsappUrl = dealer?.whatsappUrl ?? (phone ? `https://wa.me/${normalizePhoneForWa(phone)}` : null);
  const messengerUrl = "https://www.facebook.com/2n2n.ras";
  const callUrl = phone ? `tel:${phone.startsWith("+") ? phone : `+${normalizePhoneForWa(phone)}`}` : null;

  const contactButtons = [
    {
      label: "Viber",
      href: viberUrl,
      className: "bg-gradient-to-b from-[#8F48C8] to-[#63328B] text-white shadow-sm",
      Icon: () => <Icons.viber className="h-6 w-6 text-blue-500" />,
    },
    {
      label: "Whatsapp",
      href: whatsappUrl,
      className: "bg-gradient-to-b from-[#57F677] to-[#00BA22] text-white shadow-sm",
      Icon: () => <Icons.whatsapp className="h-6 w-6 text-blue-500" />,
    },
    {
      label: "FB Messenger",
      href: messengerUrl,
      className: "bg-gradient-to-tr from-[#297FFF] via-[#A530E5] to-[#F86866] text-white shadow-sm",

      Icon: () => <Icons.messenger className="h-5 w-5 " />,
    },
    {
      label: "Call Us",
      href: callUrl,
      className: "bg-primary text-white shadow-sm",
      Icon: () => <PhoneCall className="h-5 w-5 " />,
    },
  ];

  const content = (
    <div className="space-y-4">
      <Link
        href={`/cars/${listingId}/contact?car_url_interested_in=${encodeURIComponent(window.location.origin)}/cars/${listingId}`}
        className="my-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:px-4 sm:py-3 sm:text-base">
        <MessageCircle className="size-5" />
        Leave Your Contact Info
      </Link>

      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {contactButtons.map((Button) => {
          const isDisabled = !Button.href;

          if (isDisabled) {
            return (
              <div
                key={Button.label}
                className={`flex flex-col items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl px-1.5 py-2 sm:px-2 sm:py-3 opacity-100
                    ${Button.className}`}>
                <Button.Icon />
                <span className="text-[8px] sm:text-xs font-medium leading-tight text-center">{Button.label}</span>
              </div>
            );
          }

          const isExternal = Button.href!.startsWith("http") || Button.href!.startsWith("viber");
          return (
            <a
              key={Button.label}
              href={Button.href!}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`flex flex-col items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl px-1.5 py-2 sm:px-2 sm:py-3 transition hover:opacity-90 min-w-0 ${Button.className}`}>
              <Button.Icon />
              <span className="text-[8px] sm:text-xs font-medium leading-tight text-center min-w-0 break-words">{Button.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {content}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetHeader>
            <SheetTitle>Leave Your Contact Info</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex-1 overflow-auto">
            <GHLFormEmbed formUrl={GHL_FORM_EMBED_FALLBACK_URL} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
