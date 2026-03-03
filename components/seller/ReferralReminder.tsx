import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function ReferralReminder() {
  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">
          All sales from platform leads are subject to referral fees. Referral Fee: 1% for cars up to
          P400k, P5,000 for cars above P500k.
        </p>
        <Link
          href="/seller/referral-agreement"
          className="mt-2 inline-block text-sm font-medium text-amber-800 hover:underline dark:text-amber-200"
        >
          View Referral Agreement →
        </Link>
      </CardContent>
    </Card>
  );
}
