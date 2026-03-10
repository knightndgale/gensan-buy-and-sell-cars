"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CarMake, CarModel } from "@/schema";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type HeroSlide = {
  tag: string;
  imageSrc: string;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    tag: "Family Pick",
    imageSrc: "/images/slider/slider-1.webp",
  },
  {
    tag: "Budget Pick",
    imageSrc: "/images/slider/slider-2.webp",
  },
];

const PRICE_RANGES = [
  { label: "Select a Max Budget", min: undefined, max: undefined },
  { label: "Under P500k", min: 0, max: 500_000 },
  { label: "P500k - P1M", min: 500_000, max: 1_000_000 },
  { label: "P1M - P2M", min: 1_000_000, max: 2_000_000 },
  { label: "Above P2M", min: 2_000_000, max: undefined },
];

const YEARS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);

export function HeroSection() {
  const router = useRouter();
  const [makeId, setMakeId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

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
    if (year) params.set("year", year);
    const pr = PRICE_RANGES.find((r) => r.label === priceRange);
    if (pr?.min !== undefined) params.set("minPrice", String(pr.min));
    if (pr?.max !== undefined) params.set("maxPrice", String(pr.max));
    router.push(`/cars?${params.toString()}`);
  }, [router, makeId, modelId, year, priceRange]);

  return (
    <section className="relative overflow-hidden bg-primary pt-0 pb-12 md:py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4">
        <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left column: copy + search */}
          <div className="flex h-full flex-col gap-6 sm:order-first order-last justify-start">
            <div className="shrink-0 pt-0 sm:pt-6 md:pt-2 lg:pt-0">
              <h2 className="mb-4 text-5xl font-bold text-white sm:text-3xl sm:font-extrabold lg:text-4xl">Buy & Sell Cars in General Santos</h2>
              <p className="w-full text-base text-white/90 sm:text-lg leading-5">
                We connect you with verified local owners in General Santos City, so you can find, view, and buy a car without scams or endless Facebook haggling.
              </p>
            </div>

            <div className="min-h-0 flex-1 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg  text-foreground">What car are you looking for?</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                  value={makeId || "all"}
                  onValueChange={(v) => {
                    setMakeId(v === "all" ? "" : v);
                    setModelId("");
                  }}>
                  <SelectTrigger className="w-full px-4 py-[14px]">
                    <SelectValue placeholder="Select a Make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Select a Make</SelectItem>
                    {makes.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={modelId || "all"} onValueChange={(v) => setModelId(v === "all" ? "" : v)}>
                  <SelectTrigger className="w-full px-4 py-[14px]">
                    <SelectValue placeholder="Select a Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Select a Model</SelectItem>
                    {models.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={year || "all"} onValueChange={(v) => setYear(v === "all" ? "" : v)}>
                  <SelectTrigger className="w-full px-4 py-[14px]">
                    <SelectValue placeholder="Select a Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Select a Year</SelectItem>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={priceRange || "Select a Max Budget"} onValueChange={(v) => setPriceRange(v === "Select a Max Budget" ? "" : v)}>
                  <SelectTrigger className="w-full px-4 py-[14px]">
                    <SelectValue placeholder="Select a Max Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map((r) => (
                      <SelectItem key={r.label} value={r.label === "Select a Max Budget" ? "Select a Max Budget" : r.label}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} className="mt-4 w-full text-base" size="lg">
                <Search className="size-5" />
                Search Cars
              </Button>
            </div>
          </div>

          {/* Right column: featured offer carousel — matches left column height */}
          <div className="relative order-first h-full min-h-[280px] overflow-hidden rounded-none shadow-lg sm:order-last sm:mx-0 sm:rounded-xl -mx-3">
            {HERO_SLIDES.map((slide, index) => (
              <div key={index} className={cn("absolute inset-0 transition-opacity duration-300", index === activeIndex ? "z-10 opacity-100" : "z-0 opacity-0")}>
                <Image onClick={() => router.push("/cars")} src={slide.imageSrc} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority={index === 0} />
              </div>
            ))}
            {/* Pagination - visible on lg+ only, hidden on mobile */}
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 lg:bottom-8">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn("rounded-full transition-colors", i === activeIndex ? "h-2 w-8 bg-white" : "size-2 bg-white/40 hover:bg-white/60")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
