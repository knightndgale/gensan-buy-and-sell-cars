import { SellerNavWrapper } from "@/components/SellerNavWrapper";

export default function AdminNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SellerNavWrapper />
      {children}
    </div>
  );
}
