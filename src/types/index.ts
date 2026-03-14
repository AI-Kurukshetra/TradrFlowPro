export type InvoiceStatus = "draft" | "pending" | "approved" | "paid" | "overdue";
export type POStatus = "draft" | "submitted" | "approved" | "fulfilled";
export type FinancingStatus = "pending" | "approved" | "rejected";

export interface Supplier {
  id: string;
  name: string;
  contact_email: string;
  risk_tier: "low" | "medium" | "high";
  organization_id: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  buyer_id: string;
  supplier_id: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string;
  issued_at: string;
  approved_at: string | null;
  paid_at: string | null;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  buyer_id: string;
  supplier_id: string;
  amount: number;
  status: POStatus;
  expected_delivery: string;
  created_at: string;
}

export interface FinancingRequest {
  id: string;
  supplier_id: string;
  invoice_id: string;
  requested_amount: number;
  discount_rate: number;
  status: FinancingStatus;
  requested_at: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend?: string;
}
