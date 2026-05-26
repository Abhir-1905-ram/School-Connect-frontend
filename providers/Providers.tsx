"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { createQueryClient } from "@/lib/queryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1E293B",
              color: "#F8FAFC",
              fontFamily: "var(--font-body)",
            },
            success: { iconTheme: { primary: "#10B981", secondary: "#F8FAFC" } },
            error: { iconTheme: { primary: "#F43F5E", secondary: "#F8FAFC" } },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
