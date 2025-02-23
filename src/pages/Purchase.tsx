import React, { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePurchaseRequests } from "@/hooks/usePurchaseRequests";
import { PurchaseTable } from "@/components/purchase/PurchaseTable";
import { PurchaseRequestDialogs } from "@/components/purchase/PurchaseRequestDialogs";

export type PurchaseRequest = {
  id: string;
  request_id: string;
  requester: string;
  items: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
  no_urut: number;
};

export default function Purchase() {
  const {
    requests,
    isLoading,
    createRequest,
    updateStatus,
    editPurchaseRequest,
    deletePurchaseRequest
  } = usePurchaseRequests();

  const [selectedRequest, setSelectedRequest] =
    useState<PurchaseRequest | null>(null);
  const [purchaseToEdit, setPurchaseToEdit] = useState<PurchaseRequest | null>(
    null
  );
  const [purchaseToDelete, setPurchaseToDelete] = useState<PurchaseRequest | null>(
    null
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
      <div className="space-y-4 mt-[60px]">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Purchase Requests
            </h2>
            <p className="text-muted-foreground">
              Manage and track purchase requests
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>New Request</Button>
        </div>

        <Card>
          <CardContent>
            <PurchaseTable
              requests={requests}
              onView={(request) => {
                setSelectedRequest(request);
                setIsViewOpen(true);
              }}
              onEdit={(request) => {
                setPurchaseToEdit(request);
                setIsEditOpen(true);
              }}
              onDelete={(request) => {
                setPurchaseToDelete(request);
                setIsDeleteOpen(true);
              }}
            />
          </CardContent>
        </Card>
      </div>

      <PurchaseRequestDialogs
        createRequest={createRequest.mutate}
        updateStatus={updateStatus.mutate}
        editPurchaseRequest={editPurchaseRequest.mutate}
        deletePurchaseRequest={deletePurchaseRequest.mutate}
        selectedRequest={selectedRequest}
        purchaseToEdit={purchaseToEdit}
        purchaseToDelete={purchaseToDelete}
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        isViewOpen={isViewOpen}
        setIsViewOpen={setIsViewOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        setPurchaseToEdit={(purchase) => {
          setPurchaseToEdit(purchase ? {
            id: purchaseToEdit?.id || "",
            request_id: purchaseToEdit?.request_id || "",
            requester: purchaseToEdit?.requester || "",
            status: purchaseToEdit?.status || "Pending",
            created_at: purchase.created_at,
            no_urut: purchase.no_urut,
            amount: purchase.quantity,
            items: purchase.itemName
          } : null)
        }}
      />
    </MainLayout>
  );
}
