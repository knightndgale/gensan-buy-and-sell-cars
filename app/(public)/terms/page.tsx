import Link from "next/link";

export default function TermsPage() {
  return (
    <main>
      <section className="container mx-auto max-w-3xl px-3 py-12 sm:px-4">
        <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">
          This page will contain the terms of service for Gensan Buy and Sell
          Cars. Content to be added.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-primary hover:underline"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
