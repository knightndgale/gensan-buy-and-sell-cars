import Link from "next/link";
import { Check, TrendingUp, CreditCard } from "lucide-react";

const links = [
  { label: "Verified Sellers", href: "/verify", icon: Check },
  { label: "Car Buying Tips", href: "/tips", icon: TrendingUp },
  { label: "Financing Options", href: "/financing", icon: CreditCard },
];

export function TrustLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-6 sm:gap-6 sm:py-8">
      {links.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <Icon className="size-5" />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
}
