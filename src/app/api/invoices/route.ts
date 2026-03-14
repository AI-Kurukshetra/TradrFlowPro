import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const uuidLikeSchema = z.string().regex(
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  "Invalid UUID.",
);

const payloadSchema = z.object({
  invoice_number: z.string().min(3),
  supplier_id: uuidLikeSchema,
  amount: z.coerce.number().positive(),
  due_date: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = payloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid invoice payload." },
        { status: 400 },
      );
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { data: supplier, error: supplierError } = await supabase
      .from("suppliers")
      .select("id")
      .eq("id", parsed.data.supplier_id)
      .single();

    if (supplierError || !supplier) {
      return NextResponse.json({ error: "Supplier not found." }, { status: 404 });
    }

    const { error } = await supabase.from("invoices").insert({
      invoice_number: parsed.data.invoice_number,
      supplier_id: parsed.data.supplier_id,
      buyer_id: user.id,
      amount: parsed.data.amount,
      due_date: parsed.data.due_date,
      issued_at: new Date().toISOString(),
      status: "pending",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
