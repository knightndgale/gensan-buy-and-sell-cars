import { Header } from "@/components/Header";
import { FeaturedListings } from "@/components/FeaturedListings";
import { TrustLinks } from "@/components/TrustLinks";
import { HeroBanner } from "@/components/HeroBanner";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto max-w-7xl px-3 py-8 sm:px-4">
        <FeaturedListings />
        <TrustLinks />
        <HeroBanner />
      </main>
    </div>
  );
}
