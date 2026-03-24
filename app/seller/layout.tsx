import { SellerNavWrapper } from "@/components/SellerNavWrapper";
import { getSessionToken } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const session = await getSessionToken(headersList.get("cookie"));

  // Do not redirect unauthenticated users here because this layout also wraps
  // /seller/login. Unauthenticated route protection is handled in proxy.ts.
  if (session && session.role !== "seller") {
    redirect("/403");
  }

  return (
    <div className="min-h-screen">
      <SellerNavWrapper />
      {children}
    </div>
  );
}
