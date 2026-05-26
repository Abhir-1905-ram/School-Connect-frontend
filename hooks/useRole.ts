"use client";

import { useAuth } from "@/context/AuthContext";

export function useRole() {
  const { user, isAdmin, isPartner, isLoading } = useAuth();

  return {
    user,
    isAdmin,
    isPartner,
    isLoading,
    role: user?.role ?? null,
  };
}
