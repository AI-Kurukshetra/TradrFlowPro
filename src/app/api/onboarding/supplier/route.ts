import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const legalName = String(formData.get("legal_name") ?? "").trim();
    const registrationNumber = String(formData.get("registration_number") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const beneficialOwner = String(formData.get("beneficial_owner") ?? "").trim();
    const businessDescription = String(formData.get("business_description") ?? "").trim();
    const file = formData.get("document") as File | null;

    if (!legalName || !registrationNumber || !country) {
      return NextResponse.json({ error: "Legal name, registration number, and country are required." }, { status: 400 });
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    let fileUrl = "";
    let warning = "";
    const bucketName = process.env.KYC_UPLOAD_BUCKET;

    if (file && file.size > 0) {
      if (!bucketName) {
        warning =
          "KYC details submitted, but file upload was skipped because KYC_UPLOAD_BUCKET is not configured.";
      } else {
        const filePath = `${user.id}/${Date.now()}-${file.name}`;
        const upload = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, { upsert: true });

        if (upload.error) {
          if (upload.error.message.toLowerCase().includes("bucket not found")) {
            warning = `KYC details submitted, but file upload was skipped because storage bucket '${bucketName}' was not found.`;
          } else {
            return NextResponse.json({ error: upload.error.message }, { status: 400 });
          }
        } else {
          fileUrl = filePath;
        }
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
        beneficial_owner: beneficialOwner,
        business_description: businessDescription,
      },
      status: "submitted",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const notification = await supabase.from("notifications").insert({
      user_id: user.id,
      title: "KYC Submitted",
      message: "Your supplier onboarding details are under review.",
      read: false,
    });

    if (notification.error) {
      return NextResponse.json({ error: notification.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, warning });
  } catch {
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
