"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Search } from "lucide-react";
import dayjs from "dayjs";
import { recordPayment } from "@/lib/api/payments";
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
import { formatINRCurrency } from "./payment-utils";
import type { Client } from "@/lib/types";
import { cn } from "@/lib/utils";

const schema = z.object({
  clientId: z.string().min(1, "Select a client"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentDate: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
}

export function RecordPaymentModal({
  open,
  onOpenChange,
  clients,
}: RecordPaymentModalProps) {
  const queryClient = useQueryClient();
  const [clientSearch, setClientSearch] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: "",
      amount: 0,
      paymentDate: dayjs().format("YYYY-MM-DD"),
      notes: "",
    },
  });

  const selectedId = watch("clientId");

  const filteredClients = useMemo(() => {
    const q = clientSearch.toLowerCase().trim();
    if (!q) return clients;
    return clients.filter((c) => c.schoolName.toLowerCase().includes(q));
  }, [clients, clientSearch]);

  const selectedClient = clients.find((c) => c._id === selectedId);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      recordPayment({
        clientId: values.clientId,
        amount: values.amount,
        paymentDate: values.paymentDate,
        notes: values.notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["payment-stats"] });
      toast.success("Payment recorded successfully");
      reset();
      setClientSearch("");
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to record payment";
      toast.error(message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Log a new payment against a client account.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Client</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search client…"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200">
              {filteredClients.length === 0 && (
                <p className="p-3 text-center text-sm text-slate-500">
                  No clients found
                </p>
              )}
              {filteredClients.map((client) => (
                <button
                  key={client._id}
                  type="button"
                  onClick={() => {
                    setValue("clientId", client._id, { shouldValidate: true });
                    const balance = client.dealValue - client.amountPaid;
                    if (balance > 0) {
                      setValue("amount", balance);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center justify-between border-b border-slate-100 px-3 py-2.5 text-left text-sm last:border-0 hover:bg-slate-50",
                    selectedId === client._id && "bg-indigo-50"
                  )}
                >
                  <span className="font-medium">{client.schoolName}</span>
                  <span className="text-xs text-slate-500">
                    Bal ₹{formatINRCurrency(client.dealValue - client.amountPaid)}
                  </span>
                </button>
              ))}
            </div>
            {errors.clientId && (
              <p className="text-xs text-rose-600">{errors.clientId.message}</p>
            )}
            {selectedClient && (
              <p className="text-xs text-slate-500">
                Selected: {selectedClient.schoolName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input id="amount" type="number" step="1" {...register("amount")} />
            {errors.amount && (
              <p className="text-xs text-rose-600">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input id="paymentDate" type="date" {...register("paymentDate")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" {...register("notes")} placeholder="Optional" />
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
                  Recording…
                </>
              ) : (
                "Record Payment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
