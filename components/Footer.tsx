import { FooterPopularMakes } from "@/components/FooterPopularMakes";
import { getCarMakes } from "@/lib/firestore/cars";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Cars", href: "/cars" },
  { label: "About Us", href: "/about" },
  { label: "Sellers Portal", href: "/seller" },
];

const FACEBOOK_URL = "https://facebook.com";

export async function Footer() {
  const makes = await getCarMakes();

  return (
    <footer className="mt-auto border-t">
      {/* Main content area */}
      <div className="bg-muted">
        <div className="container mx-auto max-w-7xl px-3 py-10 sm:px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            {/* Brand section */}
            <div className="space-y-3">
              <div className="flex justify-start">
                <Link href="/" className="block">
                  <Image src="/images/logo-full-vectorized.webp" alt="Gensan Buy and Sell Cars" width={220} height={71} className="object-contain" />
                </Link>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-base">
                General Santos City&apos;s trusted platform for buying and selling cars, verified sellers, no scams.
              </p>
            </div>

            {/* Quick Links + Popular Makes: 2 columns on mobile, separate columns on sm+ */}
            <div className="grid grid-cols-2 gap-6 sm:contents">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground sm:text-base">Quick Links</h3>
                <ul className="space-y-3 text-xs text-foreground sm:text-base">
                  {NAV_LINKS.map(({ label, href }) => (
                    <li key={href}>
                      <Link href={href} className="hover:text-primary hover:underline">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <FooterPopularMakes makes={makes} />
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground sm:text-base">Contact Us</h3>
              <ul className="space-y-4 text-xs text-foreground sm:text-base">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" />
                  <span>General Santos City, South Cotabato, Philippines</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" />
                  <a href="tel:+63835550123" className="hover:text-primary hover:underline">
                    (083) 555-0123
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" />
                  <a href="mailto:hello@gbsc.ph" className="hover:text-primary hover:underline">
                    hello@gbsc.ph
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Facebook className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" />
                  <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                    GBSC Official
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
       <div className="bg-primary border-t border-primary px-4 py-4 sm:px-[120px] sm:py-[32px]">
  <div className="container mx-auto max-w-7xl flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
    {/* Copyright */}
    <p className="text-xs sm:text-sm text-primary-foreground text-center sm:text-left">
      © 2026 GCBNS. <span className="font-semibold">All rights reserved.</span>
    </p>

    {/* Links */}
    <div className="flex flex-row items-center gap-2 text-xs sm:text-sm">
      <Link href="/privacy" className="hover:underline text-primary-foreground">
        Privacy Policy
      </Link>
      <span className="text-primary-foreground">|</span>
      <Link href="/terms" className="hover:underline text-primary-foreground">
        Terms of Service
      </Link>
    </div>
  </div>
</div>
    </footer>
  );
}
