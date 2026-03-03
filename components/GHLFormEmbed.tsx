"use client";

import { useEffect, useRef } from "react";

type GHLFormEmbedProps = {
  formUrl?: string | null;
  listingId: string;
  carName: string;
};

const FALLBACK_FORM_URL = process.env.NEXT_PUBLIC_GHL_FORM_EMBED_URL;

export function GHLFormEmbed({ formUrl, listingId, carName }: GHLFormEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const url = formUrl || FALLBACK_FORM_URL;

  useEffect(() => {
    if (!url || !containerRef.current) return;

    const iframe = document.createElement("iframe");
    const embedUrl = new URL(url);
    embedUrl.searchParams.set("listing_id", listingId);
    embedUrl.searchParams.set("car", carName);
    iframe.src = embedUrl.toString();
    iframe.style.width = "100%";
    iframe.style.minHeight = "400px";
    iframe.style.border = "none";
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(iframe);
  }, [url, listingId, carName]);

  if (!url) {
    return (
      <div className="rounded-lg border bg-muted p-8 text-center text-muted-foreground">
        <p>Contact form not configured. Please set ghlFormEmbedUrl for the dealer or NEXT_PUBLIC_GHL_FORM_EMBED_URL.</p>
      </div>
    );
  }

  return <div ref={containerRef} className="min-h-[400px] rounded-lg border" />;
}
