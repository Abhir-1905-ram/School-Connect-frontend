"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getNavItems } from "./nav-config";
import type { UserRole } from "@/lib/types";

interface SidebarProps {
  role: UserRole;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
  className?: string;
  showCollapseToggle?: boolean;
}

export function Sidebar({
  role,
  collapsed,
  onToggleCollapse,
  onNavigate,
  className,
  showCollapseToggle = true,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const navItems = getNavItems(role);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "relative flex h-full flex-col overflow-hidden border-r border-indigo-500/15 text-slate-300",
        className
      )}
      style={{
        background:
          "linear-gradient(180deg, #0D1117 0%, #0F172A 40%, #0D1117 100%)",
      }}
    >
      {/* Logo + collapse toggle */}
      <div className="relative flex h-16 shrink-0 items-center border-b border-white/10 px-3">
        <Link
          href={role === "admin" ? "/admin/dashboard" : "/partner/dashboard"}
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center overflow-hidden pr-8"
        >
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="truncate bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text font-heading text-sm font-bold text-transparent"
            >
              School Connect
            </motion.span>
          )}
        </Link>
        {showCollapseToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2 py-4">
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
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex h-[42px] items-center gap-3 rounded-[10px] px-3 text-sm font-medium transition-all duration-150",
                "border-l-[3px] border-transparent",
                isActive
                  ? "border-l-indigo-400 text-white"
                  : "text-slate-400 hover:border-l-indigo-500/50 hover:bg-indigo-500/10 hover:text-white"
              )}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(90deg, rgba(79,70,229,0.25) 0%, rgba(79,70,229,0.05) 100%)",
                      boxShadow: "inset -1px 0 8px rgba(99,102,241,0.1)",
                    }
                  : undefined
              }
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive ? "text-indigo-300" : "text-slate-400 group-hover:text-indigo-400"
                )}
              />
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="shrink-0 border-t border-white/[0.06] p-3">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "flex-col justify-center"
          )}
        >
          <Avatar className="h-9 w-9 shrink-0 ring-2 ring-indigo-500/30">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-[13px] font-semibold text-white">
                {user?.name}
              </p>
              <span className="mt-0.5 inline-block rounded px-1.5 py-0.5 font-heading text-[10px] font-semibold uppercase tracking-wider text-indigo-300"
                style={{ background: "rgba(99,102,241,0.2)" }}
              >
                {role}
              </span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={logout}
          className={cn(
            "mt-2 w-full text-slate-400 transition-colors hover:bg-white/10 hover:text-rose-400",
            collapsed && "h-9 w-9"
          )}
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </motion.aside>
  );
}
