import { KpiCard } from "@/components/common/kpi-card";
import { FinancingRequestForm } from "@/components/forms/financing-request-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFinancingRequests, getInvoices, getSuppliers } from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/format";

export default async function SupplierDashboardPage() {
  const [financingRequests, invoices, suppliers] = await Promise.all([
    getFinancingRequests(),
    getInvoices(),
    getSuppliers(),
  ]);

  const totalRequested = financingRequests.reduce(
    (sum, request) => sum + request.requested_amount,
    0,
  );

  const avgDiscount =
    financingRequests.length > 0
      ? financingRequests.reduce((sum, request) => sum + request.discount_rate, 0) /
        financingRequests.length
      : 0;
  const eligibleInvoices = invoices.filter(
    (invoice) => invoice.status === "approved" || invoice.status === "pending",
  );
  const invoiceNumberById = new Map(invoices.map((invoice) => [invoice.id, invoice.invoice_number]));

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Supplier Dashboard</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Track financing requests, early payment discounts, and invoice eligibility.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard title="Total Financing Requested" value={formatCurrency(totalRequested)} />
        <KpiCard title="Average Discount Rate" value={formatPercent(avgDiscount)} />
        <KpiCard title="Active Suppliers" value={`${suppliers.length}`} />
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Financing Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {financingRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col gap-3 rounded-lg border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    Invoice {invoiceNumberById.get(request.invoice_id) ?? request.invoice_id}
                  </p>
                  <p className="text-muted-foreground">Requested {request.requested_at}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold">{formatCurrency(request.requested_amount)}</p>
                  <Badge variant="outline" className="capitalize">
                    {request.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Create Financing Request</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancingRequestForm
              invoices={eligibleInvoices.map((invoice) => ({
                id: invoice.id,
                invoice_number: invoice.invoice_number,
                amount: invoice.amount,
                status: invoice.status,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Eligible Invoices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {eligibleInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-col gap-2 rounded-lg border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="font-medium">{invoice.invoice_number}</p>
              <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
