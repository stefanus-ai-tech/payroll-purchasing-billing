import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EditPurchaseDialog } from "@/components/purchase/EditPurchaseDialog";
import { DeletePurchaseDialog } from "@/components/purchase/DeletePurchaseDialog";

type PurchaseRequest = {
  id: string;
  request_id: string;
  requester: string;
  items: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  requestDate?: string;
};

export default function Purchase() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<PurchaseRequest | null>(null);
  const [purchaseToEdit, setPurchaseToEdit] = useState<PurchaseRequest | null>(
    null
  );
  const [purchaseToDelete, setPurchaseToDelete] =
    useState<PurchaseRequest | null>(null);
  const [newRequest, setNewRequest] = useState({
    requester: "",
    items: "",
    amount: 0,
  });

    // Fetch requestDate when the edit dialog is opened
  useEffect(() => {
    if (isEditOpen && purchaseToEdit) {
      const fetchRequestDate = async () => {
        const { data, error } = await supabase
          .from('purchase_requests')
          .select('created_at')
          .eq('id', purchaseToEdit.id)
          .single();

        if (error) {
          console.error("Error fetching request date:", error);
        }

        if (data) {
          setPurchaseToEdit((prev) => ({ ...prev, requestDate: data.created_at }));
        }
      };

      fetchRequestDate();
    }
  }, [isEditOpen, purchaseToEdit]);

  // Fetch purchase requests
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["purchase_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PurchaseRequest[];
    },
  });

  // Create purchase request
  const createRequest = useMutation({
    mutationFn: async () => {
      // Generate request ID
      const requestId = `PR${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`;

      const { error } = await supabase.from("purchase_requests").insert({
        request_id: requestId,
        requester: newRequest.requester,
        items: newRequest.items,
        amount: newRequest.amount,
        status: "Pending",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase_requests"] });
      setIsCreateOpen(false);
      setNewRequest({ requester: "", items: "", amount: 0 });
      toast({
        title: "Success",
        description: "Purchase request created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create request: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Update request status
  const updateStatus = useMutation({
    mutationFn: async (params: {
      id: string;
      status: "Pending" | "Approved" | "Rejected";
    }) => {
      const { error } = await supabase
        .from("purchase_requests")
        .update({ status: params.status })
        .eq("id", params.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase_requests"] });
      setIsViewOpen(false);
      setSelectedRequest(null);
      toast({
        title: "Success",
        description: "Request status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update request: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Edit purchase request
  const editPurchaseRequest = useMutation({
    mutationFn: async (updatedRequest: PurchaseRequest) => {
      const { error } = await supabase
        .from("purchase_requests")
        .update({
          requester: updatedRequest.requester,
          items: updatedRequest.items,
          amount: updatedRequest.amount,
          status: "Pending", // or keep existing status?
        })
        .eq("id", updatedRequest.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase_requests"] });
      setIsEditOpen(false);
      setPurchaseToEdit(null);
      toast({
        title: "Success",
        description: "Purchase request updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update purchase request: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Delete purchase request
  const deletePurchaseRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from("purchase_requests")
        .delete()
        .eq("id", requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase_requests"] });
      setIsDeleteOpen(false);
      setPurchaseToDelete(null);
      toast({
        title: "Success",
        description: "Purchase request deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete purchase request: " + error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-up my-[44px]">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Purchase Requests
            </h2>
            <p className="text-muted-foreground">
              Manage and track purchase requests
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>New Request</Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.request_id}
                  </TableCell>
                  <TableCell>{request.requester}</TableCell>
                  <TableCell>{request.items}</TableCell>
                  <TableCell>Rp {request.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "Approved"
                          ? "default"
                          : request.status === "Rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsViewOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setPurchaseToEdit(request);
                        setIsEditOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setPurchaseToDelete(request);
                        setIsDeleteOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Create Request Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Purchase Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="requester">Requester</Label>
              <Input
                id="requester"
                value={newRequest.requester}
                onChange={(e) =>
                  setNewRequest((prev) => ({
                    ...prev,
                    requester: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="items">Items</Label>
              <Textarea
                id="items"
                value={newRequest.items}
                onChange={(e) =>
                  setNewRequest((prev) => ({ ...prev, items: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Rp)</Label>
              <Input
                id="amount"
                type="number"
                value={newRequest.amount}
                onChange={(e) =>
                  setNewRequest((prev) => ({ ...prev, amount: parseFloat(e.target.value || "0") }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createRequest.mutate()}
              disabled={
                !newRequest.requester || !newRequest.items || !newRequest.amount
              }
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Request Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Request ID</Label>
                  <p className="font-medium">{selectedRequest.request_id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge
                    className="mt-1"
                    variant={
                      selectedRequest.status === "Approved"
                        ? "default"
                        : selectedRequest.status === "Rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div>
                  <Label>Requester</Label>
                  <p className="font-medium">{selectedRequest.requester}</p>
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className="font-medium">
                    Rp {selectedRequest.amount.toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label>Items</Label>
                  <p className="font-medium whitespace-pre-wrap">
                    {selectedRequest.items}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant={
                    selectedRequest.status === "Approved"
                      ? "default"
                      : "outline"
                  }
                  disabled={selectedRequest.status !== "Pending"}
                  onClick={() =>
                    updateStatus.mutate({
                      id: selectedRequest.id,
                      status: "Approved",
                    })
                  }
                >
                  Approve
                </Button>
                <Button
                  variant={
                    selectedRequest.status === "Rejected"
                      ? "destructive"
                      : "outline"
                  }
                  disabled={selectedRequest.status !== "Pending"}
                  onClick={() =>
                    updateStatus.mutate({
                      id: selectedRequest.id,
                      status: "Rejected",
                    })
                  }
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Purchase Request Dialog */}
      <EditPurchaseDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        editPurchase={
          purchaseToEdit
            ? {
                itemName: purchaseToEdit.items,
                quantity: purchaseToEdit.amount,
                requestDate: purchaseToEdit.requestDate || "", // Use fetched requestDate
              }
            : { itemName: "", quantity: 0, requestDate: "" }
        }
        setEditPurchase={(updatedPurchase) => {
          if (purchaseToEdit) {
            setPurchaseToEdit({
              ...purchaseToEdit,
              items: updatedPurchase.itemName,
              amount: updatedPurchase.quantity,
              requestDate: updatedPurchase.requestDate,
            });
          }
        }}
        onSubmit={() => {
          if (purchaseToEdit) {
            editPurchaseRequest.mutate(purchaseToEdit);
          }
        }}
      />

      {/* Delete Purchase Request Dialog */}
      <DeletePurchaseDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        purchase={purchaseToDelete}
        onConfirm={() => {
          if (purchaseToDelete) {
            deletePurchaseRequest.mutate(purchaseToDelete.id);
          }
        }}
      />
    </MainLayout>
  );
}
