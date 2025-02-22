import { EditDialog } from "@/components/ui/edit-dialog";

interface PayrollData {
  employeeName: string;
  salary: number;
  pay_date: string;
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
  const validateField = (
    name: keyof PayrollData,
    value: any
  ): string | null => {
    switch (name) {
      case "employeeName":
        if (!value || value.trim() === "") return "Employee name is required";
        if (value.length > 100)
          return "Employee name must be less than 100 characters";
        return null;
      case "salary":
        if (value <= 0) return "Salary must be greater than 0";
        if (value > 1000000000) return "Salary must be less than 1,000,000,000";
        return null;
      case "pay_date":
        const date = new Date(value);
        const today = new Date();
        // Allow pay_date to be in the future
        return null;
      default:
        return null;
    }
  };

    const fields = [
    {
      name: "employeeName",
      label: "Employee Name",
      type: "text" as const,
      required: true,
      placeholder: "Enter employee name",
      validate: (value: string) => validateField("employeeName", value),
    },
    {
      name: "salary",
      label: "Salary (Rp)",
      type: "number" as const,
      required: true,
      min: 1,
      placeholder: "Enter salary",
      validate: (value: number) => validateField("salary", value),
    },
    {
      name: "pay_date",
      label: "Pay Date",
      type: "date" as const,
      required: true,
      placeholder: "Enter date",
      validate: (value: string) => validateField("pay_date", value),
    },
  ];

const handleSubmit = async () => {
    const errors = fields
      .map((field) => ({
        field: field.name,
        error: validateField(
          field.name as keyof PayrollData,
          editPayroll[field.name as keyof PayrollData]
        ),
      }))
      .filter((result) => result.error !== null);

    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      return;
    }

    // Format the pay_date to "yyyy-MM-dd"
    let formattedDate = new Date().toISOString().split("T")[0]; // Default to today's date
    if (editPayroll.pay_date) {
      const date = new Date(editPayroll.pay_date);
      if (!isNaN(date.getTime())) {
        formattedDate = editPayroll.pay_date.split("T")[0];
      }
    }

    const formattedPayroll = { ...editPayroll, pay_date: formattedDate };

    setEditPayroll(formattedPayroll);
    onSubmit();
  };

  return (
    <EditDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Payroll"
      fields={fields}
      editData={editPayroll}
      setEditData={setEditPayroll}
      onSubmit={handleSubmit}
    />
  );
}
