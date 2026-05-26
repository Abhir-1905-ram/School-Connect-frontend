"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { updateClient } from "@/lib/api/clients";
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
import { ClassSelector } from "@/components/leads/ClassSelector";
import { Controller } from "react-hook-form";
import type { Client } from "@/lib/types";

const schema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  targetTitle: z.string().optional(),
  targetClasses: z.array(z.number()).optional(),
  dealValue: z.coerce.number().min(0),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditClientDrawerProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditClientDrawer({
  client,
  open,
  onOpenChange,
}: EditClientDrawerProps) {
  const queryClient = useQueryClient();

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
    if (client && open) {
      reset({
        schoolName: client.schoolName,
        address: client.address ?? "",
        city: client.city ?? "",
        targetTitle: client.targetTitle ?? "",
        targetClasses: client.targetClasses ?? [],
        dealValue: client.dealValue,
        notes: client.notes ?? "",
      });
    }
  }, [client, open, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => updateClient(client!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["partner-clients"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Client updated");
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update client";
      toast.error(message);
    },
  });

  if (!client) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Client</SheetTitle>
          <SheetDescription>Update details for {client.schoolName}</SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="mt-6 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="schoolName">School Name</Label>
            <Input id="schoolName" {...register("schoolName")} />
            {errors.schoolName && (
              <p className="text-xs text-rose-600">{errors.schoolName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetTitle">Target Title</Label>
            <Input id="targetTitle" {...register("targetTitle")} />
          </div>

          <div className="space-y-2">
            <Label>Target Classes</Label>
            <Controller
              name="targetClasses"
              control={control}
              render={({ field }) => (
                <ClassSelector
                  value={field.value ?? []}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dealValue">Deal Value (₹)</Label>
            <Input id="dealValue" type="number" {...register("dealValue")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("notes")}
            />
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-gradient-to-r from-brand to-brand-light"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
