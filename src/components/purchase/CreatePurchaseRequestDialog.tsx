import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type CreatePurchaseRequestDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (newRequest: {
    requester: string;
    position: string;
    items: string;
    amount: number;
  }) => void;
};

export const CreatePurchaseRequestDialog: React.FC<
  CreatePurchaseRequestDialogProps
> = ({ isOpen, onOpenChange, onCreate }) => {
  const [newRequest, setNewRequest] = useState({
    requester: "",
    position: "",
    items: "",
    amount: 0,
  });

  const handleSubmit = () => {
    onCreate(newRequest);
    setNewRequest({ requester: "", items: "", amount: 0, position: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Purchase Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="requester">Requester</Label>
            <Input
              id="requester"
              value={newRequest.requester}
              onChange={(e) =>
                setNewRequest((prev) => ({
                  ...prev,
                  requester: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={newRequest.position}
              onChange={(e) =>
                setNewRequest((prev) => ({
                  ...prev,
                  position: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="items">Items</Label>
            <Textarea
              id="items"
              value={newRequest.items}
              onChange={(e) =>
                setNewRequest((prev) => ({ ...prev, items: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Rp)</Label>
            <Input
              id="amount"
              type="number"
              value={newRequest.amount}
              onChange={(e) =>
                setNewRequest((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value || "0"),
                }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !newRequest.requester ||
              !newRequest.items ||
              !newRequest.amount ||
              !newRequest.position
            }
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
