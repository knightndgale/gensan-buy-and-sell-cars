"use client";

import { SellerNav } from "@/components/SellerNav";
import { usePathname } from "next/navigation";

export function SellerNavWrapper() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/seller/login";

  if (isLoginPage) return null;
  return <SellerNav />;
}
