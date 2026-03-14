import { CashFlowChart } from "@/components/charts/cash-flow-chart";
import { KpiCard } from "@/components/common/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInvoices } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function BuyerDashboardPage() {
  const invoices = await getInvoices();
  const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const approvedAmount = invoices
    .filter((invoice) => invoice.status === "approved" || invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingCount = invoices.filter((invoice) => invoice.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Buyer Dashboard</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Monitor invoice health, approval bottlenecks, and buyer-side liquidity.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard title="Total Invoice Volume" value={formatCurrency(totalInvoiceAmount)} />
        <KpiCard title="Approved / Paid" value={formatCurrency(approvedAmount)} />
        <KpiCard title="Pending Approvals" value={`${pendingCount}`} />
      </section>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Cash Flow Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <CashFlowChart />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {invoices.slice(0, 6).map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-col gap-3 rounded-lg border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{invoice.invoice_number}</p>
                <p className="text-muted-foreground">Due {invoice.due_date}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                <Badge variant="outline" className="capitalize">
                  {invoice.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
