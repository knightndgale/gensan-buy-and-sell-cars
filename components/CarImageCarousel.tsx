"use client";

import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type CarImageCarouselProps = {
  images: { imageUrl: string; isPrimary?: boolean }[];
  alt: string;
  /** When set, shows a circular back control on small screens only (detail page). */
  backHref?: string;
  /** Pull carousel to viewport edges on mobile; restores inset + radius from `lg`. */
  mobileEdgeToEdge?: boolean;
};

export function CarImageCarousel({ images, alt, backHref, mobileEdgeToEdge }: CarImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return 0;
  });

  const total = sortedImages.length;
  const current = total > 0 ? activeIndex + 1 : 0;

  const goPrev = () => {
    setActiveIndex((i) => (i <= 0 ? total - 1 : i - 1));
  };

  const goNext = () => {
    setActiveIndex((i) => (i >= total - 1 ? 0 : i + 1));
  };

  if (total === 0) {
    return (
      <div
        className={cn(
          "space-y-3",
          mobileEdgeToEdge && "-mx-3 sm:-mx-4 lg:mx-0",
        )}>
        <div
          className={cn(
            "relative aspect-video overflow-hidden bg-muted",
            mobileEdgeToEdge ? "rounded-none lg:rounded-lg" : "rounded-lg",
          )}>
          <ImagePlaceholder fill className={cn("border-0", mobileEdgeToEdge ? "rounded-none lg:rounded-lg" : "rounded-lg")} />
        </div>
      </div>
    );
  }

  const circleOverlay =
    "flex items-center justify-center rounded-full bg-black/45 text-white shadow-sm backdrop-blur-[2px] transition hover:bg-black/55 active:bg-black/60";

  return (
    <div
      className={cn(
        "space-y-3",
        mobileEdgeToEdge && "-mx-3 sm:-mx-4 lg:mx-0",
      )}>
      <div
        className={cn(
          "relative aspect-video overflow-hidden bg-muted",
          mobileEdgeToEdge ? "rounded-none lg:rounded-lg" : "rounded-lg",
        )}>
        <Image src={sortedImages[activeIndex].imageUrl} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority={activeIndex === 0} />

        {backHref && (
          <Link
            href={backHref}
            className={cn(circleOverlay, "absolute left-3 top-3 z-10 size-9 lg:hidden")}
            aria-label="Back to listings">
            <ArrowLeft className="size-5 stroke-[1.75]" aria-hidden />
          </Link>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className={cn(circleOverlay, "absolute left-2 top-1/2 z-10 size-8 -translate-y-1/2 lg:size-10")}
              aria-label="Previous image">
              <ChevronLeft className="size-5 stroke-2 lg:size-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className={cn(circleOverlay, "absolute right-2 top-1/2 z-10 size-8 -translate-y-1/2 lg:size-10")}
              aria-label="Next image">
              <ChevronRight className="size-5 stroke-2 lg:size-6" />
            </button>

            <div
              className={cn(
                "absolute z-10 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium tabular-nums text-white backdrop-blur-[2px]",
                "bottom-3 right-3 lg:bottom-auto lg:right-3 lg:top-3",
              )}>
              {current}/{total}
            </div>

            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 lg:bottom-2">
              {sortedImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "transition-[width,background-color]",
                    i === activeIndex
                      ? "h-2 w-6 shrink-0 rounded-full bg-white"
                      : "size-2 shrink-0 rounded-full bg-white/45 hover:bg-white/65",
                  )}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="hidden gap-2 overflow-x-auto pb-1 lg:flex">
          {sortedImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-lg border-2 transition",
                i === activeIndex ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent hover:border-muted-foreground/30",
              )}>
              <div className="relative aspect-video w-20 sm:w-24">
                <Image src={img.imageUrl} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="96px" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
