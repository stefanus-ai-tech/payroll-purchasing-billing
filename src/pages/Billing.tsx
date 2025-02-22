
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Invoice = {
  id: string;
  invoice_id: string;
  client: string;
  amount: number;
  due_date: string;
  status: "Pending" | "Paid" | "Overdue";
};

export default function Billing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    amount: "",
    due_date: ""
  });

  // Fetch invoices
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    }
  });

  // Create invoice
  const createInvoice = useMutation({
    mutationFn: async () => {
      // Generate invoice ID (simple format for demo)
      const invoiceId = `INV${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const { error } = await supabase
        .from("invoices")
        .insert({
          invoice_id: invoiceId,
          client: newInvoice.client,
          amount: parseFloat(newInvoice.amount),
          due_date: newInvoice.due_date,
          status: "Pending"
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setIsCreateOpen(false);
      setNewInvoice({ client: "", amount: "", due_date: "" });
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create invoice: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Update invoice status
  const updateStatus = useMutation({
    mutationFn: async (params: { id: string; status: "Pending" | "Paid" | "Overdue" }) => {
      const { error } = await supabase
        .from("invoices")
        .update({ status: params.status })
        .eq("id", params.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setIsViewOpen(false);
      setSelectedInvoice(null);
      toast({
        title: "Success",
        description: "Invoice status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update invoice: " + error.message,
        variant: "destructive",
      });
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
          <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
          <p className="text-muted-foreground">
            Manage invoices and payment tracking
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>Create Invoice</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(invoice => <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.invoice_id}</TableCell>
              <TableCell>{invoice.client}</TableCell>
              <TableCell>Rp {invoice.amount.toLocaleString()}</TableCell>
              <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={invoice.status === "Paid" ? "default" : invoice.status === "Overdue" ? "destructive" : "secondary"}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" onClick={() => {
                  setSelectedInvoice(invoice);
                  setIsViewOpen(true);
                }}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </Card>
    </div>

    {/* Create Invoice Dialog */}
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client Name</Label>
            <Input
              id="client"
              value={newInvoice.client}
              onChange={(e) => setNewInvoice(prev => ({ ...prev, client: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Rp)</Label>
            <Input
              id="amount"
              type="number"
              value={newInvoice.amount}
              onChange={(e) => setNewInvoice(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={newInvoice.due_date}
              onChange={(e) => setNewInvoice(prev => ({ ...prev, due_date: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => createInvoice.mutate()}
            disabled={!newInvoice.client || !newInvoice.amount || !newInvoice.due_date}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* View Invoice Dialog */}
    <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>
        {selectedInvoice && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Invoice ID</Label>
                <p className="font-medium">{selectedInvoice.invoice_id}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge className="mt-1" variant={selectedInvoice.status === "Paid" ? "default" : selectedInvoice.status === "Overdue" ? "destructive" : "secondary"}>
                  {selectedInvoice.status}
                </Badge>
              </div>
              <div>
                <Label>Client</Label>
                <p className="font-medium">{selectedInvoice.client}</p>
              </div>
              <div>
                <Label>Amount</Label>
                <p className="font-medium">Rp {selectedInvoice.amount.toLocaleString()}</p>
              </div>
              <div>
                <Label>Due Date</Label>
                <p className="font-medium">{new Date(selectedInvoice.due_date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant={selectedInvoice.status === "Pending" ? "default" : "outline"}
                disabled={selectedInvoice.status === "Paid"}
                onClick={() => updateStatus.mutate({ id: selectedInvoice.id, status: "Paid" })}
              >
                Mark as Paid
              </Button>
              <Button
                variant={selectedInvoice.status === "Overdue" ? "destructive" : "outline"}
                disabled={selectedInvoice.status === "Paid"}
                onClick={() => updateStatus.mutate({ id: selectedInvoice.id, status: "Overdue" })}
              >
                Mark as Overdue
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </MainLayout>;
}
