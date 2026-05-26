import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-300/40">
        <GraduationCap className="h-9 w-9" />
      </div>
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
        School Connect
      </p>
      <h1 className="mt-2 font-heading text-4xl font-bold text-navy-900">404</h1>
      <p className="mt-2 max-w-md text-slate-600">
        This page could not be found. It may have been moved or you followed an
        outdated link.
      </p>
      <Button
        asChild
        className="mt-8 bg-gradient-to-r from-brand to-brand-light"
      >
        <Link href="/login">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
