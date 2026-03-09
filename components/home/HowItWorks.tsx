import { Check } from "lucide-react";

const STEPS = [
  {
    title: "Browse Cars",
    description: "Search through verified listings from local sellers. Filter by make, model, price, and more.",
  },
  {
    title: "Contact Seller",
    description: "Reach out directly to sellers. No middlemen, no hidden fees—just clear communication.",
  },
  {
    title: "Test Drive",
    description: "Schedule a test drive at your convenience. See the car in person before you decide.",
  },
  {
    title: "Own the Car",
    description: "Complete the deal with confidence. We help make the process fast, easy, and predictable.",
  },
];

export function HowItWorks() {
  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4">
      <div className="mb-8 flex items-center gap-2">
        <Check className="size-6 text-primary" />
        <h2 className="text-2xl font-bold uppercase tracking-wide text-foreground">How It Works</h2>
      </div>
      <p className="mb-2 text-lg font-semibold text-foreground">Own the car you want in just 4 simple steps</p>
      <p className="mb-10 text-muted-foreground">Making the buying process fast, easy, and predictable for buyers.</p>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <div key={step.title} className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm">
            <div className="mb-4 flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">{i + 1}</div>
            <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
