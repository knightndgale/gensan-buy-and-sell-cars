import Link from "next/link";
import { getCarMakes } from "@/lib/firestore/cars";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Cars", href: "/cars" },
  { label: "Seller Login", href: "/seller/login" },
  { label: "Verified Sellers", href: "/verify" },
  { label: "Car Buying Tips", href: "/tips" },
  { label: "Financing Options", href: "/financing" },
];

export async function Footer() {
  const makes = await getCarMakes();

  return (
    <footer className="mt-auto border-t bg-muted/50">
      <div className="container mx-auto max-w-7xl px-3 py-10 sm:px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand section */}
          <div className="space-y-3">
            <Link
              href="/"
              className="text-base font-bold sm:text-xl hover:text-primary"
            >
              Gensan Car Buy & Sell
            </Link>
            <p className="text-sm text-muted-foreground">
              General Santos City&apos;s trusted platform for buying and selling
              cars, verified sellers, no scams.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse by Make */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Browse by Make</h3>
            <ul className="flex flex-wrap gap-x-3 gap-y-2">
              {makes.map((make) => (
                <li key={make.id}>
                  <Link
                    href={`/cars?make=${make.id}`}
                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                  >
                    {make.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Contact Us</h3>
            <p className="text-sm text-muted-foreground">
              Have questions? Reach us at contact@gensancar.com or call (083)
              123-4567.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
