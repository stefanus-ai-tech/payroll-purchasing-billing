import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const employees = [{
  id: 1,
  name: "John Doe",
  position: "Software Engineer",
  salary: "Rp 15,000,000",
  status: "Pending"
}, {
  id: 2,
  name: "Jane Smith",
  position: "Marketing Manager",
  salary: "Rp 12,000,000",
  status: "Processed"
}, {
  id: 3,
  name: "Mike Johnson",
  position: "Sales Executive",
  salary: "Rp 8,000,000",
  status: "Pending"
}];
export default function Payroll() {
  return <MainLayout>
      <div className="space-y-8 animate-fade-up my-[44px]">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Payroll</h2>
            <p className="text-muted-foreground">
              Manage employee salaries and payments
            </p>
          </div>
          <Button>Process Payroll</Button>
        </div>

        <Card>
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
              {employees.map(employee => <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.salary}</TableCell>
                  <TableCell>{employee.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost">View Details</Button>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </Card>
      </div>
    </MainLayout>;
}