"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { createLead } from "@/lib/api/leads";
import { ClassSelector } from "@/components/leads/ClassSelector";
import {
  LeadPreviewCard,
  type LeadPreviewData,
} from "@/components/partner/LeadPreviewCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINRCurrency } from "@/lib/dashboard-utils";

const schema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  description: z.string().max(500).optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  localArea: z.string().optional(),
  pincode: z.string().optional(),
  targetTitle: z.string().min(1, "Target title is required"),
  targetClasses: z.array(z.number()).min(1, "Select at least one class"),
  dealValue: z.coerce.number().min(0, "Deal value must be 0 or more"),
});

type FormValues = z.infer<typeof schema>;

export default function NewPartnerLeadPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const [descLength, setDescLength] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      schoolName: "",
      description: "",
      address: "",
      city: "",
      localArea: "",
      pincode: "",
      targetTitle: "Principal",
      targetClasses: [],
      dealValue: 0,
    },
  });

  const watched = watch();

  const preview: LeadPreviewData = {
    schoolName: watched.schoolName,
    description: watched.description,
    address: watched.address,
    city: watched.city,
    localArea: watched.localArea,
    pincode: watched.pincode,
    targetTitle: watched.targetTitle,
    targetClasses: watched.targetClasses,
    dealValue: watched.dealValue,
  };

  const mutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["partner-leads"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setSuccess(true);
      toast.success("Lead created successfully!");
      setTimeout(() => router.push("/partner/leads"), 1500);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to create lead";
      toast.error(message);
    },
  });

  return (
    <div className="relative pb-12">
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl bg-white p-10 text-center shadow-2xl"
            >
              <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
              <p className="mt-4 font-heading text-xl font-bold text-navy-900">
                Lead created!
              </p>
              <p className="text-sm text-slate-500">Redirecting to your leads…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        href="/partner/leads"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Leads
      </Link>

      <h1 className="font-heading text-2xl font-bold text-navy-900 md:text-3xl">
        Add New Lead
      </h1>
      <p className="mt-1 text-slate-500">
        Register a new school opportunity
      </p>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5"
      >
        <div className="space-y-6 lg:col-span-3">
          <div className="space-y-2">
            <Label htmlFor="schoolName" className="text-base">
              School Name
            </Label>
            <Input
              id="schoolName"
              placeholder="e.g. Delhi Public School"
              className="text-lg"
              {...register("schoolName")}
            />
            {errors.schoolName && (
              <p className="text-xs text-rose-600">{errors.schoolName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={4}
              maxLength={500}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Brief about the school and opportunity…"
              {...register("description", {
                onChange: (e) => setDescLength(e.target.value.length),
              })}
            />
            <p className="text-right text-xs text-slate-400">
              {descLength}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              {errors.city && (
                <p className="text-xs text-rose-600">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="localArea">Local Area</Label>
              <Input id="localArea" {...register("localArea")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" maxLength={6} {...register("pincode")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetTitle">Target Title</Label>
              <Input
                id="targetTitle"
                placeholder="e.g. Principal"
                {...register("targetTitle")}
              />
              {errors.targetTitle && (
                <p className="text-xs text-rose-600">
                  {errors.targetTitle.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Classes</Label>
            <Controller
              name="targetClasses"
              control={control}
              render={({ field }) => (
                <ClassSelector value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.targetClasses && (
              <p className="text-xs text-rose-600">
                {errors.targetClasses.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dealValue">Deal Value</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-slate-500">
                ₹
              </span>
              <Input
                id="dealValue"
                type="number"
                className="pl-8"
                {...register("dealValue")}
              />
            </div>
            {watched.dealValue > 0 && (
              <p className="text-sm text-indigo-600">
                Preview: ₹{formatINRCurrency(watched.dealValue)}
              </p>
            )}
            {errors.dealValue && (
              <p className="text-xs text-rose-600">{errors.dealValue.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending || success}
            className="w-full bg-gradient-to-r from-brand to-brand-light py-6 text-base sm:w-auto sm:px-12"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Lead…
              </>
            ) : (
              "Submit Lead"
            )}
          </Button>
        </div>

        <div className="lg:col-span-2">
          <LeadPreviewCard data={preview} />
        </div>
      </form>
    </div>
  );
}
