import { type LucideIcon, Car } from "lucide-react";
import { cn } from "@/lib/utils";

type AspectRatio = "aspect-[4/3]" | "aspect-video" | "aspect-square";

interface ImagePlaceholderProps {
  className?: string;
  aspectRatio?: AspectRatio;
  icon?: LucideIcon;
  /** When true, fills parent with absolute positioning (no aspect ratio) */
  fill?: boolean;
}

export function ImagePlaceholder({
  className,
  aspectRatio = "aspect-[4/3]",
  icon: Icon = Car,
  fill = false,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted text-muted-foreground",
        fill ? "absolute inset-0" : aspectRatio,
        className
      )}
    >
      <Icon className="size-10 opacity-50" />
      <span className="text-sm">No image</span>
    </div>
  );
}
