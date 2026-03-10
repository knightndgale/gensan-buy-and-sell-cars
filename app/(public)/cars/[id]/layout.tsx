import type { Metadata } from "next";
import { getListingById } from "@/lib/firestore/listings";
import { getCarMakes, getCarModels } from "@/lib/firestore/cars";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const listing = await getListingById(id);
    if (!listing) return {};
    const [models, makes] = await Promise.all([
      import("@/lib/firestore/cars").then((m) => m.getCarModels()),
      import("@/lib/firestore/cars").then((m) => m.getCarMakes()),
    ]);
    const model = typeof listing.modelId === "number" ? models.find((m) => m.id === listing.modelId) : undefined;
    const make = model ? makes.find((m) => m.id === model.makeId) : undefined;
    const derivedTitle = [make?.name, model?.name, listing.year].filter(Boolean).join(" ");
    const title = listing.title?.trim() || derivedTitle;
    return {
      title: `${title} | Gensan Car Buy & Sell`,
      description:
        listing.description?.slice(0, 160) ??
        (listing.location ? `Car for sale in ${listing.location}` : undefined),
    };
  } catch {
    return {};
  }
}

export default function CarDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
