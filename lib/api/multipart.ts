export type ParsedCreateForm = {
  listing: Record<string, unknown>;
  images: File[];
  primaryImageIndex: number | null;
};

export type ParsedUpdateForm = {
  listing: Record<string, unknown>;
  images: File[];
  primaryImageId: string | null;
  removedImageIds: string[];
};

export async function parseCreateListingForm(request: Request): Promise<ParsedCreateForm> {
  const formData = await request.formData();
  const listing: Record<string, unknown> = {};
  const images: File[] = [];
  let primaryImageIndex: number | null = null;

  for (const [key, value] of formData.entries()) {
    if (key === "listing") {
      try {
        const parsed = JSON.parse(value as string) as Record<string, unknown>;
        Object.assign(listing, parsed);
      } catch {
        // ignore invalid JSON
      }
    } else if (key === "images" && value instanceof File && value.size > 0) {
      images.push(value);
    } else if (key === "primaryImageIndex") {
      primaryImageIndex = parseInt(String(value), 10);
      if (Number.isNaN(primaryImageIndex)) primaryImageIndex = null;
    }
  }

  return { listing, images, primaryImageIndex };
}

export async function parseUpdateListingForm(request: Request): Promise<ParsedUpdateForm> {
  const formData = await request.formData();
  const listing: Record<string, unknown> = {};
  const images: File[] = [];
  let primaryImageId: string | null = null;
  const removedImageIds: string[] = [];

  for (const [key, value] of formData.entries()) {
    if (key === "listing") {
      try {
        const parsed = JSON.parse(value as string) as Record<string, unknown>;
        Object.assign(listing, parsed);
      } catch {
        // ignore invalid JSON
      }
    } else if (key === "images" && value instanceof File && value.size > 0) {
      images.push(value);
    } else if (key === "primaryImageId" && typeof value === "string") {
      primaryImageId = value || null;
    } else if (key === "removedImageIds") {
      try {
        const arr = JSON.parse(value as string) as string[];
        if (Array.isArray(arr)) removedImageIds.push(...arr);
      } catch {
        // ignore invalid JSON
      }
    }
  }

  return { listing, images, primaryImageId, removedImageIds };
}
