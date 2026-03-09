"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { cn } from "@/lib/utils";

type CarImageCarouselProps = {
  images: { imageUrl: string; isPrimary?: boolean }[];
  alt: string;
};

export function CarImageCarousel({ images, alt }: CarImageCarouselProps) {
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
      <div className="space-y-3">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <ImagePlaceholder fill className="rounded-lg border-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <Image
          src={sortedImages[activeIndex].imageUrl}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={activeIndex === 0}
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
              aria-label="Next image"
            >
              <ChevronRight className="size-6" />
            </button>

            <div className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
              {current}/{total}
            </div>

            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {sortedImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "size-2 rounded-full transition",
                    i === activeIndex ? "bg-white" : "bg-white/50 hover:bg-white/70"
                  )}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sortedImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-lg border-2 transition",
                i === activeIndex
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
            >
              <div className="relative aspect-video w-20 sm:w-24">
                <Image
                  src={img.imageUrl}
                  alt={`${alt} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
