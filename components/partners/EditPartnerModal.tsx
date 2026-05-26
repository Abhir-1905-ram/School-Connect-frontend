"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { updatePartner } from "@/lib/api/partners";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getPartnerEmail,
  getPartnerName,
} from "./partner-utils";
import type { Partner } from "@/lib/types";

const schema = z.object({
  city: z.string().min(1, "City is required"),
  localArea: z.string().min(1, "Local area is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  designation: z.string().optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditPartnerModalProps {
  partner: Partner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPartnerModal({
  partner,
  open,
  onOpenChange,
}: EditPartnerModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (partner && open) {
      reset({
        city: partner.city,
        localArea: partner.localArea,
        pincode: partner.pincode,
        designation: partner.designation ?? "",
        phone: partner.phone ?? "",
      });
    }
  }, [partner, open, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      updatePartner(partner!._id, {
        city: values.city,
        localArea: values.localArea,
        pincode: values.pincode,
        designation: values.designation,
        phone: values.phone,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      queryClient.invalidateQueries({ queryKey: ["partner"] });
      toast.success("Partner updated successfully");
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update partner";
      toast.error(message);
    },
  });

  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Partner</DialogTitle>
          <DialogDescription>
            {getPartnerName(partner)} · {getPartnerEmail(partner)} ·{" "}
            {partner.partnerId}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Full Name</Label>
              <Input value={getPartnerName(partner)} disabled />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Email</Label>
              <Input value={getPartnerEmail(partner)} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-city">City</Label>
              <Input id="edit-city" {...register("city")} />
              {errors.city && (
                <p className="text-xs text-rose-600">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-localArea">Local Area</Label>
              <Input id="edit-localArea" {...register("localArea")} />
              {errors.localArea && (
                <p className="text-xs text-rose-600">
                  {errors.localArea.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pincode">Pincode</Label>
              <Input id="edit-pincode" maxLength={6} {...register("pincode")} />
              {errors.pincode && (
                <p className="text-xs text-rose-600">
                  {errors.pincode.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" {...register("phone")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-designation">Designation</Label>
              <Input id="edit-designation" {...register("designation")} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
