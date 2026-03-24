import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Info, Search } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-primary py-16 text-center text-primary-foreground">
      <div className="container mx-auto max-w-3xl px-7 sm:px-6">
        <h2 className="mb-4 text-lg font-bold tracking-wide text-primary-foreground sm:text-2xl">Ready to buy your next car in Gensan?</h2>
        <p className="mb-8 text-md leading-relaxed text-primary-foreground/90 sm:text-lg">
          Find verified, local listings—from family-friendly sedans to practical SUVs right here in General Santos City. Clear filters, fair prices, and direct contact with sellers make it easier to
          find the right car for you.
        </p>
        <Button asChild size="lg" className="font-semibold p-6 rounded-lg bg-white text-sm text-primary hover:bg-white/90 sm:text-base">
          <Link href="/cars">
            <Search className="size-4 sm:size-5" />
            Find your car now
          </Link>
        </Button>
        <Separator className="my-6 bg-white/80" />
        <p className="mb-8 text-md leading-relaxed text-primary-foreground/90 sm:text-lg">
          If you're still exploring your options, you can also learn more about how Gensan Buy & Sell Cars keeps buyers safe
        </p>
        <p className="mt-6">
          <Link href="/about" className="font-semibold inline-flex items-center gap-2 text-base text-white/90 hover:text-white hover:underline">
            <Info className="size-4 sm:size-5" />
            About the platform
          </Link>
        </p>
      </div>
    </section>
  );
}
