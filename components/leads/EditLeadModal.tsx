"use client";

import { useEffect } from "react";
import { useForm, Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { updateLead } from "@/lib/api/leads";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "./lead-utils";
import type { Lead, LeadStatus } from "@/lib/types";

const schema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  localArea: z.string().optional(),
  pincode: z.string().optional(),
  targetTitle: z.string().min(1, "Target title is required"),
  targetClasses: z.string().min(1, "Enter class numbers (e.g. 1,2,3)"),
  dealValue: z.coerce.number().min(0, "Deal value must be 0 or more"),
  status: z.enum(["new", "in_progress", "negotiating", "converted", "lost"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function parseClasses(value: string): number[] {
  return value
    .split(/[,\s]+/)
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n) && n >= 1 && n <= 12);
}

function patchLeadLists(
  queryClient: ReturnType<typeof useQueryClient>,
  leadId: string,
  patch: Partial<Lead>
) {
  const updater = (old: { leads?: Lead[]; pagination?: unknown } | undefined) => {
    if (!old?.leads) return old;
    return {
      ...old,
      leads: old.leads.map((l) =>
        l._id === leadId ? { ...l, ...patch } : l
      ),
    };
  };
  queryClient.setQueriesData({ queryKey: ["leads"] }, updater);
  queryClient.setQueriesData({ queryKey: ["partner-leads"] }, updater);
}

interface EditLeadFormProps {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  footerClassName?: string;
}

function EditLeadForm({
  register,
  control,
  errors,
  isPending,
  onCancel,
  onSubmit,
  footerClassName,
}: EditLeadFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="schoolName">School Name</Label>
          <Input id="schoolName" {...register("schoolName")} />
          {errors.schoolName && (
            <p className="text-xs text-rose-600">{errors.schoolName.message}</p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register("description")} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register("address")} />
          {errors.address && (
            <p className="text-xs text-rose-600">{errors.address.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="localArea">Local Area</Label>
          <Input id="localArea" {...register("localArea")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetTitle">Target Title</Label>
          <Input id="targetTitle" {...register("targetTitle")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetClasses">Classes (1–12)</Label>
          <Input
            id="targetClasses"
            placeholder="e.g. 6, 7, 8, 9"
            {...register("targetClasses")}
          />
          {errors.targetClasses && (
            <p className="text-xs text-rose-600">
              {errors.targetClasses.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dealValue">Deal Value (₹)</Label>
          <Input id="dealValue" type="number" {...register("dealValue")} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.filter((o) => o.value !== "all").map(
                    (opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Input id="notes" {...register("notes")} />
        </div>
      </div>

      <div className={footerClassName ?? "flex justify-end gap-2 pt-2"}>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}

interface EditLeadModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditLeadModal({ lead, open, onOpenChange }: EditLeadModalProps) {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 639px)");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (lead && open) {
      reset({
        schoolName: lead.schoolName,
        description: lead.description ?? "",
        address: lead.address,
        city: lead.city,
        localArea: lead.localArea ?? "",
        pincode: lead.pincode ?? "",
        targetTitle: lead.targetTitle,
        targetClasses: lead.targetClasses.join(", "),
        dealValue: lead.dealValue,
        status: lead.status,
        notes: lead.notes ?? "",
      });
    }
  }, [lead, open, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const classes = parseClasses(values.targetClasses);
      if (classes.length === 0) {
        throw new Error("Enter valid class numbers between 1 and 12");
      }
      return updateLead(lead!._id, {
        schoolName: values.schoolName,
        description: values.description,
        address: values.address,
        city: values.city,
        localArea: values.localArea,
        pincode: values.pincode,
        targetTitle: values.targetTitle,
        targetClasses: classes,
        dealValue: values.dealValue,
        status: values.status as LeadStatus,
        notes: values.notes,
      });
    },
    onMutate: async (values) => {
      const classes = parseClasses(values.targetClasses);
      const patch: Partial<Lead> = {
        schoolName: values.schoolName,
        description: values.description,
        address: values.address,
        city: values.city,
        localArea: values.localArea,
        pincode: values.pincode,
        targetTitle: values.targetTitle,
        targetClasses: classes,
        dealValue: values.dealValue,
        status: values.status as LeadStatus,
        notes: values.notes,
      };

      await queryClient.cancelQueries({ queryKey: ["leads"] });
      await queryClient.cancelQueries({ queryKey: ["partner-leads"] });

      const previousLeads = queryClient.getQueriesData({ queryKey: ["leads"] });
      const previousPartnerLeads = queryClient.getQueriesData({
        queryKey: ["partner-leads"],
      });

      patchLeadLists(queryClient, lead!._id, patch);

      return { previousLeads, previousPartnerLeads };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["partner-leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Lead updated successfully");
      onOpenChange(false);
    },
    onError: (error: unknown, _v, context) => {
      context?.previousLeads?.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      );
      context?.previousPartnerLeads?.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      );
      const message =
        (error as Error).message ??
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ??
        "Failed to update lead";
      toast.error(message);
    },
  });

  if (!lead) return null;

  const formProps = {
    register,
    control,
    errors,
    isPending: mutation.isPending,
    onCancel: () => onOpenChange(false),
    onSubmit: handleSubmit((data) => mutation.mutate(data)),
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[92vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Edit Lead</SheetTitle>
            <SheetDescription>{lead.schoolName}</SheetDescription>
          </SheetHeader>
          <div className="mt-4 pb-8">
            <EditLeadForm {...formProps} footerClassName="flex flex-col gap-2 pt-4" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>{lead.schoolName}</DialogDescription>
        </DialogHeader>
        <EditLeadForm {...formProps} />
      </DialogContent>
    </Dialog>
  );
}
