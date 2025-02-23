import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PurchaseRequest } from "@/pages/Purchase";

interface EditPurchaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editPurchase: PurchaseRequest;
  setEditPurchase: (purchase: PurchaseRequest | null) => void;
    onSubmit: (updatedPurchase: PurchaseRequest) => void;
}

export const EditPurchaseDialog: React.FC<EditPurchaseDialogProps> = ({
  isOpen,
  onOpenChange,
  editPurchase,
  setEditPurchase,
  onSubmit,
}) => {
  const [localPurchase, setLocalPurchase] = useState(editPurchase);

  useEffect(() => {
    setLocalPurchase(editPurchase);
  }, [editPurchase]);

const handleSubmit = () => {
  try {
    const date = new Date(localPurchase.created_at);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    const updatedPurchase: PurchaseRequest = {
      id: editPurchase.id,
      request_id: editPurchase.request_id,
      requester: editPurchase.requester,
      items: localPurchase.items,
      amount: localPurchase.amount,
      status: editPurchase.status,
      created_at: localPurchase.created_at,
      no_urut: localPurchase.no_urut,
    };
    onSubmit(updatedPurchase);
    onOpenChange(false);
  } catch (error) {
    console.error("Error processing date:", error);
    // Handle the error appropriately - maybe show a notification to the user
  }
};

  const formatDateTimeLocal = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().slice(0, 16);
      }
      return date.toISOString().slice(0, 16);
    } catch {
      return new Date().toISOString().slice(0, 16);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Purchase Request</DialogTitle>
          <DialogDescription>
            Make changes to your purchase request here.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Item Name</Label>
    <Input
      value={localPurchase.items}
      onChange={(e) =>
        setLocalPurchase((prev) => ({
          ...prev,
          items: e.target.value,
        }))
      }
    />
  </div>
  <div className="space-y-2">
    <Label>Amount</Label>
    <Input
      type="number"
      value={localPurchase.amount}
      onChange={(e) =>
        setLocalPurchase((prev) => ({
          ...prev,
          amount: Number(e.target.value),
        }))
      }
    />
  </div>
  <div className="space-y-2">
    <Label>Created At</Label>
    <p>{new Date(localPurchase.created_at).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        hour12: false
    })}</p>
  </div>
  <div className="space-y-2">
    <Label>No Urut</Label>
    <Input type="number" value={localPurchase.no_urut} readOnly />
  </div>
</div>
<DialogFooter>
  <Button onClick={handleSubmit}>Save changes</Button>
</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
