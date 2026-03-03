import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ReferralAgreementPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Referral Agreement</h1>
      <div className="prose prose-sm dark:prose-invert">
        <p>
          All sales from platform leads are subject to referral fees. Referral Fee: 1% for cars up to
          P400k, P5,000 for cars above P500k.
        </p>
        <p>
          By listing vehicles on Gensan Car Buy & Sell, you agree to these terms. Contact support
          for the full agreement document.
        </p>
      </div>
      <Button asChild className="mt-6">
        <Link href="/seller">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
