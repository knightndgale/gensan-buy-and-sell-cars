import { Button } from "@/components/ui/button";
import { Info, Search } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";

export function CTASection() {
  return (
    <section className="w-full bg-primary py-16">
      <div className="container mx-auto flex flex-col items-center px-7 sm:px-6">
        <div className="flex w-full max-w-6xl flex-col items-center text-center text-primary-foreground">
          <h2 className="mb-4 text-lg font-bold tracking-wide sm:text-2xl">Ready to buy your next car in Gensan?</h2>
          <p className="mb-8 text-md leading-relaxed text-primary-foreground/90 sm:text-lg">
            Find verified, local listings—from family-friendly sedans to practical SUVs right here in General Santos City. Clear filters, fair prices, and direct contact with sellers make it easier to
            find the right car for you.
          </p>
          <Button asChild size="lg" className="font-semibold rounded-lg bg-white p-6 text-sm text-primary hover:bg-white/90 sm:text-base">
            <Link href="/cars" className="inline-flex items-center gap-2">
              <Search className="size-4 sm:size-5" />
              Find your car now
            </Link>
          </Button>

          <div className="md:max-w-xl lg:max-w-2xl ">
            <div className="my-6 w-full self-center">
              <Separator className="bg-white/80" />
            </div>
            <p className="mb-8 text-md leading-relaxed text-primary-foreground/90 sm:text-lg">
              If you&apos;re still exploring your options, you can also learn more about how Gensan Buy & Sell Cars keeps buyers safe
            </p>
            <Link href="/about" className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-white/90 hover:text-white hover:underline">
              <Info className="size-4 sm:size-5" />
              About the platform
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
