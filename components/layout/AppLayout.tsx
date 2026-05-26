"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileBottomNav } from "./MobileBottomNav";
import { NavigationProgress } from "./NavigationProgress";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import type { UserRole } from "@/lib/types";

interface AppLayoutProps {
  role: UserRole;
  children: React.ReactNode;
}

export function AppLayout({ role, children }: AppLayoutProps) {
  const { isLoading, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden h-full shrink-0 lg:block">
        <Sidebar
          role={role}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[260px] max-w-[85vw] border-0 p-0 text-white [&>button]:text-white"
          style={{
            background:
              "linear-gradient(180deg, #0D1117 0%, #0F172A 40%, #0D1117 100%)",
          }}
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <Sidebar
            role={role}
            collapsed={false}
            onToggleCollapse={() => setMobileOpen(false)}
            onNavigate={() => setMobileOpen(false)}
            showCollapseToggle={false}
            className="h-full w-[260px]"
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <NavigationProgress />
        <TopBar role={role} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      <MobileBottomNav role={role} />
    </div>
  );
}
