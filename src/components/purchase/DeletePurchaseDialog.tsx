import { DeleteDialog } from "@/components/ui/delete-dialog";

type PurchaseRequest = {
  id: string;
  request_id: string;
  requester: string;
  items: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
};

interface DeletePurchaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  purchase: PurchaseRequest | null;
  onConfirm: () => void;
}

export function DeletePurchaseDialog({
  isOpen,
  onOpenChange,
  purchase,
  onConfirm
}: DeletePurchaseDialogProps) {
  const description = (data: PurchaseRequest | null) => {
    return `This action cannot be undone. This will permanently delete the purchase request for ${data?.request_id}.`;
  };

  return (
    <DeleteDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Delete Purchase Request"
      description={description}
      data={purchase}
      onConfirm={onConfirm}
    />
  );
}
