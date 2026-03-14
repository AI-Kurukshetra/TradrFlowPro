"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SupplierOption = {
  id: string;
  name: string;
};

export function CreateInvoiceForm({ suppliers }: { suppliers: SupplierOption[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-");
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_number: invoiceNumber,
          supplier_id: supplierId,
          amount,
          due_date: dueDate,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not create invoice.");
        return;
      }

      setSuccess("Invoice created successfully.");
      setInvoiceNumber("INV-");
      setAmount("");
      setDueDate("");
      router.refresh();
    } catch {
      setError("Network error while creating invoice.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="invoice_number">Invoice Number *</Label>
        <Input
          id="invoice_number"
          name="invoice_number"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="supplier_id">Supplier *</Label>
        <select
          id="supplier_id"
          name="supplier_id"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          required
        >
          <option value="">Select supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount *</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="due_date">Due Date *</Label>
        <Input
          id="due_date"
          name="due_date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {success ? <p className="text-sm text-green-600">{success}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Invoice"}
      </Button>
    </form>
  );
}
