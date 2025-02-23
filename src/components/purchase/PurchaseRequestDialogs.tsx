import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PurchaseRequest } from "@/pages/Purchase";
import { EditPurchaseDialog } from "@/components/purchase/EditPurchaseDialog";
import { DeletePurchaseDialog } from "@/components/purchase/DeletePurchaseDialog";
import { CreatePurchaseRequestDialog } from "@/components/purchase/CreatePurchaseRequestDialog";
import { Dispatch, SetStateAction } from "react";

type PurchaseRequestDialogsProps = {
  createRequest: (newRequest: {
    requester: string;
    items: string;
    amount: number;
  }) => void;
  updateStatus: (params: {
    id: string;
    status: "Pending" | "Approved" | "Rejected";
  }) => void;
  editPurchaseRequest: (updatedRequest: PurchaseRequest) => void;
  deletePurchaseRequest: (id: string) => void;
  selectedRequest: PurchaseRequest | null;
  purchaseToEdit: PurchaseRequest | null;
  setPurchaseToEdit: (purchase: {
    itemName: string;
    quantity: number;
    created_at: string;
    no_urut: number;
  } | null) => void;
  purchaseToDelete: PurchaseRequest | null;
  isCreateOpen: boolean;
  setIsCreateOpen: Dispatch<SetStateAction<boolean>>;
  isViewOpen: boolean;
  setIsViewOpen: Dispatch<SetStateAction<boolean>>;
  isEditOpen: boolean;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  isDeleteOpen: boolean;
  setIsDeleteOpen: Dispatch<SetStateAction<boolean>>;
};

export const PurchaseRequestDialogs: React.FC<PurchaseRequestDialogsProps> = ({
  createRequest,
  updateStatus,
  editPurchaseRequest,
  deletePurchaseRequest,
  selectedRequest,
  purchaseToEdit,
  purchaseToDelete,
  isCreateOpen,
  setIsCreateOpen,
  isViewOpen,
  setIsViewOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  setPurchaseToEdit
}) => {
  return (
    <>
      {/* Create Request Dialog */}
      <CreatePurchaseRequestDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={createRequest}
      />

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
                  <Label>No Urut</Label>
                  <p className="font-medium">{selectedRequest.no_urut}</p>
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
                    updateStatus({
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
                    updateStatus({
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
                created_at: purchaseToEdit.created_at,
                no_urut: purchaseToEdit.no_urut,
              }
            : { // Provide a default object when purchaseToEdit is null
                itemName: '',
                quantity: 0,
                created_at: '',
                no_urut: 0
              }
        }
        setEditPurchase={setPurchaseToEdit}
        onSubmit={() => {
          if (purchaseToEdit) {
            editPurchaseRequest(purchaseToEdit);
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
            deletePurchaseRequest(purchaseToDelete.id);
          }
        }}
      />
    </>
  );
};
