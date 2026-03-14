"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InvoiceOption = {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
};

export function FinancingRequestForm({ invoices }: { invoices: InvoiceOption[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [invoiceId, setInvoiceId] = useState(invoices[0]?.id ?? "");
  const [amount, setAmount] = useState(
    invoices[0] ? String(Math.round(invoices[0].amount * 0.8)) : "",
  );
  const [discountRate, setDiscountRate] = useState("1.5");

  function onInvoiceChange(selectedId: string) {
    setInvoiceId(selectedId);
    const selectedInvoice = invoices.find((invoice) => invoice.id === selectedId);
    if (selectedInvoice) {
      setAmount(String(Math.round(selectedInvoice.amount * 0.8)));
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!invoiceId) {
      setError("Please select an invoice.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/financing-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoice_id: invoiceId,
          requested_amount: amount,
          discount_rate: discountRate,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not create financing request.");
        setLoading(false);
        return;
      }

      setSuccess("Financing request submitted.");
      setAmount("");
    } catch {
      setError("Network error while submitting financing request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="invoice_id">Invoice *</Label>
        <select
          id="invoice_id"
          name="invoice_id"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={invoiceId}
          onChange={(e) => onInvoiceChange(e.target.value)}
          required
        >
          <option value="">Select invoice</option>
          {invoices.map((invoice) => (
            <option key={invoice.id} value={invoice.id}>
              {invoice.invoice_number} - {invoice.status}
            </option>
          ))}
        </select>
        {invoiceId ? (
          <p className="text-xs text-muted-foreground">Selected invoice ID: {invoiceId}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="requested_amount">Requested Amount *</Label>
        <Input
          id="requested_amount"
          name="requested_amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount_rate">Discount Rate (%) *</Label>
        <Input
          id="discount_rate"
          name="discount_rate"
          type="number"
          min="0.1"
          step="0.01"
          value={discountRate}
          onChange={(e) => setDiscountRate(e.target.value)}
          required
        />
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {success ? <p className="text-sm text-green-600">{success}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
}
