import { Car, DollarSign, Heart, MessageSquare } from "lucide-react";

const BENEFITS = [
  {
    icon: Car,
    description: "Affordable, fuel-efficient cars (like reliable 1.5-L sedans)",
  },
  {
    icon: DollarSign,
    description: "Clear pricing that matches local Gensan conditions and mileage",
  },
  {
    icon: MessageSquare,
    description: "Direct, honest communication with local owners",
  },
];

export function WhyBuyFromUs() {
  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 ">
      <div className="mb-8 flex items-center gap-2">
        <Heart className="size-6 text-primary" />
        <h2 className="text-2xl font-bold uppercase tracking-wide text-primary">Why Buy From Us</h2>
      </div>
      <p className="mb-2 text-lg font-semibold text-foreground">Built for Gensan buyers like you</p>
      <p className="mb-10 text-muted-foreground">Our platform is designed for families, small business owners, and everyday drivers who value:</p>

      <div className="grid gap-6 sm:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, description }) => (
          <div key={description} className="flex flex-row items-start gap-4 rounded-xl border border-border bg-white p-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-6" />
            </div>
            <p className="text-sm text-foreground">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-white p-6">
        <p className="text-sm text-foreground">If you&apos;ve ever lost time or money on sketchy Facebook deals, this is your local alternative, safe, transparent, and built specifically for you.</p>
      </div>
    </div>
  );
}
