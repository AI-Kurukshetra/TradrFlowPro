import { CreatePoForm } from "@/components/forms/create-po-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPurchaseOrders, getSuppliers } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function PurchaseOrdersPage() {
  const [purchaseOrders, suppliers] = await Promise.all([getPurchaseOrders(), getSuppliers()]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Purchase Orders</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Create new POs and track lifecycle status from submitted to fulfilled.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>PO Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.po_number}</TableCell>
                      <TableCell>{formatCurrency(po.amount)}</TableCell>
                      <TableCell>{po.expected_delivery}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {po.status}
                        </Badge>
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
            <CardTitle>Create PO</CardTitle>
          </CardHeader>
          <CardContent>
            <CreatePoForm
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
