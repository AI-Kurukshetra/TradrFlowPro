import { SupplierOnboardingForm } from "@/components/forms/supplier-onboarding-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupplierOnboardingPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Supplier Onboarding</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Complete KYC details and upload compliance documents for verification.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>KYC Form</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierOnboardingForm />
        </CardContent>
      </Card>
    </div>
  );
}
