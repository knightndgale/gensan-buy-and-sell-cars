import Image from "next/image";
import Link from "next/link";

export default function AdminNav({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="flex flex-wrap items-center justify-between gap-4 border-b bg-background py-3">
        <div className="container mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-3 sm:px-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/" className="shrink-0">
              <Image src="/images/logo-main.webp" alt="Gensan Buy and Sell Cars" width={180} height={60} className="h-10 w-auto object-contain sm:h-12" priority />
            </Link>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">Admin</span>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
