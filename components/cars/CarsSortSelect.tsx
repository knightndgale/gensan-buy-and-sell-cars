"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export type SortOption = "newest" | "price_asc" | "price_desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export function CarsSortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortParam = (searchParams.get("sort") as SortOption) || "newest";
  const value = SORT_OPTIONS.some((o) => o.value === sortParam) ? sortParam : "newest";

  const handleChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newValue === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", newValue);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/cars?${qs}` : "/cars", { scroll: false });
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="mt-4 min-w-[160px]">
        <SelectValue placeholder="Newest First" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
