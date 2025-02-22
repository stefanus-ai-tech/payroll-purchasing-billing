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

export function EditPayrollDialog({
  isOpen,
  onOpenChange,
  editPayroll,
  setEditPayroll,
  onSubmit,
}: EditPayrollDialogProps) {
  const fields = [
    { name: "employeeName", label: "Employee Name", type: "text" as const },
    { name: "salary", label: "Salary (Rp)", type: "number" as const },
    { name: "payDate", label: "Pay Date", type: "date" as const },
  ];

  return (
    <EditDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Payroll"
      fields={fields}
      editData={editPayroll}
      setEditData={setEditPayroll}
      onSubmit={onSubmit}
    />
  );
}
