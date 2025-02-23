import { EditDialog } from "@/components/ui/edit-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PayrollData {
  employeeName: string;
  salary: number;
  pay_date: string;
  pay_time: string; // Keep as string for now, will format later
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
      case "pay_time":
        if (!value) return "Time is required";
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
      type: "custom" as const,
      required: true,
      placeholder: "Enter date",
      validate: (value: string) => validateField("pay_date", value),
      component: Calendar,
      mode: 'date'
    },
    {
        name: "pay_time",
        label: "Pay Time",
        type: "custom" as const,
        required: true,
        placeholder: "Enter time",
        validate: (value: string) => validateField("pay_time", value),
        component: ({ onChange, value }: {onChange: (value: string) => void, value: string}) => {
          const [hours, minutes] = value ? value.split(':') : ['',''];

          const handleHourChange = (newHour: string) => {
            const newValue = `${newHour}:${minutes || '00'}`;
            onChange(newValue)
          }

          const handleMinuteChange = (newMinute: string) => {
            const newValue = `${hours || '00'}:${newMinute}`;
            onChange(newValue)
          }
          
          return (
            <div className="flex items-center gap-2">
              <Select onValueChange={handleHourChange} value={hours}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Hours" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => {
                    const hour = i.toString().padStart(2, "0");
                    return (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <span>:</span>
              <Select onValueChange={handleMinuteChange} value={minutes}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Minutes" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }).map((_, i) => {
                    const minute = i.toString().padStart(2, "0");
                    return (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )
        }
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
