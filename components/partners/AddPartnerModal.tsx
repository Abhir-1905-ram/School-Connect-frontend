"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { register as registerUser } from "@/lib/api/auth";
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

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  city: z.string().min(1, "City is required"),
  localArea: z.string().min(1, "Local area is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  designation: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPartnerModal({ open, onOpenChange }: AddPartnerModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      city: "",
      localArea: "",
      pincode: "",
      designation: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const result = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: "partner",
        city: values.city,
        localArea: values.localArea,
        pincode: values.pincode,
        phone: values.phone || undefined,
      });

      if (values.designation && result.partnerId) {
        await updatePartner(result.partnerId, {
          designation: values.designation,
        });
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      toast.success(`Partner ${result.user.name} created successfully`);
      reset();
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to create partner";
      toast.error(message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Partner</DialogTitle>
          <DialogDescription>
            Create a new partner account with login credentials.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-rose-600">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-rose-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-xs text-rose-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <p className="text-xs text-rose-600">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="localArea">Local Area</Label>
              <Input id="localArea" {...register("localArea")} />
              {errors.localArea && (
                <p className="text-xs text-rose-600">
                  {errors.localArea.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" maxLength={6} {...register("pincode")} />
              {errors.pincode && (
                <p className="text-xs text-rose-600">
                  {errors.pincode.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" {...register("designation")} />
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
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-gradient-to-r from-brand to-brand-light"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Partner"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
