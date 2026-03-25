"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

type UnsavedListingNavigationContextValue = {
  setHasUnsavedChanges: (value: boolean) => void;
  confirmIfUnsaved: (action: () => void) => void;
  requestNavigate: (href: string) => void;
  beginUnsavedBypass: () => void;
};

const UnsavedListingNavigationContext = createContext<UnsavedListingNavigationContextValue | null>(null);

export function UnsavedListingNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const bypassRef = useRef(false);

  const beginUnsavedBypass = useCallback(() => {
    bypassRef.current = true;
    window.setTimeout(() => {
      bypassRef.current = false;
    }, 1500);
  }, []);

  const setHasUnsavedChanges = useCallback((value: boolean) => {
    if (bypassRef.current && value) return;
    setHasUnsaved(value);
  }, []);

  const confirmIfUnsaved = useCallback(
    (action: () => void) => {
      if (hasUnsaved) {
        setPendingAction(() => action);
        setLeaveDialogOpen(true);
      } else {
        action();
      }
    },
    [hasUnsaved],
  );

  const requestNavigate = useCallback(
    (href: string) => {
      confirmIfUnsaved(() => {
        router.push(href);
      });
    },
    [confirmIfUnsaved, router],
  );

  const handleLeave = useCallback(() => {
    bypassRef.current = true;
    setHasUnsaved(false);
    setLeaveDialogOpen(false);
    const fn = pendingAction;
    setPendingAction(null);
    window.setTimeout(() => {
      bypassRef.current = false;
    }, 1500);
    fn?.();
  }, [pendingAction]);

  const handleStay = useCallback(() => {
    setLeaveDialogOpen(false);
    setPendingAction(null);
  }, []);

  const value = useMemo(
    () => ({
      setHasUnsavedChanges,
      confirmIfUnsaved,
      requestNavigate,
      beginUnsavedBypass,
    }),
    [setHasUnsavedChanges, confirmIfUnsaved, requestNavigate, beginUnsavedBypass],
  );

  return (
    <UnsavedListingNavigationContext.Provider value={value}>
      {children}
      <AlertDialog
        open={leaveDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleStay();
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
            <AlertDialogDescription>You have unsaved changes. If you leave now, your changes will be lost.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleStay}>Stay</AlertDialogAction>
            <AlertDialogCancel onClick={handleLeave}>Leave</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </UnsavedListingNavigationContext.Provider>
  );
}

export function useUnsavedListingNavigation() {
  const ctx = useContext(UnsavedListingNavigationContext);
  if (!ctx) {
    throw new Error("useUnsavedListingNavigation must be used within UnsavedListingNavigationProvider");
  }
  return ctx;
}
