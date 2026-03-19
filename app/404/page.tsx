import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-muted px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(127,29,29,0.12),transparent_55%)]" />

      <main className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-destructive">Error status</p>
        <h1 className="mt-3 text-7xl font-black leading-none  sm:text-8xl md:text-9xl">404</h1>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Page not found</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          The page you are looking for does not exist or may have been moved. Please check the URL or return to a known page.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
