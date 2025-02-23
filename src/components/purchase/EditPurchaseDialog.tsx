import { useState } from "react";
import { EditDialog } from "@/components/ui/edit-dialog";

interface PurchaseData {
  itemName: string;
  quantity: number;
  created_at: string;
  no_urut: number;
}

interface ValidationError {
  field: keyof PurchaseData;
  message: string;
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
  // Validate each field based on its name and value
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
        if (value > 1000000000)
          return "Quantity must be less than 1,000,000,000";
        return null;
      case "created_at":
        const date = new Date(value);
        const today = new Date();
        // Allow created_at to be in the future
        return null;
      case "no_urut":
        return null; // No validation needed for no_urut
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
      label: "Amount",
      type: "number" as const,
      required: true,
      min: 1,
      placeholder: "Enter Amoun",
      validate: (value: number) => validateField("quantity", value),
    },
    {
      name: "created_at",
      label: "Created At",
      type: "date" as const,
      required: true,
      placeholder: "Enter date",
      validate: (value: string) => validateField("created_at", value),
    },
    {
      name: "no_urut",
      label: "No Urut",
      type: "number" as const,
      required: false,
      placeholder: "Auto-generated",
      validate: (value: number) => validateField("no_urut", value),
      readOnly: true,
    },
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

    // Format the created_at to "yyyy-MM-dd"
    let formattedDate = new Date().toISOString().split("T")[0]; // Default to today's date
    if (editPurchase.created_at) {
      const date = new Date(editPurchase.created_at);
      if (!isNaN(date.getTime())) {
        formattedDate = editPurchase.created_at.split("T")[0];
      }
    }

    const formattedPurchase = { ...editPurchase, created_at: formattedDate };

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
