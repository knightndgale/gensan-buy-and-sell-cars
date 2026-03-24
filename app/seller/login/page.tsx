"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/seller";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password, false);
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok || data.role !== "seller") {
        await signOut(true);
        setError("Seller access only. This account does not have seller privileges.");
        return;
      }
      toast.success("Login successful.");
      router.push(redirect);
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Sellers Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your car listings on GBSC</p>
        </div>

        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-3">
                  <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="pl-10 bg-muted border-0 py-[22px] shadow-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-3">
                  <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="px-10 py-[22px] bg-muted border-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full py-[22px] rounded-[14px]" disabled={loading}>
                {loading ? "Signing in..." : "Log In"}
                {!loading && <ArrowRight className="size-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-4 px-4 py-6 ">
        <Link href="/" className="block">
          <Image src="/images/logo-full-vectorized.webp" alt="Gensan Buy and Sell Cars" width={220} height={71} className="object-contain" />
        </Link>

        <p className="flex items-center gap-1  text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0" />
          Your data is safe and encrypted
        </p>
      </footer>
    </div>
  );
}

export default function SellerLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
