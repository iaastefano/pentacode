"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

function AdminGuard({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();

  const isLoginPage = pathname?.includes("/admin/login");

  if (isLoginPage) return <>{children}</>;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      window.location.href = "/es/admin/login";
    }
    return null;
  }

  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AdminGuard>{children}</AdminGuard>
    </SessionProvider>
  );
}
