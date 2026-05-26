"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { convertLeadToClient } from "@/lib/api/leads";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfettiBurst } from "@/components/ui/ConfettiBurst";
import { formatINR } from "@/components/ui/IndianCurrency";
import type { Lead } from "@/lib/types";

interface ConvertLeadDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConvertLeadDialog({
  lead,
  open,
  onOpenChange,
}: ConvertLeadDialogProps) {
  const queryClient = useQueryClient();
  const [showConfetti, setShowConfetti] = useState(false);

  const mutation = useMutation({
    mutationFn: () => convertLeadToClient(lead!._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["partner-leads"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["partner-clients"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setShowConfetti(true);
      toast.success("School successfully converted to client!", {
        duration: 5000,
      });
      setTimeout(() => {
        setShowConfetti(false);
        onOpenChange(false);
      }, 1800);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to convert lead";
      toast.error(message);
    },
  });

  if (!lead) return null;

  const sortedClasses = [...(lead.targetClasses ?? [])].sort((a, b) => a - b);
  const location = [lead.city, lead.localArea].filter(Boolean).join(" · ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          !left-1/2 !top-[5vh] !max-h-[90dvh] !w-[calc(100vw-2rem)] !max-w-md
          !-translate-x-1/2 !translate-y-0 flex flex-col gap-4 overflow-y-auto p-5
          sm:!top-[8vh] sm:p-6
        "
      >
        <ConfettiBurst active={showConfetti} />

        <DialogHeader className="space-y-1.5 pr-8 text-left">
          <DialogTitle className="font-heading text-lg leading-tight sm:text-xl">
            🎉 Convert to Client!
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600">
            This will create a client record and mark the lead as converted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <div>
            <p className="text-xs font-medium text-slate-500">School</p>
            <p className="mt-0.5 font-heading text-base font-bold text-navy-900 sm:text-lg">
              {lead.schoolName}
            </p>
            {location && (
              <p className="mt-0.5 text-slate-600">{location}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Target classes
              </p>
              <p className="mt-0.5 font-medium text-navy-900">
                {sortedClasses.length > 0
                  ? sortedClasses.map((c) => `Class ${c}`).join(", ")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Deal value</p>
              <p className="stat-number mt-0.5 text-lg font-bold text-indigo-600 sm:text-xl">
                ₹{formatINR(lead.dealValue)}
              </p>
            </div>
          </div>

          {lead.targetTitle && (
            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs font-medium text-slate-500">Contact</p>
              <p className="mt-0.5 font-medium text-navy-900">
                {lead.targetTitle}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending || showConfetti}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 sm:w-auto"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || showConfetti}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting…
              </>
            ) : (
              "Confirm Conversion"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
