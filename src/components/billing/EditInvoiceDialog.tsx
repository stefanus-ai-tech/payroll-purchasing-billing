import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editInvoice: {
    client: string;
    amount: string;
    due_date: string;
  };
  setEditInvoice: (invoice: {
    client: string;
    amount: string;
    due_date: string;
  }) => void;
  onSubmit: () => void;
}

export function EditInvoiceDialog({
  isOpen,
  onOpenChange,
  editInvoice,
  setEditInvoice,
  onSubmit,
}: EditInvoiceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
          <DialogDescription>
            Modify the invoice details below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-client">Client Name</Label>
            <Input
              id="edit-client"
              value={editInvoice.client}
              onChange={(e) =>
                setEditInvoice({ ...editInvoice, client: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount (Rp)</Label>
            <Input
              id="edit-amount"
              type="number"
              value={editInvoice.amount}
              onChange={(e) =>
                setEditInvoice({ ...editInvoice, amount: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-dueDate">Due Date</Label>
            <Input
              id="edit-dueDate"
              type="date"
              value={editInvoice.due_date}
              onChange={(e) =>
                setEditInvoice({ ...editInvoice, due_date: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={
              !editInvoice.client ||
              !editInvoice.amount ||
              !editInvoice.due_date
            }
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
