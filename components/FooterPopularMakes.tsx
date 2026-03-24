"use client";

import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { CarMake } from "@/schema";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const DISPLAY_COUNT = 3;

interface FooterPopularMakesProps {
  makes: CarMake[];
}

export function FooterPopularMakes({ makes }: FooterPopularMakesProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSearch("");
  };

  const filteredMakes = useMemo(() => {
    if (!search.trim()) return makes;
    const q = search.trim().toLowerCase();
    return makes.filter((m) => m.name.toLowerCase().includes(q));
  }, [makes, search]);

  const displayMakes = makes.slice(0, DISPLAY_COUNT);
  const hasMore = makes.length >= 4;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground sm:text-base">Popular Makes</h3>
      <ul className="flex flex-col gap-x-3 gap-y-3 text-xs text-foreground sm:flex-col sm:gap-x-0 sm:gap-y-3 sm:text-base">
        {displayMakes.map((make) => (
          <li key={make.id}>
            <Link href={`/cars?make=${make.id}`} className="hover:text-primary hover:underline">
              {make.name}
            </Link>
          </li>
        ))}
        {hasMore && (
          <li>
            <Sheet open={open} onOpenChange={handleOpenChange}>
              <SheetTrigger asChild>
                <button type="button" className="text-primary hover:underline">
                  See more
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] flex flex-col px-3 " showCloseButton>
                <SheetHeader className="px-0 pb-0">
                  <SheetTitle className="text-sm sm:text-base">All Car Makes</SheetTitle>
                </SheetHeader>
                <div className="relative mb-[50px] flex min-h-0 flex-1 flex-col gap-4 text-xs sm:text-base">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:size-5" />
                    <Input
                      type="search"
                      placeholder="Search makes..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 text-xs sm:text-base"
                      autoFocus
                    />
                  </div>
                  <ul className="flex-1 overflow-y-auto space-y-2 pr-2 ">
                    {filteredMakes.length === 0 ? (
                      <li className="py-4 text-muted-foreground">No makes found.</li>
                    ) : (
                      filteredMakes.map((make) => (
                        <li key={make.id}>
                          <Link href={`/cars?make=${make.id}`} onClick={() => setOpen(false)} className="block py-2 hover:text-primary hover:underline">
                            {make.name}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </SheetContent>
            </Sheet>
          </li>
        )}
      </ul>
    </div>
  );
}
