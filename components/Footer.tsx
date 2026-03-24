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
          <div className="grid gap-8 sm:grid-cols-4 lg:grid-cols-4">
            {/* Brand section */}
            <div className="space-y-3">
              <div className="flex justify-start">
                <Link href="/" className="block">
                  <Image src="/images/logo-upscale.png" alt="Gensan Buy and Sell Cars" width={340} height={130} className="w-auto object-contain" />
                </Link>
              </div>
              <p>General Santos City&apos;s trusted platform for buying and selling cars, verified sellers, no scams.</p>
            </div>

            {/* Quick Links + Popular Makes: 2 columns on mobile, separate columns on sm+ */}
            <div className="grid grid-cols-2 gap-8 sm:contents">
              <div>
                <h3 className="mb-3 font-semibold uppercase text-foreground">Quick Links</h3>
                <ul className="space-y-3">
                  {NAV_LINKS.map(({ label, href }) => (
                    <li key={href}>
                      <Link href={href} className=" hover:text-primary hover:underline">
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
              <h3 className="mb-3 font-semibold uppercase text-foreground">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>General Santos City, South Cotabato, Philippines</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
                  <a href="tel:+63835550123" className="   hover:text-primary hover:underline">
                    (083) 555-0123
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
                  <a href="mailto:hello@gbsc.ph" className=" hover:text-primary hover:underline">
                    hello@gbsc.ph
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Facebook className="mt-0.5 size-5 shrink-0 text-primary" />
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
       <div className="bg-primary border-t border-primary px-[120px] py-[32px] flex justify-between text-sm text-primary-foreground">
   <div className="container mx-auto max-w-7xl px-3 sm:px-4 flex items-center justify-between">
     <p className="w-[232px] h-[16px] font-['Open_Sans'] font-normal text-[14px] leading-[16px] tracking-[0px] text-center">
     © 2026 GCBNS.{" "}
     <span className="font-semibold">All rights reserved.</span>
     </p>
     <div className="flex items-center gap-3">
       <Link href="/privacy" className="hover:underline w-[88px] h-[16px] font-['Open_Sans'] font-normal text-[14px] leading-[16px] tracking-[0px]">Privacy Policy</Link>
       <hr className="w-[21px] border-t border-primary-foreground rotate-[-90deg]" />
       <Link href="/terms" className="hover:underline w-[108px] h-[16px] font-['Open_Sans'] font-normal text-[14px] leading-[16px] tracking-[0px]">Terms of Service</Link>
     </div>
   </div>
 </div>
    </footer>
  );
}
