"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

type AuthUser = { uid: string; email: string | null } | null;

const AuthContext = createContext<{
  user: AuthUser;
  loading: boolean;
  /** @param redirect - Where to go after sign-in. Pass false to skip redirect (e.g. for role verification). Defaults to /seller. */
  signIn: (email: string, password: string, redirect?: string | false) => Promise<void>;
  /** @param skipRedirect - When true, clear session but stay on page (e.g. to show error). Defaults to false. */
  signOut: (skipRedirect?: boolean) => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ? { uid: u.uid, email: u.email ?? null } : null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string, redirect?: string | false) => {
    if (!auth) throw new Error("Auth not initialized");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    });
    if (redirect !== false) {
      window.location.href = redirect ?? "/seller";
    }
  };

  const signOut = async (skipRedirect?: boolean) => {
    await fetch("/api/auth/session", { method: "DELETE" });
    if (auth) await firebaseSignOut(auth);
    if (!skipRedirect) {
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
