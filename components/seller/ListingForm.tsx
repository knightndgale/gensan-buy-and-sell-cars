"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CarFeature } from "@/lib/firestore/features";
import type { CarMake, CarModel } from "@/schema";
import { ListingFormInputSchema, type ListingFormInput, type ListingImage } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Check, FileText, Info, Plus, Save, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

type ListingFormProps = {
  initialData?: Partial<ListingFormInput> & { makeId?: number };
  listingId?: string;
  listingStatus?: "active" | "sold" | "archived" | "pending";
};

type ImageItem = { type: "new"; file: File; preview: string } | { type: "existing"; image: ListingImage };

export function ListingForm({ initialData, listingId, listingStatus }: ListingFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [makeId, setMakeId] = useState<number>(initialData?.makeId ?? 0);
  const [addFeatureOpen, setAddFeatureOpen] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState("");
  const [addFeatureError, setAddFeatureError] = useState<string | null>(null);

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
      bodyType: "",
      engine: "",
      color: "",
      title: "",
      ...initialData,
      features: Array.isArray(initialData?.features) ? initialData.features : [],
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
    queryKey: ["carModels", makeId],
    queryFn: async () => {
      const url = makeId ? `/api/cars/models?makeId=${makeId}` : "/api/cars/models";
      const res = await fetch(url);
      return res.json() as Promise<CarModel[]>;
    },
  });

  const { data: allModels = [] } = useQuery({
    queryKey: ["carModelsAll"],
    queryFn: async () => {
      const res = await fetch("/api/cars/models");
      return res.json() as Promise<CarModel[]>;
    },
    enabled: !!initialData?.modelId && !makeId,
  });

  useEffect(() => {
    if (initialData?.modelId && !makeId && allModels.length > 0) {
      const model = allModels.find((m) => m.id === initialData.modelId);
      if (model) setMakeId(model.makeId);
    }
  }, [initialData?.modelId, makeId, allModels]);

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

  const { data: features = [] } = useQuery({
    queryKey: ["carFeatures"],
    queryFn: async () => {
      const res = await fetch("/api/features");
      return res.json() as Promise<CarFeature[]>;
    },
  });

  const addFeatureMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to add feature");
      }
      return res.json() as Promise<CarFeature>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["carFeatures"] });
      const current = form.getValues("features") ?? [];
      if (!current.includes(data.name)) {
        form.setValue("features", [...current, data.name]);
      }
      setNewFeatureName("");
      setAddFeatureError(null);
      setAddFeatureOpen(false);
    },
    onError: (err) => {
      setAddFeatureError(err instanceof Error ? err.message : "Failed to add feature");
    },
  });

  function handleAddFeature() {
    const trimmed = newFeatureName.trim();
    if (!trimmed) {
      setAddFeatureError("Feature name is required");
      return;
    }
    setAddFeatureError(null);
    addFeatureMutation.mutate(trimmed);
  }

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
      if (newItems.length >= 6) break;
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
    if (!listingId && imageItems.length === 0) {
      form.setError("root", { message: "Please add at least one photo" });
      return;
    }
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
      const primaryImageId = primaryItem?.type === "existing" ? (primaryItem.image.id ?? "") : "";
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
    router.push("/seller");
    router.refresh();
  }

  const isCreate = !listingId;

  const photosSection = (
    <section className="space-y-6  sm:p-4 sm:bg-white rounded-lg sm:border sm:shadow">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base font-medium">Photos*</FormLabel>
        <span className="text-sm text-muted-foreground">{imageItems.length}/6</span>
      </div>
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

      <div className="flex flex-wrap gap-3">
        {imageItems.map((item, index) => (
          <div key={index} className="relative h-30 w-30 shrink-0 overflow-hidden rounded-lg border bg-muted">
            {item.type === "new" ? <img src={item.preview} alt="" className="h-full w-full object-cover" /> : <Image src={item.image.imageUrl} alt="" fill className="object-cover" sizes="80px" />}
            <span
              className={`absolute bottom-1 left-1 rounded-full px-2 py-0.5 text-xs font-medium shadow-sm ${
                primaryIndex === index ? "bg-primary text-primary-foreground" : "cursor-pointer bg-black/60 text-white hover:bg-black/80"
              }`}
              onClick={() => setAsPrimary(index)}>
              {primaryIndex === index ? "Main" : "Set main"}
            </span>
            <button type="button" onClick={() => removeItem(index)} className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80" aria-label="Remove photo">
              <X className="size-3" />
            </button>
          </div>
        ))}
        {imageItems.length < 6 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-30 h-30 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-primary/30 bg-white transition-colors hover:border-primary/50 hover:bg-muted/50 sm:bg-muted/30">
            <span className="rounded-full bg-primary/10 p-2">
              <Camera className="size-6 text-primary" />
            </span>
            <span className="text-sm font-medium text-muted-foreground">Add Photo</span>
          </button>
        )}
      </div>

      <p className="flex items-start gap-2 text-xs text-muted-foreground ">
        <Info className="size-3.5 shrink-0 text-muted-foreground" />
        First photo will be the main listing photo. Include front, rear, side and interior shots.
      </p>
    </section>
  );

  const listingPreview = isCreate && (
    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30 hidden md:block">
      <div className="flex gap-3">
        <FileText className="size-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 className="font-medium text-blue-900 dark:text-blue-100">Listing Preview</h3>
          <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
            Your listing will appear to buyers exactly as you see other listings on GBSC. If a buyer reached out, we will inform you immediately.
          </p>
        </div>
      </div>
    </div>
  );

  const listingStatusBanner = !isCreate && listingStatus && (
    <div
      className={`rounded-lg p-4 ${
        listingStatus === "active"
          ? "bg-green-50 dark:bg-green-950/30"
          : listingStatus === "sold"
            ? "bg-amber-50 dark:bg-amber-950/30"
            : listingStatus === "pending"
              ? "bg-orange-50 dark:bg-orange-950/30"
              : "bg-muted"
      }`}>
      <div className="flex gap-3">
        {listingStatus === "active" ? (
          <Check className="size-5 shrink-0 text-green-600 dark:text-green-400" />
        ) : (
          <Info
            className={`size-5 shrink-0 ${
              listingStatus === "sold" ? "text-amber-600 dark:text-amber-400" : listingStatus === "pending" ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground"
            }`}
          />
        )}
        <div>
          <p className="text-sm font-medium">
            {listingStatus === "active" && "This listing is currently active and visible to buyers."}
            {listingStatus === "sold" && "This listing has been marked as sold."}
            {listingStatus === "pending" && "This listing is awaiting admin approval. It will go live once approved."}
            {listingStatus === "archived" && "This listing is archived and not visible to buyers."}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Link href="/seller" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        ← Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold">{isCreate ? "Add New Listing" : "Edit Listing"}</h1>
      <p className="mt-1 text-muted-foreground">{isCreate ? "Fill in the details below to list your car for sale" : "Update the details of your car listing"}</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
          {form.formState.errors.root?.message && <p className="mb-4 text-sm text-destructive">{form.formState.errors.root.message}</p>}
          <div className="lg:grid lg:grid-cols-[1fr_1.5fr] lg:gap-8">
            <div className="space-y-6 lg:order-1">
              {photosSection}
              {listingPreview}
              {listingStatusBanner}
            </div>

            <div className="mt-8 space-y-8 lg:order-2 lg:mt-0 bg-transparent sm:p-6 sm:bg-white rounded-md border-0 sm:border sm:shadow">
              <section className="space-y-4 rounded ">
                <h2 className="text-lg font-semibold">Basic Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <FormLabel>Make*</FormLabel>
                    <Select
                      value={makeId ? String(makeId) : "0"}
                      onValueChange={(v) => {
                        const id = parseInt(v, 10) || 0;
                        setMakeId(id);
                        form.setValue("modelId", 0);
                      }}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select a Make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Select a Make</SelectItem>
                        {makes.map((m) => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormField
                    control={form.control}
                    name="modelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model*</FormLabel>
                        <Select onValueChange={(v) => field.onChange(parseInt(v, 10) || 0)} value={field.value ? String(field.value) : "0"} disabled={!makeId}>
                          <FormControl>
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="e.g. Vios, Civic, Mirage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Select a Model</SelectItem>
                            {models.map((m) => (
                              <SelectItem key={m.id} value={String(m.id)}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year*</FormLabel>
                        <Select onValueChange={(v) => field.onChange(parseInt(v, 10) || 0)} value={field.value ? String(field.value) : ""}>
                          <FormControl>
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Select a Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {YEARS.map((y) => (
                              <SelectItem key={y} value={String(y)}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. 2020 Toyota Vios 1.3 XE CVT" value={field.value ?? ""} className="w-full bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Pricing & Condition</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price*</FormLabel>
                        <FormControl>
                          <div className="flex w-full">
                            <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">₱</span>
                            <Input
                              type="text"
                              inputMode="numeric"
                              placeholder="e.g. 620000"
                              className="rounded-l-none bg-white"
                              value={field.value ? field.value.toLocaleString() : ""}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "");
                                field.onChange(raw ? parseInt(raw, 10) : 0);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mileage*</FormLabel>
                        <FormControl>
                          <div className="flex w-full">
                            <Input
                              type="text"
                              inputMode="numeric"
                              placeholder="e.g. 35000"
                              className="rounded-r-none bg-white"
                              value={field.value ? field.value : ""}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "");
                                field.onChange(raw ? parseInt(raw, 10) : 0);
                              }}
                            />
                            <span className="flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">km</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Specifications</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transmission*</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Select" />
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
                    name="bodyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Type*</FormLabel>
                        <Select onValueChange={(v) => field.onChange(v === "__none__" ? "" : v)} value={field.value || "__none__"}>
                          <FormControl>
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="__none__">—</SelectItem>
                            <SelectItem value="Sedan">Sedan</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="Hatchback">Hatchback</SelectItem>
                            <SelectItem value="Pickup">Pickup</SelectItem>
                            <SelectItem value="MPV">MPV</SelectItem>
                            <SelectItem value="Van">Van</SelectItem>
                            <SelectItem value="Coupe">Coupe</SelectItem>
                            <SelectItem value="Wagon">Wagon</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="engine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine Size</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. 1.3L" value={field.value ?? ""} className="w-full bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type*</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Select" />
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
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Description</h2>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tell buyers about your car</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Describe the condition, maintenance history, reasons for selling, negotiability, etc."
                          value={field.value ?? ""}
                          className="w-full bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Features</h2>
                <p className="text-sm text-muted-foreground">Select all features that apply to your car</p>
                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {features.map((f) => {
                            const feature = f.name;
                            const selected = (field.value ?? []).includes(feature);
                            return (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => {
                                  const current = field.value ?? [];
                                  if (selected) {
                                    field.onChange(current.filter((x) => x !== feature));
                                  } else {
                                    field.onChange([...current, feature]);
                                  }
                                }}
                                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                  selected ? "bg-primary text-primary-foreground" : "border border-input bg-background hover:bg-accent"
                                }`}>
                                {selected && <Check className="size-4" />}
                                {feature}
                              </button>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => {
                              setAddFeatureError(null);
                              setNewFeatureName("");
                              setAddFeatureOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-input bg-muted/30 px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-muted/50">
                            <Plus className="size-4" />
                            Add Feature
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <Dialog open={addFeatureOpen} onOpenChange={setAddFeatureOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Feature</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="new-feature-name" className="text-sm font-medium">
                        Feature name
                      </label>
                      <Input
                        id="new-feature-name"
                        value={newFeatureName}
                        onChange={(e) => {
                          setNewFeatureName(e.target.value);
                          setAddFeatureError(null);
                        }}
                        placeholder="e.g. Heated Seats"
                        className="w-full bg-white"
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                      />
                      {addFeatureError && <p className="text-sm text-destructive">{addFeatureError}</p>}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setAddFeatureOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleAddFeature} disabled={addFeatureMutation.isPending}>
                      {addFeatureMutation.isPending ? "Adding..." : "Add Feature"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    "Saving..."
                  ) : isCreate ? (
                    <>
                      <Plus className="size-4" />
                      Submit Listing for Approval
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
