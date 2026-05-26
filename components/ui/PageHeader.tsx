import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PageHeaderAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  className?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  action?: PageHeaderAction;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  action,
  className,
}: PageHeaderProps) {
  const Icon = action?.icon;

  return (
    <div
      className={cn(
        "mb-6 border-b border-transparent pb-5",
        "bg-gradient-to-r from-indigo-500/5 to-transparent",
        className
      )}
      style={{
        borderImage:
          "linear-gradient(to right, rgba(99,102,241,0.2), transparent) 1",
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="border-b border-indigo-500/20 pb-4 sm:border-0 sm:pb-0">
          {breadcrumb && (
            <p className="mb-1 text-xs text-slate-400">{breadcrumb}</p>
          )}
          <h1 className="font-heading text-2xl font-bold text-navy-900 md:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
        {action &&
          (action.href ? (
            <Button
              asChild
              className={cn(
                "shrink-0 bg-gradient-to-r from-brand to-brand-light",
                action.className
              )}
            >
              <Link href={action.href}>
                {Icon && <Icon className="mr-1.5 h-4 w-4" />}
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button
              onClick={action.onClick}
              className={cn(
                "shrink-0 bg-gradient-to-r from-brand to-brand-light",
                action.className
              )}
            >
              {Icon && <Icon className="mr-1.5 h-4 w-4" />}
              {action.label}
            </Button>
          ))}
      </div>
    </div>
  );
}
