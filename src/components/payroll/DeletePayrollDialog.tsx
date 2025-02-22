import { DeleteDialog } from "@/components/ui/delete-dialog";

type Employee = {
  id: string;
  name: string;
  position: string;
  salary: number;
  status: "Pending" | "Processed";
};

interface DeletePayrollDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  payroll: Employee | null;
  onConfirm: () => void;
}

export function DeletePayrollDialog({
  isOpen,
  onOpenChange,
  payroll,
  onConfirm
}: DeletePayrollDialogProps) {
  const description = (data: Employee | null) => {
    return `This action cannot be undone. This will permanently delete the payroll record for ${data?.name}.`;
  };

  return (
    <DeleteDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Delete Payroll Record"
      description={description}
      data={payroll}
      onConfirm={onConfirm}
    />
  );
}
