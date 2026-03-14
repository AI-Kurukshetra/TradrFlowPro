import { TpvChart } from "@/components/charts/tpv-chart";
import { KpiCard } from "@/components/common/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInvoices, getSuppliers } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function AnalyticsPage() {
  const [invoices, suppliers] = await Promise.all([getInvoices(), getSuppliers()]);

  const tpv = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid").length;
  const approvalRate = invoices.length
    ? ((invoices.filter((i) => i.status !== "draft").length / invoices.length) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Analyze TPV, supplier participation, and payment cycle performance.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard title="Total Payment Volume" value={formatCurrency(tpv)} />
        <KpiCard title="Active Suppliers" value={`${suppliers.length}`} />
        <KpiCard
          title="Approval Throughput"
          value={`${approvalRate}%`}
          subtitle={`${paidInvoices} paid invoices`}
        />
      </section>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>TPV vs Financed Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <TpvChart />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Avg. Days to Approve</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">3.8</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Financing Penetration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">57%</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm sm:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">On-time Settlement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">93.4%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
