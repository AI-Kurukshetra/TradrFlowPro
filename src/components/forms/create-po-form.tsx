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

export function CreatePoForm({ suppliers }: { suppliers: SupplierOption[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [poNumber, setPoNumber] = useState("PO-");
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          po_number: poNumber,
          supplier_id: supplierId,
          amount,
          expected_delivery: expectedDelivery,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not create purchase order.");
        return;
      }

      setSuccess("Purchase order submitted.");
      setPoNumber("PO-");
      setAmount("");
      setExpectedDelivery("");
      router.refresh();
    } catch {
      setError("Network error while creating purchase order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="po_number">PO Number *</Label>
        <Input
          id="po_number"
          name="po_number"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
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
        <Label htmlFor="expected_delivery">Expected Delivery *</Label>
        <Input
          id="expected_delivery"
          name="expected_delivery"
          type="date"
          value={expectedDelivery}
          onChange={(e) => setExpectedDelivery(e.target.value)}
          required
        />
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {success ? <p className="text-sm text-green-600">{success}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit PO"}
      </Button>
    </form>
  );
}
