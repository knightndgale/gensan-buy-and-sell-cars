"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { CarMake, CarModel } from "@/schema";

const PRICE_RANGES = [
  { label: "Any", min: undefined, max: undefined },
  { label: "Under P500k", min: 0, max: 500_000 },
  { label: "P500k - P1M", min: 500_000, max: 1_000_000 },
  { label: "P1M - P2M", min: 1_000_000, max: 2_000_000 },
  { label: "Above P2M", min: 2_000_000, max: undefined },
];

const LOCATIONS = ["General Santos", "Davao", "Cagayan de Oro", "Manila", "Cebu"];

export function HeaderSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [makeId, setMakeId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    setMakeId(searchParams.get("make") ?? "");
    setModelId(searchParams.get("model") ?? "");
    setPriceRange(searchParams.get("priceRange") ?? "");
    setLocation(searchParams.get("location") ?? "");
  }, [searchParams]);

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
    enabled: !!makeId,
  });

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (makeId) params.set("make", makeId);
    if (modelId) params.set("model", modelId);
    const pr = PRICE_RANGES.find((r) => r.label === priceRange);
    if (pr?.min !== undefined) params.set("minPrice", String(pr.min));
    if (pr?.max !== undefined) params.set("maxPrice", String(pr.max));
    if (location) params.set("location", location);
    router.push(`/cars?${params.toString()}`);
  }, [router, makeId, modelId, priceRange, location]);

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-lg border bg-white p-2 shadow-sm md:flex-nowrap">
      <Select value={makeId || "all"} onValueChange={(v) => { setMakeId(v === "all" ? "" : v); setModelId(""); }}>
        <SelectTrigger className="min-w-0 w-full md:w-[140px]">
          <SelectValue placeholder="All Makes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Makes</SelectItem>
          {makes.map((m: CarMake) => (
            <SelectItem key={m.id} value={String(m.id)}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={modelId || "all"} onValueChange={(v) => setModelId(v === "all" ? "" : v)}>
        <SelectTrigger className="min-w-0 w-full md:w-[140px]">
          <SelectValue placeholder="Model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Models</SelectItem>
          {models.map((m: CarModel) => (
            <SelectItem key={m.id} value={String(m.id)}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={priceRange || "any"} onValueChange={(v) => setPriceRange(v === "any" ? "" : v)}>
        <SelectTrigger className="min-w-0 w-full md:w-[140px]">
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent>
          {PRICE_RANGES.map((r) => (
            <SelectItem key={r.label} value={r.label === "Any" ? "any" : r.label}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={location || "any"} onValueChange={(v) => setLocation(v === "any" ? "" : v)}>
        <SelectTrigger className="min-w-0 w-full md:w-[140px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Location</SelectItem>
          {LOCATIONS.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleSearch} className="md:ml-auto">
        Search
      </Button>
    </div>
  );
}
