"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListingFormInputSchema, type ListingFormInput, type ListingImage } from "@/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { CarMake, CarModel } from "@/schema";
import { formatPrice } from "@/lib/format";

type ListingFormProps = {
  initialData?: Partial<ListingFormInput>;
  listingId?: string;
};

type ImageItem =
  | { type: "new"; file: File; preview: string }
  | { type: "existing"; image: ListingImage };

export function ListingForm({ initialData, listingId }: ListingFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  const form = useForm<ListingFormInput>({
    resolver: zodResolver(ListingFormInputSchema),
    defaultValues: {
      modelId: 0,
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      transmission: "automatic",
      fuelType: "gasoline",
      location: "",
      description: "",
      status: "active",
      isFeatured: false,
      ...initialData,
    },
  });

  const { data: makes = [] } = useQuery({
    queryKey: ["carMakes"],
    queryFn: async () => {
      const res = await fetch("/api/cars/makes");
      return res.json() as Promise<CarMake[]>;
    },
  });

  const { data: models = [] } = useQuery({
    queryKey: ["carModels"],
    queryFn: async () => {
      const res = await fetch("/api/cars/models");
      return res.json() as Promise<CarModel[]>;
    },
  });

  const { data: existingImages = [] } = useQuery({
    queryKey: ["listingImages", listingId],
    queryFn: async () => {
      if (!listingId) return [];
      const res = await fetch(`/api/listings/${listingId}/images`);
      if (!res.ok) return [];
      return res.json() as Promise<ListingImage[]>;
    },
    enabled: !!listingId,
  });

  const hasInitializedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!listingId || existingImages.length === 0) return;
    if (hasInitializedRef.current === listingId) return;
    if (imageItems.length > 0) return;
    hasInitializedRef.current = listingId;
    const kept = existingImages.filter((img) => !removedImageIds.includes(img.id!));
    const items: ImageItem[] = kept.map((img) => ({ type: "existing", image: img }));
    setImageItems(items);
    const primaryIdx = kept.findIndex((i) => i.isPrimary);
    setPrimaryIndex(primaryIdx >= 0 ? primaryIdx : 0);
  }, [listingId, existingImages, removedImageIds]);

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const newItems: ImageItem[] = [...imageItems];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      const preview = URL.createObjectURL(file);
      newItems.push({ type: "new", file, preview });
    }
    setImageItems(newItems);
  }

  function removeItem(index: number) {
    const item = imageItems[index];
    if (item.type === "existing") {
      setRemovedImageIds((prev) => [...prev, item.image.id!]);
    }
    setImageItems((prev) => prev.filter((_, i) => i !== index));
    setPrimaryIndex((prev) => {
      if (prev === index) return 0;
      if (prev > index) return prev - 1;
      return prev;
    });
  }

  function setAsPrimary(index: number) {
    setPrimaryIndex(index);
  }

  async function onSubmit(data: ListingFormInput) {
    const url = listingId ? `/api/listings/${listingId}` : "/api/listings";
    const method = listingId ? "PATCH" : "POST";

    const formData = new FormData();
    const listingPayload = listingId ? { ...data, dealerId: undefined } : data;
    formData.append("listing", JSON.stringify(listingPayload));

    const newFiles = imageItems.filter((i): i is ImageItem & { type: "new" } => i.type === "new");
    const primaryItem = imageItems[primaryIndex];
    const primaryIsNew = primaryItem?.type === "new";

    if (primaryIsNew && primaryItem) {
      formData.append("images", primaryItem.file);
    }
    for (const item of newFiles) {
      if (primaryIsNew && item === primaryItem) continue;
      formData.append("images", item.file);
    }

    if (listingId) {
      const primaryImageId = primaryItem?.type === "existing" ? primaryItem.image.id ?? "" : "";
      formData.append("primaryImageId", primaryImageId);
      formData.append("removedImageIds", JSON.stringify(removedImageIds));
    } else {
      formData.append("primaryImageIndex", String(primaryIndex));
    }

    const res = await fetch(url, {
      method,
      body: formData,
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to save");
    }
    router.push("/seller/listings");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="modelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(parseInt(v, 10) || 0)}
                value={field.value ? String(field.value) : "0"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">Select model</SelectItem>
                  {models.map((m) => {
                    const make = makes.find((mk) => mk.id === m.makeId);
                    return (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {make?.name} {m.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (PHP)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={field.value ? formatPrice(field.value) : ""}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      field.onChange(raw ? parseInt(raw, 10) : 0);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mileage (km)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmission</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                    <SelectItem value="dct">DCT</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gasoline">Gasoline</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Images</FormLabel>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Add images
          </Button>
          {imageItems.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {imageItems.map((item, index) => (
                <div
                  key={index}
                  className="relative aspect-video overflow-hidden rounded-lg border bg-muted"
                >
                  {item.type === "new" ? (
                    <img
                      src={item.preview}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.image.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/60 p-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={primaryIndex === index ? "default" : "secondary"}
                      className="text-xs"
                      onClick={() => setAsPrimary(index)}
                    >
                      {primaryIndex === index ? "Feature" : "Set feature"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="text-xs"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormLabel className="mt-0!">Featured</FormLabel>
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
