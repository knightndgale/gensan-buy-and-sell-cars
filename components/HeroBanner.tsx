import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-linear-to-br from-primary/90 to-primary py-12 text-primary-foreground sm:py-16 md:py-20">
      <div className="container relative z-10 mx-auto grid items-center px-4 md:gap-12">
        <div className=" flex flex-col items-center text-center  ">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">Find Your Next Car</h2>
          <p className="mb-2 text-base opacity-90 sm:text-lg">200+ Listings</p>
          <p className="mb-8 text-base opacity-90 sm:text-lg">100% Verified Dealers</p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link href="/cars">Browse Cars</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
