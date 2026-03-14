import { fallbackFinancingRequests, fallbackInvoices, fallbackPOs, fallbackSuppliers } from "@/lib/fallback-data";
import { createClient } from "@/lib/supabase/server";
import type { FinancingRequest, Invoice, PurchaseOrder, Supplier } from "@/types";

export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("suppliers")
    .select("id,name,contact_email,risk_tier,organization_id,created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  if (error || !data) {
    return fallbackSuppliers;
  }

  return data as Supplier[];
}

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("id,invoice_number,buyer_id,supplier_id,amount,status,due_date,issued_at,approved_at,paid_at")
    .order("issued_at", { ascending: false })
    .limit(100);

  if (error || !data) {
    return fallbackInvoices;
  }

  return data as Invoice[];
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("purchase_orders")
    .select("id,po_number,buyer_id,supplier_id,amount,status,expected_delivery,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) {
    return fallbackPOs;
  }

  return data as PurchaseOrder[];
}

export async function getFinancingRequests(): Promise<FinancingRequest[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("financing_requests")
    .select("id,supplier_id,invoice_id,requested_amount,discount_rate,status,requested_at")
    .order("requested_at", { ascending: false })
    .limit(50);

  if (error || !data) {
    return fallbackFinancingRequests;
  }

  return data as FinancingRequest[];
}
