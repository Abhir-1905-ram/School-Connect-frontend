"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, isAdmin } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    router.replace(isAdmin ? "/admin/dashboard" : "/partner/dashboard");
  }, [user, isLoading, isAdmin, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
    </div>
  );
}
