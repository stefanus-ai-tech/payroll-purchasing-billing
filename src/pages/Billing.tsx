import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateInvoiceDialog } from "@/components/billing/CreateInvoiceDialog";
import { EditInvoiceDialog } from "@/components/billing/EditInvoiceDialog";
import { ViewInvoiceDialog } from "@/components/billing/ViewInvoiceDialog";
import { DeleteInvoiceDialog } from "@/components/billing/DeleteInvoiceDialog";
import { InvoicesTable } from "@/components/billing/InvoicesTable";
import type { Invoice } from "@/types/billing";
export default function Billing() {
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    amount: "",
    due_date: ""
  });
  const [editInvoice, setEditInvoice] = useState({
    client: "",
    amount: "",
    due_date: ""
  });

  // Fetch invoices
  const {
    data: invoices = [],
    isLoading
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("invoices").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data as Invoice[];
    }
  });

  // Create invoice
  const createInvoice = useMutation({
    mutationFn: async () => {
      const invoiceId = `INV${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const {
        error
      } = await supabase.from("invoices").insert({
        invoice_id: invoiceId,
        client: newInvoice.client,
        amount: parseFloat(newInvoice.amount),
        due_date: newInvoice.due_date,
        status: "Pending"
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"]
      });
      setIsCreateOpen(false);
      setNewInvoice({
        client: "",
        amount: "",
        due_date: ""
      });
      toast({
        title: "Success",
        description: "Invoice created successfully"
      });
    },
    onError: error => {
      toast({
        title: "Error",
        description: "Failed to create invoice: " + error.message,
        variant: "destructive"
      });
    }
  });

  // Update invoice
  const updateInvoice = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("invoices").update({
        client: editInvoice.client,
        amount: parseFloat(editInvoice.amount),
        due_date: editInvoice.due_date
      }).eq("id", selectedInvoice?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"]
      });
      setIsEditOpen(false);
      setSelectedInvoice(null);
      setEditInvoice({
        client: "",
        amount: "",
        due_date: ""
      });
      toast({
        title: "Success",
        description: "Invoice updated successfully"
      });
    },
    onError: error => {
      toast({
        title: "Error",
        description: "Failed to update invoice: " + error.message,
        variant: "destructive"
      });
    }
  });

  // Delete invoice
  const deleteInvoice = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("invoices").delete().eq("id", selectedInvoice?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"]
      });
      setIsDeleteOpen(false);
      setSelectedInvoice(null);
      toast({
        title: "Success",
        description: "Invoice deleted successfully"
      });
    },
    onError: error => {
      toast({
        title: "Error",
        description: "Failed to delete invoice: " + error.message,
        variant: "destructive"
      });
    }
  });

  // Update invoice status
  const updateStatus = useMutation({
    mutationFn: async ({
      status
    }: {
      status: "Paid" | "Overdue";
    }) => {
      const {
        error
      } = await supabase.from("invoices").update({
        status
      }).eq("id", selectedInvoice?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"]
      });
      setIsViewOpen(false);
      setSelectedInvoice(null);
      toast({
        title: "Success",
        description: "Invoice status updated successfully"
      });
    },
    onError: error => {
      toast({
        title: "Error",
        description: "Failed to update invoice: " + error.message,
        variant: "destructive"
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
          <Button onClick={() => setIsCreateOpen(true)} className="mx-[34px]">Create Invoice</Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <InvoicesTable invoices={invoices} onView={invoice => {
            setSelectedInvoice(invoice);
            setIsViewOpen(true);
          }} onEdit={invoice => {
            setSelectedInvoice(invoice);
            setEditInvoice({
              client: invoice.client,
              amount: invoice.amount.toString(),
              due_date: invoice.due_date
            });
            setIsEditOpen(true);
          }} onDelete={invoice => {
            setSelectedInvoice(invoice);
            setIsDeleteOpen(true);
          }} />
          </div>
        </Card>
      </div>

      <CreateInvoiceDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} newInvoice={newInvoice} setNewInvoice={setNewInvoice} onSubmit={() => createInvoice.mutate()} />

      <EditInvoiceDialog isOpen={isEditOpen} onOpenChange={setIsEditOpen} editInvoice={editInvoice} setEditInvoice={setEditInvoice} onSubmit={() => updateInvoice.mutate()} />

      <ViewInvoiceDialog isOpen={isViewOpen} onOpenChange={setIsViewOpen} invoice={selectedInvoice} onUpdateStatus={status => updateStatus.mutate({
      status
    })} />

      <DeleteInvoiceDialog isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} invoice={selectedInvoice} onConfirm={() => deleteInvoice.mutate()} />
    </MainLayout>;
}