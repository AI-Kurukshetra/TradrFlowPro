"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const uuidLikeSchema = z.string().regex(
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  "Invalid UUID.",
);

const invoiceSchema = z.object({
  invoice_number: z.string().min(3),
  supplier_id: uuidLikeSchema,
  amount: z.coerce.number().positive(),
  due_date: z.string().min(1),
});

const poSchema = z.object({
  po_number: z.string().min(3),
  supplier_id: uuidLikeSchema,
  amount: z.coerce.number().positive(),
  expected_delivery: z.string().min(1),
});

const financingSchema = z.object({
  invoice_id: uuidLikeSchema,
  requested_amount: z.coerce.number().positive(),
  discount_rate: z.coerce.number().min(0.1).max(20),
});

export async function createInvoiceAction(formData: FormData) {
  const parsed = invoiceSchema.safeParse({
    invoice_number: formData.get("invoice_number"),
    supplier_id: formData.get("supplier_id"),
    amount: formData.get("amount"),
    due_date: formData.get("due_date"),
  });

  if (!parsed.success) return;

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const { data: supplier, error: supplierError } = await supabase
    .from("suppliers")
    .select("id")
    .eq("id", parsed.data.supplier_id)
    .single();

  if (supplierError || !supplier) return;

  const { error } = await supabase.from("invoices").insert({
    invoice_number: parsed.data.invoice_number,
    supplier_id: parsed.data.supplier_id,
    buyer_id: user.id,
    amount: parsed.data.amount,
    due_date: parsed.data.due_date,
    issued_at: new Date().toISOString(),
    status: "pending",
  });

  if (error) return;

  revalidatePath("/invoices");
  revalidatePath("/dashboard/buyer");
}

export async function approveInvoiceAction(formData: FormData) {
  const invoiceId = String(formData.get("invoice_id") ?? "");
  if (!invoiceId) {
    throw new Error("Invoice id is required.");
  }

  const supabase = createClient();

  const { error } = await supabase
    .from("invoices")
    .update({ status: "approved", approved_at: new Date().toISOString() })
    .eq("id", invoiceId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/invoices");
  revalidatePath("/dashboard/buyer");
  revalidatePath("/dashboard/supplier");
}

export async function createPurchaseOrderAction(formData: FormData) {
  const parsed = poSchema.safeParse({
    po_number: formData.get("po_number"),
    supplier_id: formData.get("supplier_id"),
    amount: formData.get("amount"),
    expected_delivery: formData.get("expected_delivery"),
  });

  if (!parsed.success) return;

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const { data: supplier, error: supplierError } = await supabase
    .from("suppliers")
    .select("id")
    .eq("id", parsed.data.supplier_id)
    .single();

  if (supplierError || !supplier) return;

  const { error } = await supabase.from("purchase_orders").insert({
    po_number: parsed.data.po_number,
    supplier_id: parsed.data.supplier_id,
    buyer_id: user.id,
    amount: parsed.data.amount,
    expected_delivery: parsed.data.expected_delivery,
    status: "submitted",
  });

  if (error) return;

  revalidatePath("/purchase-orders");
}

export async function createFinancingRequestAction(formData: FormData) {
  const parsed = financingSchema.safeParse({
    invoice_id: String(formData.get("invoice_id") ?? "").trim(),
    requested_amount: formData.get("requested_amount"),
    discount_rate: formData.get("discount_rate"),
  });

  if (!parsed.success) {
    return;
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("id,supplier_id,status")
    .eq("id", parsed.data.invoice_id)
    .single();

  if (invoiceError || !invoice || !["approved", "pending"].includes(invoice.status)) {
    return;
  }

  const { error } = await supabase.from("financing_requests").insert({
    supplier_id: invoice.supplier_id,
    invoice_id: parsed.data.invoice_id,
    requested_amount: parsed.data.requested_amount,
    discount_rate: parsed.data.discount_rate,
    status: "pending",
    requested_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/supplier");
}

export async function submitKycAction(formData: FormData) {
  const legalName = String(formData.get("legal_name") ?? "");
  const registrationNumber = String(formData.get("registration_number") ?? "");
  const country = String(formData.get("country") ?? "");
  const file = formData.get("document") as File | null;

  if (!legalName || !registrationNumber || !country) {
    throw new Error("Missing KYC details.");
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  let fileUrl = "";

  if (file && file.size > 0) {
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const upload = await supabase.storage
      .from("kyc-documents")
      .upload(filePath, file, { upsert: true });

    if (!upload.error) {
      fileUrl = filePath;
    }
  }

  const { error } = await supabase.from("documents").insert({
    uploaded_by: user.id,
    document_type: "kyc",
    file_url: fileUrl,
    metadata: {
      legal_name: legalName,
      registration_number: registrationNumber,
      country,
    },
    status: "submitted",
  });

  if (error) {
    throw new Error(error.message);
  }

  const notification = await supabase.from("notifications").insert({
    user_id: user.id,
    title: "KYC Submitted",
    message: "Your supplier onboarding details are under review.",
    read: false,
  });

  if (notification.error) {
    throw new Error(notification.error.message);
  }

  revalidatePath("/onboarding/supplier");
}
