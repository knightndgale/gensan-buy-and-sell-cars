"use client";

import Script from "next/script";

export type GHLFormEmbedProps = {
  formUrl?: string | null;
  className?: string;
  /** Must match the query/hidden field key configured in GHL for the listing page URL. */
  carUrlQueryKey?: string;
};

export function GHLFormEmbed({ formUrl, className }: GHLFormEmbedProps) {
  if (!formUrl) {
    return (
      <div className="rounded-lg border bg-muted p-8 text-center text-muted-foreground">
        <p>Contact form not configured. Please set NEXT_PUBLIC_GHL_FORM_EMBED_URL or the form URL prop.</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className ?? ""}`}>
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
      {formUrl ? (
        <iframe src={formUrl} style={{ width: "100%", height: 938, border: "none" }} title="Vehicle Inquiry Form" scrolling="no" />
      ) : (
        <div className="w-full animate-pulse rounded-md bg-muted" style={{ height: 938, minHeight: 938 }} />
      )}
    </div>
  );
}
