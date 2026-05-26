"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getNavItems } from "./nav-config";
import type { UserRole } from "@/lib/types";

interface MobileBottomNavProps {
  role: UserRole;
}

export function MobileBottomNav({ role }: MobileBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = getNavItems(role);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex h-16 items-stretch justify-around">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onMouseEnter={() => router.prefetch(item.href)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-colors",
                isActive ? "text-brand" : "text-slate-500 hover:text-brand"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
              <span className="max-w-[4.5rem] truncate">
                {item.label.replace(/^My /, "")}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
