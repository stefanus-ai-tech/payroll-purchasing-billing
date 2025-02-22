
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Payroll</h2>
            <p className="text-muted-foreground">
              Manage employee salaries and payments
            </p>
          </div>
          <Button 
            onClick={() => processAllPayroll.mutate()}
            disabled={processingAll || !employees.some(e => e.status === "Pending")}
          >
            Process All Pending
          </Button>
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
                  <TableCell>Rp {employee.salary.toLocaleString()}</TableCell>
                  <TableCell>{employee.status}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost"
                      disabled={employee.status === "Processed" || processSinglePayroll.isPending}
                      onClick={() => processSinglePayroll.mutate(employee.id)}
                    >
                      {employee.status === "Processed" ? "Processed" : "Process Payroll"}
                    </Button>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </Card>
      </div>
    </MainLayout>;
}
