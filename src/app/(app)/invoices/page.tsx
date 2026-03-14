import { approveInvoiceAction } from "@/app/actions";
import { CreateInvoiceForm } from "@/components/forms/create-invoice-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInvoices, getSuppliers } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function InvoicesPage() {
  const [invoices, suppliers] = await Promise.all([getInvoices(), getSuppliers()]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Invoice Management</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Create invoices, review statuses, and approve pending submissions.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>{invoice.due_date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {invoice.status === "pending" ? (
                          <form action={approveInvoiceAction}>
                            <input type="hidden" name="invoice_id" value={invoice.id} />
                            <Button size="sm" type="submit">
                              Approve
                            </Button>
                          </form>
                        ) : (
                          <span className="text-xs text-muted-foreground">No action</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Create Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateInvoiceForm
              suppliers={suppliers.map((supplier) => ({
                id: supplier.id,
                name: supplier.name,
              }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
