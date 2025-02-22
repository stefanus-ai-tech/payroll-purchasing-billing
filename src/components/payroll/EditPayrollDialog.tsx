import { EditDialog } from "@/components/ui/edit-dialog";

interface EditPayrollDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editPayroll: {
    employeeName: string;
    salary: string;
    payDate: string;
  };
  setEditPayroll: (payroll: { employeeName: string; salary: string; payDate: string }) => void;
  onSubmit: () => void;
}

export function EditPayrollDialog({
  isOpen,
  onOpenChange,
  editPayroll,
  setEditPayroll,
  onSubmit
}: EditPayrollDialogProps) {
  const fields = [
    { name: 'employeeName', label: 'Employee Name', type: 'text' },
    { name: 'salary', label: 'Salary (Rp)', type: 'number' },
    { name: 'payDate', label: 'Pay Date', type: 'date' },
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
