import { Check } from "lucide-react";

const STEPS = [
  {
    title: "Browse Cars",
    description: "Search with advanced filters for brand, model, price, airbags, and fuel economy.  ",
  },
  {
    title: "Contact Seller",
    description: "Leave your contact info, or contact us directly for a fast and reliable transaction.",
  },
  {
    title: "Test Drive",
    description: "Schedule a test drive at SM Gensan or any convenient GenSan location.",
  },
  {
    title: "Own the Car",
    description: "Check the documents, complete the transaction and drive your new car home with ease.",
  },
];

export function HowItWorks() {
  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4">
      <div className="mb-8 flex items-center gap-2">
        <Check className="size-4 sm:size-5 text-primary" />
        <h2 className="text-md sm:text-2xl font-semibold uppercase tracking-wide text-primary">How It Works</h2>
      </div>
      <p className="mb-2 text-sm font-bold text-foreground sm:text-lg">Own the car you want in just 4 simple steps</p>
      <p className="mb-10 text-xs sm:text-base text-muted-foreground">
        Making the buying process fast, easy, and predictable for buyers.
      </p>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <div key={step.title} className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm">
            <div className="mb-4 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground sm:text-lg">
              {i + 1}
            </div>
            <h3 className="mb-2 text-sm font-semibold text-foreground sm:text-base">{step.title}</h3>
            <p className="text-xs sm:text-base text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
