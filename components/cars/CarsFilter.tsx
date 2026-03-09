"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BODY_TYPE_OPTIONS, MILEAGE_BRACKETS, PRICE_BRACKETS, TRANSMISSION_OPTIONS, YEARS } from "@/lib/filters";
import type { CarMake, CarModel } from "@/schema";
import { ChevronUp, Filter, RotateCcw, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type CarsFilterFormProps = {
  makes: CarMake[];
  models: CarModel[];
  onSearchClick?: () => void;
};

function formatPriceOption(value: number): string {
  if (value >= 1_000_000) return `₱${(value / 1_000_000).toFixed(1)}M`;
  return `₱${(value / 1000).toFixed(0)}k`;
}

function formatMileageOption(value: number): string {
  return `${(value / 1000).toFixed(0)}k km`;
}

function CarsFilterForm({ makes, models, onSearchClick }: CarsFilterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const makeParam = searchParams.get("make") ?? "";
  const modelParam = searchParams.get("model") ?? "";
  const minPriceParam = searchParams.get("minPrice") ?? "";
  const maxPriceParam = searchParams.get("maxPrice") ?? "";
  const yearParam = searchParams.get("year") ?? "";
  const minMileageParam = searchParams.get("minMileage") ?? "";
  const maxMileageParam = searchParams.get("maxMileage") ?? "";
  const transmissionParam = searchParams.get("transmission") ?? "";
  const bodyTypeParam = searchParams.get("bodyType") ?? "";

  const updateUrl = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      const qs = params.toString();
      router.push(qs ? `/cars?${qs}` : "/cars", { scroll: false });
    },
    [router, searchParams],
  );

  const handleReset = useCallback(() => {
    router.push("/cars", { scroll: false });
  }, [router]);

  const setParam = (key: string) => (value: string) => {
    updateUrl({ [key]: value === "__any__" ? undefined : value });
  };

  const [showLessFilters, setShowLessFilters] = useState(true);

  return (
    <div className="space-y-6">
      {/* WHAT CAR? */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What Car?</h3>
        <div className="space-y-2">
          <Select value={makeParam || "__any__"} onValueChange={setParam("make")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__any__">Any Make</SelectItem>
              {makes.map((make) => (
                <SelectItem key={make.id} value={String(make.id)}>
                  {make.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={modelParam || "__any__"} onValueChange={setParam("model")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__any__">Any Model</SelectItem>
              {models.map((model) => (
                <SelectItem key={model.id} value={String(model.id)}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* PRICE */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</h3>
        <div className="space-y-2">
          <Select value={minPriceParam || "__any__"} onValueChange={setParam("minPrice")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Min. Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__any__">Any Min. Price</SelectItem>
              {PRICE_BRACKETS.map((p) => (
                <SelectItem key={p} value={String(p)}>
                  {formatPriceOption(p)}+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={maxPriceParam || "__any__"} onValueChange={setParam("maxPrice")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Max. Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__any__">Any Max. Price</SelectItem>
              {PRICE_BRACKETS.filter((p) => p > 0).map((p) => (
                <SelectItem key={p} value={String(p)}>
                  Up to {formatPriceOption(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* YEAR */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Year</h3>
        <Select value={yearParam || "__any__"} onValueChange={setParam("year")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__any__">Any Year</SelectItem>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Less Filters Toggle (mobile only) */}
      <button
        type="button"
        onClick={() => setShowLessFilters(!showLessFilters)}
        className="flex w-full items-center justify-center gap-1 rounded-md border py-2 text-sm text-muted-foreground hover:bg-muted lg:hidden">
        {showLessFilters ? "More Filters" : "Less Filters"}
        <ChevronUp className={`size-4 transition-transform ${showLessFilters ? "rotate-180" : ""}`} />
      </button>

      {/* MILEAGE, TRANSMISSION, BODY TYPE - collapsible on mobile only, always visible on desktop */}
      <div className={`space-y-6 ${showLessFilters ? "hidden lg:block" : ""}`}>
        {/* MILEAGE */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mileage</h3>
          <div className="space-y-2">
            <Select value={minMileageParam || "__any__"} onValueChange={setParam("minMileage")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Min. Mileage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any__">Any Min. Mileage</SelectItem>
                {MILEAGE_BRACKETS.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {formatMileageOption(m)}+
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={maxMileageParam || "__any__"} onValueChange={setParam("maxMileage")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Max. Mileage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any__">Any Max. Mileage</SelectItem>
                {MILEAGE_BRACKETS.filter((m) => m > 0).map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    Up to {formatMileageOption(m)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* TRANSMISSION */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Transmission</h3>
          <Select value={transmissionParam || "__any__"} onValueChange={setParam("transmission")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__any__">Any Transmission</SelectItem>
              {TRANSMISSION_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* BODY TYPE */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Body Type</h3>
          <Select value={bodyTypeParam || "__any__"} onValueChange={setParam("bodyType")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Body Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__any__">Any Body Type</SelectItem>
              {BODY_TYPE_OPTIONS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex max-md:flex-row flex-col gap-2">
        <Button onClick={handleReset} variant="outline" className="flex-1 gap-2">
          <RotateCcw className="size-4" />
          Reset
        </Button>
        <Button onClick={onSearchClick} className="flex-1 gap-2">
          <Search className="size-4" />
          Search Car
        </Button>
      </div>
    </div>
  );
}

type CarsFilterSidebarProps = CarsFilterFormProps;

export function CarsFilterSidebar({ makes, models }: CarsFilterSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-4 space-y-4 rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <CarsFilterForm makes={makes} models={models} />
      </div>
    </aside>
  );
}

type CarsFilterDrawerProps = CarsFilterFormProps & {
  listingCount: number;
};

export function CarsFilterDrawer({ makes, models, listingCount }: CarsFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Filter className="size-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-xl border-t">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 px-4 mb-[50px]">
          <p className="mb-4 text-sm text-muted-foreground">
            {listingCount} car{listingCount !== 1 ? "s" : ""} found
          </p>
          <CarsFilterForm makes={makes} models={models} onSearchClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
