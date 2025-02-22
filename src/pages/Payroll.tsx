
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Employee = {
  id: string;
  name: string;
  position: string;
  salary: number;
  status: "Pending" | "Processed";
};

export default function Payroll() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [processingAll, setProcessingAll] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    salary: ""
  });

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('employees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employees'
        },
        () => {
          // Invalidate and refetch when we get any changes
          queryClient.invalidateQueries({ queryKey: ['employees'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Fetch employees data
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Employee[];
    }
  });

  // Create employee
  const createEmployee = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("employees")
        .insert({
          name: newEmployee.name,
          position: newEmployee.position,
          salary: parseFloat(newEmployee.salary),
          status: "Pending"
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsCreateOpen(false);
      setNewEmployee({ name: "", position: "", salary: "" });
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add employee: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Process single employee payroll
  const processSinglePayroll = useMutation({
    mutationFn: async (employeeId: string) => {
      const { error } = await supabase
        .from("employees")
        .update({ status: "Processed" })
        .eq("id", employeeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setIsViewOpen(false);
      setSelectedEmployee(null);
      toast({
        title: "Success",
        description: "Payroll processed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process payroll: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Process all pending payrolls
  const processAllPayroll = useMutation({
    mutationFn: async () => {
      setProcessingAll(true);
      const { error } = await supabase
        .from("employees")
        .update({ status: "Processed" })
        .eq("status", "Pending");
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Success",
        description: "All payrolls processed successfully",
      });
      setProcessingAll(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process payrolls: " + error.message,
        variant: "destructive",
      });
      setProcessingAll(false);
    }
  });

  if (isLoading) {
    return <MainLayout>
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </MainLayout>;
  }

  return <MainLayout>
    <div className="space-y-8 animate-fade-up my-[44px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payroll</h2>
          <p className="text-muted-foreground">
            Manage employee salaries and payments
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setIsCreateOpen(true)}>Add Employee</Button>
          <Button 
            onClick={() => processAllPayroll.mutate()}
            disabled={processingAll || !employees.some(e => e.status === "Pending")}
          >
            Process All Pending
          </Button>
        </div>
      </div>

      <div className="overflow-auto">
        <Card className="min-w-full">
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
              {employees.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium whitespace-nowrap">{employee.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{employee.position}</TableCell>
                  <TableCell className="whitespace-nowrap">Rp {employee.salary.toLocaleString()}</TableCell>
                  <TableCell className="whitespace-nowrap">{employee.status}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsViewOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>

    {/* Create Employee Dialog */}
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Employee Name</Label>
            <Input
              id="name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salary (Rp)</Label>
            <Input
              id="salary"
              type="number"
              value={newEmployee.salary}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, salary: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => createEmployee.mutate()}
            disabled={!newEmployee.name || !newEmployee.position || !newEmployee.salary}
          >
            Add Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* View Employee Dialog */}
    <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
        </DialogHeader>
        {selectedEmployee && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <p className="font-medium">{selectedEmployee.name}</p>
              </div>
              <div>
                <Label>Position</Label>
                <p className="font-medium">{selectedEmployee.position}</p>
              </div>
              <div>
                <Label>Salary</Label>
                <p className="font-medium">Rp {selectedEmployee.salary.toLocaleString()}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p className="font-medium">{selectedEmployee.status}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                disabled={selectedEmployee.status === "Processed"}
                onClick={() => processSinglePayroll.mutate(selectedEmployee.id)}
              >
                Process Payroll
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </MainLayout>;
}
