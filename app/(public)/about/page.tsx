import { Button } from "@/components/ui/button";
import { Heart, MapPin, Search, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-primary py-16 text-center text-primary-foreground sm:py-20">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            Gensan Buy & Sell Cars
          </h1>
          <p className="mx-auto max-w-2xl text-base opacity-90 sm:text-lg">
            A trusted, Gensan-exclusive platform for buying and selling used cars.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto max-w-7xl px-3 py-12 sm:px-4">
        <h2 className="mb-6 text-2xl font-bold">Our Story</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            GBNSC was born out of frustration. Like many GenSan residents, our
            founders experienced the pain of searching through Facebook groups
            filled with spam, fake listings, and unverified sellers. After
            losing money to scams and wasting weekends chasing unreliable leads,
            we decided to build something better.
          </p>
          <p>
            Our mission is simple: make buying and selling cars in General Santos
            City safe, transparent, and scam-free. We verify every seller,
            check LTO documents, and partner with local mechanics to ensure
            every car listed on our platform is legit.
          </p>
        </div>
      </section>

      {/* Why buy your car with us? */}
      <section className="container mx-auto max-w-7xl px-3 py-12 sm:px-4">
        <h2 className="mb-6 text-2xl font-bold">Why buy your car with us?</h2>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-6">
            <MapPin className="mb-3 size-6 text-primary" />
            <h3 className="mb-2 font-bold">Gensan-Exclusive Focus</h3>
            <p className="text-muted-foreground">
              No national markups. Local pricing from local sellers. Easy test
              drives at convenient GenSan locations like SM Gensan.
            </p>
          </div>
          <div className="rounded-lg bg-muted p-6">
            <Users className="mb-3 size-6 text-primary" />
            <h3 className="mb-2 font-bold">Community-Driven</h3>
            <p className="text-muted-foreground">
              Built for the GenSan community. We import trusted members from
              established local Facebook buy & sell groups.
            </p>
          </div>
          <div className="rounded-lg bg-muted p-6">
            <Heart className="mb-3 size-6 text-primary" />
            <h3 className="mb-2 font-bold">Family-Friendly</h3>
            <p className="text-muted-foreground">
              We understand GenSan families need practical, fuel-efficient, and
              safe cars. Our filters help you find the right fit.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="container mx-auto max-w-7xl px-3 py-12 sm:px-4">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold sm:text-4xl">200+</p>
            <p className="text-sm text-muted-foreground sm:text-base">
              Cars Listed
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold sm:text-4xl">50+</p>
            <p className="text-sm text-muted-foreground sm:text-base">
              Verified Sellers
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold sm:text-4xl">0</p>
            <p className="text-sm text-muted-foreground sm:text-base">
              Scam Reports
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-center text-primary-foreground sm:py-20">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
            Ready to buy your next car in Gensan?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base opacity-90 sm:text-lg">
            Find verified, local listings, from family-friendly sedans to
            practical SUVs right here in General Santos City. Clear filters,
            fair prices, and direct contact with sellers make it easier to find
            the right car for you.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link href="/cars" className="flex items-center gap-2">
              <Search className="size-5" />
              Find your car now
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
