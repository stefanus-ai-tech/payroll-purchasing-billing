import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/payroll";
import { Input } from "@/components/ui/input";

interface PayrollTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onSave: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function PayrollTable({
  employees,
  onView,
  onSave,
  onDelete,
}: PayrollTableProps) {
  const [editedEmployee, setEditedEmployee] = useState<{
    id: string;
    data: Partial<Employee>;
  } | null>(null);

  const handleEdit = (employee: Employee) => {
    setEditedEmployee({ id: employee.id, data: { ...employee } });
  };

  const handleSave = () => {
    if (editedEmployee) {
      onSave(editedEmployee.data as Employee);
      setEditedEmployee(null);
    }
  };

  const handleCancel = () => {
    setEditedEmployee(null);
  };

  const handleInputChange = (
    field: keyof Employee,
    value: string | number
  ) => {
    if (editedEmployee) {
      setEditedEmployee((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [field]: value,
        },
      }));
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Salary</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell className="font-medium whitespace-nowrap">
              {editedEmployee?.id === employee.id ? (
                <Input
                  value={editedEmployee.data.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              ) : (
                employee.name
              )}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {editedEmployee?.id === employee.id ? (
                <Input
                  value={editedEmployee.data.position || ""}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                />
              ) : (
                employee.position
              )}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {editedEmployee?.id === employee.id ? (
                <Input
                  type="number"
                  value={editedEmployee.data.salary || 0}
                  onChange={(e) =>
                    handleInputChange("salary", parseFloat(e.target.value || "0"))
                  }
                />
              ) : (
                `Rp ${employee.salary.toLocaleString()}`
              )}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {editedEmployee?.id === employee.id ? (
                <Input
                  value={editedEmployee.data.status || ""}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                />
              ) : (
                employee.status
              )}
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
              {editedEmployee?.id === employee.id ? (
                <>
                  <Button variant="ghost" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="ghost" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => onView(employee)}>
                    View Details
                  </Button>
                  <Button variant="ghost" onClick={() => handleEdit(employee)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onDelete(employee)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
