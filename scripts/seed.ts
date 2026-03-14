import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  const organizationId = randomUUID();
  const buyerId = randomUUID();

  const organization = {
    id: organizationId,
    name: "TradeFlow Demo Org",
    industry: "Manufacturing",
    country: "United States",
  };

  const buyer = {
    id: buyerId,
    organization_id: organizationId,
    name: "Prime Retail Buyer",
    contact_email: `buyer+${organizationId}@tradeflowpro.com`,
    credit_limit: 5000000,
  };

  const suppliers = Array.from({ length: 10 }, (_, idx) => ({
    id: randomUUID(),
    organization_id: organizationId,
    name: `Supplier ${idx + 1}`,
    contact_email: `supplier${idx + 1}+${organizationId}@tradeflowpro.com`,
    risk_tier: (["low", "medium", "high"] as const)[idx % 3],
  }));

  const purchaseOrders = Array.from({ length: 5 }, (_, idx) => ({
    id: randomUUID(),
    po_number: `PO-${organizationId.slice(0, 8)}-${idx + 1}`,
    buyer_id: buyerId,
    supplier_id: suppliers[idx % suppliers.length].id,
    amount: 45000 + idx * 8500,
    status: (["submitted", "approved", "fulfilled"] as const)[idx % 3],
    expected_delivery: new Date(Date.now() + (idx + 5) * 86400000)
      .toISOString()
      .slice(0, 10),
  }));

  const invoices = Array.from({ length: 20 }, (_, idx) => ({
    id: randomUUID(),
    invoice_number: `INV-${organizationId.slice(0, 8)}-${idx + 1}`,
    buyer_id: buyerId,
    supplier_id: suppliers[idx % suppliers.length].id,
    purchase_order_id: idx < 5 ? purchaseOrders[idx].id : null,
    amount: 25000 + idx * 6000,
    status: (["pending", "approved", "paid", "overdue"] as const)[idx % 4],
    issued_at: new Date(Date.now() - (20 - idx) * 86400000).toISOString(),
    due_date: new Date(Date.now() + (idx + 10) * 86400000).toISOString().slice(0, 10),
  }));

  const financingRequests = invoices.slice(0, 8).map((invoice, idx) => ({
    id: randomUUID(),
    supplier_id: invoice.supplier_id,
    invoice_id: invoice.id,
    requested_amount: Number(invoice.amount) * 0.8,
    discount_rate: Number((1.2 + idx * 0.2).toFixed(2)),
    status: (["pending", "approved", "rejected"] as const)[idx % 3],
    requested_at: new Date(Date.now() - idx * 86400000).toISOString(),
  }));

  const tasks = [
    supabase.from("organizations").insert([organization]),
    supabase.from("buyers").insert([buyer]),
    supabase.from("suppliers").insert(suppliers),
    supabase.from("purchase_orders").insert(purchaseOrders),
    supabase.from("invoices").insert(invoices),
    supabase.from("financing_requests").insert(financingRequests),
  ];

  for (const task of tasks) {
    const { error } = await task;
    if (error) {
      throw error;
    }
  }

  console.log("Seed complete: 10 suppliers, 20 invoices, 5 purchase orders inserted.");
}

run().catch((error: Error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
