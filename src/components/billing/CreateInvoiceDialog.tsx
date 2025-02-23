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

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newInvoice: {
    client: string;
    amount: string;
    due_date: string;
  };
  setNewInvoice: (invoice: {
    client: string;
    amount: string;
    due_date: string;
  }) => void;
  onSubmit: () => void;
}

export function CreateInvoiceDialog({
  isOpen,
  onOpenChange,
  newInvoice,
  setNewInvoice,
  onSubmit,
}: CreateInvoiceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Fill out the form below to create a new invoice.
        </DialogDescription>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client Name</Label>
            <Input
              id="client"
              value={newInvoice.client}
              onChange={(e) =>
                setNewInvoice({ ...newInvoice, client: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Rp)</Label>
            <Input
              id="amount"
              type="number"
              value={newInvoice.amount}
              onChange={(e) =>
                setNewInvoice({ ...newInvoice, amount: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={newInvoice.due_date}
              onChange={(e) =>
                setNewInvoice({ ...newInvoice, due_date: e.target.value })
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
              !newInvoice.client || !newInvoice.amount || !newInvoice.due_date
            }
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
