import { FeaturedListings } from "@/components/FeaturedListings";
import { CTASection } from "@/components/home/CTASection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyBuyFromUs } from "@/components/home/WhyBuyFromUs";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <section className=" py-12">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          <FeaturedListings />
        </div>
      </section>
      <section className="bg-muted py-12">
        <HowItWorks />
      </section>
      <section className=" py-12">
        <WhyBuyFromUs />
      </section>
      <CTASection />
    </main>
  );
}
