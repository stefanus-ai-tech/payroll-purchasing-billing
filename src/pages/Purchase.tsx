import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePurchaseRequests } from "@/hooks/usePurchaseRequests";
import { PurchaseTable } from "@/components/purchase/PurchaseTable";
import { PurchaseRequestDialogs } from "@/components/purchase/PurchaseRequestDialogs";
import { PurchaseRequest } from "@/types/purchase";

export default function Purchase() {
  const {
    requests,
    isLoading,
    createRequest,
    updateStatus,
    deletePurchaseRequest,
  } = usePurchaseRequests();

  const [selectedRequest, setSelectedRequest] =
    useState<PurchaseRequest | null>(null);
  const [purchaseToDelete, setPurchaseToDelete] =
    useState<PurchaseRequest | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
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
      <div className="space-y-4 my-4">
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
        deletePurchaseRequest={deletePurchaseRequest.mutate}
        selectedRequest={
          selectedRequest
            ? {
                ...selectedRequest,
                no_urut: selectedRequest.no_urut.toString(),
              }
            : null
        }
        purchaseToDelete={purchaseToDelete}
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        isViewOpen={isViewOpen}
        setIsViewOpen={setIsViewOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
      />
    </MainLayout>
  );
}
