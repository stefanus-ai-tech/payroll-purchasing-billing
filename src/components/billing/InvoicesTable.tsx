
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/types/billing";

interface InvoicesTableProps {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export function InvoicesTable({
  invoices,
  onView,
  onEdit,
  onDelete
}: InvoicesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(invoice => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.invoice_id}</TableCell>
            <TableCell>{invoice.client}</TableCell>
            <TableCell>Rp {invoice.amount.toLocaleString()}</TableCell>
            <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={invoice.status === "Paid" ? "default" : invoice.status === "Overdue" ? "destructive" : "secondary"}>
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="ghost" onClick={() => onView(invoice)}>
                View
              </Button>
              <Button variant="ghost" onClick={() => onEdit(invoice)}>
                Edit
              </Button>
              <Button 
                variant="ghost" 
                className="text-red-500 hover:text-red-700"
                onClick={() => onDelete(invoice)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
