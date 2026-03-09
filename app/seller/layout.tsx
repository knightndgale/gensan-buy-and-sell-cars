import { SellerNavWrapper } from "@/components/SellerNavWrapper";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted">
      <SellerNavWrapper />
      {children}
    </div>
  );
}
