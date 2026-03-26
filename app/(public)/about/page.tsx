import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, MapPin, Search, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-primary py-16 text-left text-primary-foreground sm:py-20">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">Buy and Sell Cars in General Santos City</h1>
          <p className=" max-w-4xl text-base opacity-90 sm:text-lg">
            Discover quality cars from trusted sellers in General Santos City and nearby areas such as South Cotabato, Sarangani, and Davao City. Our platform helps buyers easily connect with reliable
            listings—so finding the right car feels simple and secure.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <article className="container mx-auto max-w-7xl px-3 py-12 sm:px-4 text-center">
        <h2 className="mb-6 text-2xl font-bold">Our Story</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            GBNSC was created to make buying and selling cars in General Santos City easier and more reliable. Like many people in GenSan, we noticed that searching for cars online often meant
            browsing through scattered listings, uncertain sellers, and incomplete information.{" "}
          </p>
          <p>
            So we built a platform focused on <b>clarity, trust, and local connection. </b>
          </p>
          <p>
            Our goal is simple: to help car buyers and sellers in General Santos City connect in a safer and more transparent way. We work to verify sellers, check important documents, and collaborate
            with local mechanics so that every listing on our platform gives buyers greater peace of mind.
          </p>
          <p>
            Whether you're looking for your next vehicle or planning to sell one, GBNSC aims to make the process <b> simpler, safer, and more convenient for the GenSan community.</b>
          </p>
        </div>
      </article>

      <section className="container mx-auto max-w-7xl px-3 py-12 sm:px-4 text-center">
        <Separator />
      </section>

      {/* Why buy your car with us? */}
      <section className="container mx-auto max-w-7xl px-3 py-12 sm:px-4">
        <h2 className="mb-8 text-center text-2xl font-bold">Why buy your car with us?</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-lg bg-muted p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <MapPin className="size-6 text-primary" />
              <h3 className="font-bold">Gensan-Exclusive Focus</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">No national markups. Local pricing from local sellers. Easy test drives at convenient GenSan locations like SM Gensan.</p>
          </div>
          <div className="rounded-lg bg-muted p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Users className="size-6 text-primary" />
              <h3 className="font-bold">Community-Driven</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Built for the GenSan community. We import trusted members from established local Facebook buy & sell groups.</p>
          </div>
          <div className="rounded-lg bg-muted p-5 sm:p-6 sm:col-span-2 sm:max-w-lg sm:justify-self-center md:col-span-1 md:max-w-none md:justify-self-stretch">
            <div className="flex items-center gap-3">
              <Heart className="size-6 text-primary" />
              <h3 className="font-bold">Family-Friendly</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">We understand GenSan families need practical, fuel-efficient, and safe cars. Our filters help you find the right fit.</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-3 sm:px-4 text-center">
        <Separator />
      </section>

      {/* Statistics */}
      <section className="container mx-auto max-w-4xl px-3 py-12 sm:px-4">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold sm:text-4xl text-primary">200+</p>
            <p className="text-sm text-muted-foreground sm:text-base">Cars Listed</p>
          </div>
          <div>
            <p className="text-3xl font-bold sm:text-4xl text-primary">50+</p>
            <p className="text-sm text-muted-foreground sm:text-base">Verified Sellers</p>
          </div>
          <div>
            <p className="text-3xl font-bold sm:text-4xl text-primary">0</p>
            <p className="text-sm text-muted-foreground sm:text-base">Scam Reports</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-center text-primary-foreground sm:py-20">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">Ready to buy your next car in Gensan?</h2>
          <p className="mx-auto mb-8 max-w-7lg text-base opacity-90 sm:text-lg">
            Find verified, local listings, from family-friendly sedans to practical SUVs right here in General Santos City. Clear filters, fair prices, and direct contact with sellers make it easier
            to find the right car for you.
          </p>
          <Button asChild size="lg" className="rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-primary shadow-sm hover:bg-white/90 sm:px-4 sm:py-3 sm:text-base">
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
