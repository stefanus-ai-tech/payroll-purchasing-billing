
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/types/billing";

interface ViewInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onUpdateStatus: (status: "Paid" | "Overdue") => void;
}

export function ViewInvoiceDialog({
  isOpen,
  onOpenChange,
  invoice,
  onUpdateStatus
}: ViewInvoiceDialogProps) {
  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Invoice ID</Label>
              <p className="font-medium">{invoice.invoice_id}</p>
            </div>
            <div>
              <Label>Status</Label>
              <Badge className="mt-1" variant={invoice.status === "Paid" ? "default" : invoice.status === "Overdue" ? "destructive" : "secondary"}>
                {invoice.status}
              </Badge>
            </div>
            <div>
              <Label>Client</Label>
              <p className="font-medium">{invoice.client}</p>
            </div>
            <div>
              <Label>Amount</Label>
              <p className="font-medium">Rp {invoice.amount.toLocaleString()}</p>
            </div>
            <div>
              <Label>Due Date</Label>
              <p className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant={invoice.status === "Pending" ? "default" : "outline"}
              disabled={invoice.status === "Paid"}
              onClick={() => onUpdateStatus("Paid")}
            >
              Mark as Paid
            </Button>
            <Button
              variant={invoice.status === "Overdue" ? "destructive" : "outline"}
              disabled={invoice.status === "Paid"}
              onClick={() => onUpdateStatus("Overdue")}
            >
              Mark as Overdue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
