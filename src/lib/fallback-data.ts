import type { FinancingRequest, Invoice, PurchaseOrder, Supplier } from "@/types";

const orgId = "9f8d9f58-6c6d-47c1-928e-7baf1745a001";
const buyerId = "1f61945e-6173-4dc1-90ab-2074fbe8f001";

export const fallbackSuppliers: Supplier[] = [
  {
    id: "5d7b5f67-fca8-4ca9-bf3a-c5fa3ac0a001",
    name: "Atlas Components",
    contact_email: "ops@atlascomponents.com",
    risk_tier: "low",
    organization_id: orgId,
    created_at: new Date().toISOString(),
  },
  {
    id: "5d7b5f67-fca8-4ca9-bf3a-c5fa3ac0a002",
    name: "Nova Industrial",
    contact_email: "finance@novaindustrial.com",
    risk_tier: "medium",
    organization_id: orgId,
    created_at: new Date().toISOString(),
  },
  {
    id: "5d7b5f67-fca8-4ca9-bf3a-c5fa3ac0a003",
    name: "BluePeak Logistics",
    contact_email: "admin@bluepeaklogistics.com",
    risk_tier: "high",
    organization_id: orgId,
    created_at: new Date().toISOString(),
  },
];

export const fallbackInvoices: Invoice[] = [
  {
    id: "7a40f378-46dc-4ac8-bfe7-76f2f6d2a001",
    invoice_number: "INV-1001",
    buyer_id: buyerId,
    supplier_id: fallbackSuppliers[0].id,
    amount: 125000,
    status: "approved",
    due_date: "2026-04-10",
    issued_at: "2026-03-01",
    approved_at: "2026-03-03",
    paid_at: null,
  },
  {
    id: "7a40f378-46dc-4ac8-bfe7-76f2f6d2a002",
    invoice_number: "INV-1002",
    buyer_id: buyerId,
    supplier_id: fallbackSuppliers[1].id,
    amount: 89000,
    status: "pending",
    due_date: "2026-04-20",
    issued_at: "2026-03-05",
    approved_at: null,
    paid_at: null,
  },
  {
    id: "7a40f378-46dc-4ac8-bfe7-76f2f6d2a003",
    invoice_number: "INV-1003",
    buyer_id: buyerId,
    supplier_id: fallbackSuppliers[2].id,
    amount: 64000,
    status: "paid",
    due_date: "2026-03-20",
    issued_at: "2026-02-15",
    approved_at: "2026-02-17",
    paid_at: "2026-03-01",
  },
];

export const fallbackPOs: PurchaseOrder[] = [
  {
    id: "25794fb6-215f-45f0-bef6-c7a226d3a001",
    po_number: "PO-2201",
    buyer_id: buyerId,
    supplier_id: fallbackSuppliers[0].id,
    amount: 150000,
    status: "approved",
    expected_delivery: "2026-04-15",
    created_at: "2026-03-02",
  },
  {
    id: "25794fb6-215f-45f0-bef6-c7a226d3a002",
    po_number: "PO-2202",
    buyer_id: buyerId,
    supplier_id: fallbackSuppliers[1].id,
    amount: 73000,
    status: "submitted",
    expected_delivery: "2026-04-28",
    created_at: "2026-03-08",
  },
];

export const fallbackFinancingRequests: FinancingRequest[] = [
  {
    id: "e2e18f1c-8715-49e0-a9eb-0bac7fdca001",
    supplier_id: fallbackSuppliers[0].id,
    invoice_id: fallbackInvoices[0].id,
    requested_amount: 100000,
    discount_rate: 1.75,
    status: "approved",
    requested_at: "2026-03-04",
  },
  {
    id: "e2e18f1c-8715-49e0-a9eb-0bac7fdca002",
    supplier_id: fallbackSuppliers[1].id,
    invoice_id: fallbackInvoices[1].id,
    requested_amount: 70000,
    discount_rate: 2.1,
    status: "pending",
    requested_at: "2026-03-07",
  },
];
