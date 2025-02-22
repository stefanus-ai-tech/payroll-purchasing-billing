import { EditDialog } from "@/components/ui/edit-dialog";

interface EditPurchaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editPurchase: {
    itemName: string;
    quantity: string;
    requestDate: string;
  };
  setEditPurchase: (purchase: { itemName: string; quantity: string; requestDate: string }) => void;
  onSubmit: () => void;
}

export function EditPurchaseDialog({
  isOpen,
  onOpenChange,
  editPurchase,
  setEditPurchase,
  onSubmit
}: EditPurchaseDialogProps) {
  const fields = [
    { name: 'itemName', label: 'Item Name', type: 'text' },
    { name: 'quantity', label: 'Quantity', type: 'number' },
    { name: 'requestDate', label: 'Request Date', type: 'date' },
  ];

  return (
    <EditDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Purchase Request"
      fields={fields}
      editData={editPurchase}
      setEditData={setEditPurchase}
      onSubmit={onSubmit}
    />
  );
}
