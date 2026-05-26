"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Menu, User, KeyRound, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BREADCRUMB_LABELS } from "./nav-config";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TopBarProps {
  role: UserRole;
  onMenuClick: () => void;
  notificationCount?: number;
}

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  let path = "";
  for (const segment of segments) {
    path += `/${segment}`;
    const label =
      BREADCRUMB_LABELS[segment] ??
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    crumbs.push({ label, href: path });
  }

  return crumbs;
}

export function TopBar({
  role,
  onMenuClick,
  notificationCount = 3,
}: TopBarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const breadcrumbs = buildBreadcrumbs(pathname);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200/60 bg-[rgba(248,250,255,0.85)] px-4 backdrop-blur-md lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <nav
          aria-label="Breadcrumb"
          className="hidden min-w-0 items-center gap-1 text-sm sm:flex"
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={crumb.href} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                )}
                {isLast ? (
                  <span className="truncate font-medium text-navy-900">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="truncate text-muted-foreground hover:text-brand"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>

        {/* Mobile: show current page only */}
        <span className="truncate font-medium text-navy-900 sm:hidden">
          {breadcrumbs[breadcrumbs.length - 1]?.label ?? "Dashboard"}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-600 hover:text-navy-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span
              className={cn(
                "absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center",
                "rounded-full bg-danger px-1 text-[10px] font-bold text-white"
              )}
            >
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full p-0"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-brand text-xs text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={
                  role === "admin" ? "/admin/dashboard" : "/partner/dashboard"
                }
                className="flex cursor-pointer items-center gap-2"
              >
                <User className="h-4 w-4" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={
                  role === "admin"
                    ? "/admin/settings/password"
                    : "/partner/settings/password"
                }
                className="flex cursor-pointer items-center gap-2"
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="flex cursor-pointer items-center gap-2 text-danger focus:text-danger"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
