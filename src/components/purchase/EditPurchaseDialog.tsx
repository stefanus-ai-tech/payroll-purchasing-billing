import { EditDialog } from "@/components/ui/edit-dialog";

interface PurchaseData {
  itemName: string;
  quantity: number;
  requestDate: string;
}

interface EditPurchaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editPurchase: PurchaseData;
  setEditPurchase: (purchase: PurchaseData) => void;
  onSubmit: () => void;
}

export function EditPurchaseDialog({
  isOpen,
  onOpenChange,
  editPurchase,
  setEditPurchase,
  onSubmit,
}: EditPurchaseDialogProps) {
  const validateField = (
    name: keyof PurchaseData,
    value: any
  ): string | null => {
    switch (name) {
      case "itemName":
        if (!value || value.trim() === "") return "Item name is required";
        if (value.length > 100)
          return "Item name must be less than 100 characters";
        return null;
      case "quantity":
        if (value <= 0) return "Quantity must be greater than 0";
        if (value > 1000000) return "Quantity must be less than 1,000,000";
        return null;
      case "requestDate":
        const date = new Date(value);
        const today = new Date();
        if (date < today) return "Request date cannot be in the past";
        return null;
      default:
        return null;
    }
  };

  const fields = [
    {
      name: "itemName",
      label: "Item Name",
      type: "text" as const,
      required: true,
      placeholder: "Enter item name",
      validate: (value: string) => validateField("itemName", value),
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number" as const,
      required: true,
      min: 1,
      placeholder: "Enter quantity",
      validate: (value: number) => validateField("quantity", value),
    },
    {
      name: "requestDate",
      label: "Request Date",
      type: "date" as const,
      required: true,
      placeholder: "Enter request date",
      validate: (value: string) => validateField("requestDate", value),
    }
  ];

  const handleSubmit = async () => {
    const errors = fields
      .map((field) => ({
        field: field.name,
        error: validateField(
          field.name as keyof PurchaseData,
          editPurchase[field.name as keyof PurchaseData]
        ),
      }))
      .filter((result) => result.error !== null);

    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      return;
    }

    // Format the requestDate to "yyyy-MM-dd"
    const dateParts = editPurchase.requestDate.split("T")[0].split("-");
    const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
    const formattedPurchase = { ...editPurchase, requestDate: formattedDate };

    setEditPurchase(formattedPurchase);
    onSubmit();
  };

  return (
    <EditDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Purchase Request"
      fields={fields}
      editData={editPurchase}
      setEditData={setEditPurchase}
      onSubmit={handleSubmit}
    />
  );
}
