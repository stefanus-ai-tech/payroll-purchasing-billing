import { useId } from "react";
import { EditDialog } from "@/components/ui/edit-dialog";

interface PayrollData {
  employeeName: string;
  salary: number;
  payDate: string;
}

interface EditPayrollDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editPayroll: PayrollData;
  setEditPayroll: (payroll: PayrollData) => void;
  onSubmit: () => void;
}

/**
 * Cleans a date string by trimming extra fractional seconds beyond milliseconds,
 * then returns a formatted string "yyyy-MM-dd".
 * If the date is invalid, it returns an empty string.
 */
const formatDate = (dateString: string): string => {
  // Remove extra fractional digits if present (keep only up to 3 digits for milliseconds)
  const cleaned = dateString.replace(/\.(\d{3})\d+/, ".$1");
  const date = new Date(cleaned);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

export function EditPayrollDialog({
  isOpen,
  onOpenChange,
  editPayroll,
  setEditPayroll,
  onSubmit,
}: EditPayrollDialogProps) {
  // Generate a unique ID for the description element
  const descriptionId = useId();

  const fields = [
    { name: "employeeName", label: "Employee Name", type: "text" as const },
    { name: "salary", label: "Salary (Rp)", type: "number" as const },
  ];

  // Format the payDate value to conform with "yyyy-MM-dd" or fallback if invalid.
  const formattedPayroll: PayrollData = {
    ...editPayroll,
    payDate: formatDate(editPayroll.payDate),
  };

  return (
    <EditDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Payroll"
      fields={fields}
      editData={formattedPayroll}
      setEditData={setEditPayroll}
      onSubmit={onSubmit}
    />
  );
}
