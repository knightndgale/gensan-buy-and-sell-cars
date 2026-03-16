"use client";

import { GHLFormEmbed } from "@/components/GHLFormEmbed";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Dealer } from "@/schema";
import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type CarDetailContactSectionProps = {
  dealer: Dealer | null;
  listingId: string;
  carName: string;
  hideGhlButton?: boolean;
};

function normalizePhoneForWa(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("63")) return digits;
  if (digits.startsWith("0")) return "63" + digits.slice(1);
  return "63" + digits;
}

export function CarDetailContactSection({ dealer, listingId, carName }: CarDetailContactSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const ghlFormUrl = dealer?.ghlFormEmbedUrl ?? process.env.NEXT_PUBLIC_GHL_FORM_EMBED_URL;

  const phone = dealer?.phone;
  const viberUrl = dealer?.viberUrl ?? (phone ? `viber://add?number=${normalizePhoneForWa(phone)}` : null);
  const whatsappUrl = dealer?.whatsappUrl ?? (phone ? `https://wa.me/${normalizePhoneForWa(phone)}` : null);
  const messengerUrl = dealer?.messengerUrl ?? null;
  const callUrl = phone ? `tel:${phone.startsWith("+") ? phone : `+${normalizePhoneForWa(phone)}`}` : null;

  const contactButtons = [
    {
      label: "Viber",
      href: viberUrl,
      className: "bg-gradient-to-b from-[#8F48C8] to-[#63328B] text-white shadow-sm",
      icon: MessageCircle,
    },
    {
      label: "Whatsapp",
      href: whatsappUrl,
      className: "bg-gradient-to-b from-[#57F677] to-[#00BA22] text-white shadow-sm",
      icon: MessageCircle,
    },
    {
      label: "FB Messenger",
      href: messengerUrl,
      className: "bg-gradient-to-tr from-[#297FFF] via-[#A530E5] to-[#F86866] text-white shadow-sm",
      icon: MessageCircle,
    },
    {
      label: "Call Us",
      href: callUrl,
      className: "bg-primary text-white shadow-sm",
      icon: Phone,
    },
  ];

  const content = (
    <div className="space-y-4">
      <Link
        href={`/cars/${listingId}/contact`}
        className="my-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:px-4 sm:py-3 sm:text-base">
        <MessageCircle className="size-5" />
        Leave Your Contact Info
      </Link>

      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {contactButtons.map((btn) => {
          const Icon = btn.icon;
          const isDisabled = !btn.href;

          if (isDisabled) {
            return (
              <div
                key={btn.label}
                className={`flex flex-col items-center justify-center gap-0.5 sm:gap-1 rounded-lg sm:rounded-xl px-1.5 py-2 sm:px-2 sm:py-3 opacity-100
                    ${btn.className}`}>
                <Icon className="size-5 sm:size-6" />
                <span className="text-[11px] sm:text-xs font-medium leading-tight text-center">{btn.label}</span>
              </div>
            );
          }

          const isExternal = btn.href!.startsWith("http") || btn.href!.startsWith("viber");
          return (
            <a
              key={btn.label}
              href={btn.href!}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`flex flex-col items-center justify-center gap-0.5 sm:gap-1 rounded-lg sm:rounded-xl px-1.5 py-2 sm:px-2 sm:py-3 transition hover:opacity-90 min-w-0 ${btn.className}`}>
              <Icon className="size-5 sm:size-6" />
              <span className="text-[11px] sm:text-xs font-medium leading-tight text-center min-w-0 break-words">{btn.label}</span>
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
            <GHLFormEmbed formUrl={ghlFormUrl} listingId={listingId} carName={carName} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
