"use client";

import { useState } from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SupplierOnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");
  const submittingRef = useRef(false);
  const submitSeqRef = useRef(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    if (submittingRef.current) return;
    submittingRef.current = true;
    const submitSeq = ++submitSeqRef.current;
    setError("");
    setSuccess("");
    setWarning("");
    setLoading(true);

    try {
      const formData = new FormData(formElement);

      const response = await fetch("/api/onboarding/supplier", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? ((await response.json()) as { error?: string; warning?: string })
        : ({ error: await response.text() } as { error?: string; warning?: string });
      if (submitSeq !== submitSeqRef.current) return;

      if (!response.ok) {
        setError(data.error ?? "Could not submit onboarding form.");
        setSuccess("");
        setWarning("");
        return;
      }

      setError("");
      setSuccess("Onboarding submitted successfully.");
      if (data.warning) {
        setWarning(data.warning);
      }
      formElement.reset();
    } catch (error) {
      if (submitSeq !== submitSeqRef.current) return;
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Unable to submit onboarding right now. Please try again.";
      setError(message);
      setSuccess("");
      setWarning("");
    } finally {
      if (submitSeq === submitSeqRef.current) {
        setLoading(false);
        submittingRef.current = false;
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="legal_name">Legal Entity Name *</Label>
        <Input id="legal_name" name="legal_name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="registration_number">Registration Number *</Label>
        <Input id="registration_number" name="registration_number" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country *</Label>
        <Input id="country" name="country" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="beneficial_owner">Beneficial Owner</Label>
        <Input id="beneficial_owner" name="beneficial_owner" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="business_description">Business Description</Label>
        <Textarea id="business_description" name="business_description" rows={4} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="document">Upload KYC Document</Label>
        <Input id="document" name="document" type="file" accept=".pdf,.png,.jpg,.jpeg" />
      </div>

      {error ? <p className="text-sm text-red-500 md:col-span-2">{error}</p> : null}
      {warning ? <p className="text-sm text-amber-600 md:col-span-2">{warning}</p> : null}
      {success ? <p className="text-sm text-green-600 md:col-span-2">{success}</p> : null}

      <div className="md:col-span-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Onboarding"}
        </Button>
      </div>
    </form>
  );
}
