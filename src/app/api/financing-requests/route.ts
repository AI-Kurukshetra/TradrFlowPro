import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const uuidLikeSchema = z.string().regex(
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  "Invalid UUID.",
);

const payloadSchema = z.object({
  invoice_id: uuidLikeSchema,
  requested_amount: z.coerce.number().positive(),
  discount_rate: z.coerce.number().min(0.1).max(20),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = payloadSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? "Invalid financing request payload.";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("id,supplier_id,status")
      .eq("id", parsed.data.invoice_id)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    if (!["approved", "pending"].includes(invoice.status)) {
      return NextResponse.json(
        { error: "Invoice must be pending or approved for financing." },
        { status: 400 },
      );
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
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
