import { Button } from "@/components/ui/button";
import { Info, Search } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-primary py-16 text-center text-primary-foreground">
      <div className="container mx-auto max-w-3xl px-3 sm:px-4">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to buy your next car in Gensan?</h2>
        <p className="mb-8 text-lg opacity-90">
          Find verified, local listings—from family-friendly sedans to practical SUVs right here in General Santos
          City. Clear filters, fair prices, and direct contact with sellers make it easier to find the right car for
          you.
        </p>
        <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
          <Link href="/cars">
            <Search className="size-5" />
            Find your car now
          </Link>
        </Button>
        <p className="mt-6">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white hover:underline"
          >
            <Info className="size-4" />
            About the platform
          </Link>
        </p>
      </div>
    </section>
  );
}
