import React, { useState, useEffect } from "react";
import { CreatePurchaseRequestDialog } from "../../components/purchase/CreatePurchaseRequestDialog";
import { PurchaseRequestDialogs } from "../../components/purchase/PurchaseRequestDialogs";
import { PurchaseRequestApproval } from "@/components/PurchaseRequestApproval";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Purchase {
  id: number;
  no_urut: number;
  itemName: string;
  quantity: number;
  date: string;
  workflow_status: string;
}

interface PurchaseTableProps {
  purchases: Purchase[];
  onEdit: (purchase: Purchase) => void;
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ purchases, onEdit }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Item Name</th>
          <th>Quantity</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {purchases.map((purchase) => (
          <tr key={purchase.id}>
            <td>{purchase.no_urut}</td>
            <td>{purchase.itemName}</td>
            <td>{purchase.quantity}</td>
            <td>{purchase.date}</td>
            <td>
              <button onClick={() => onEdit(purchase)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const MainPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const loadPurchases = async () => {
    try {
      const response = await fetch("/api/purchases");
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      console.error("Error loading purchases:", error);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const handleAddSubmit = async (newPurchase) => {
    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPurchase),
      });

      if (!response.ok) throw new Error("Failed to add purchase");

      // Refresh the data after successful addition
      loadPurchases();
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding purchase:", error);
    }
  };

  const handleView = (purchase) => {
    setSelectedPurchase(purchase);
    setViewDialogOpen(true);
  };

  return (
    <div>
      <h1>Purchase Management</h1>
      <button onClick={() => setAddDialogOpen(true)}>Add Purchase</button>
      <PurchaseTable
        purchases={purchases}
        onEdit={(purchase) => {
          setSelectedPurchase(purchase);
          setViewDialogOpen(true);
        }}
      />
      <CreatePurchaseRequestDialog
        isOpen={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onCreate={handleAddSubmit}
      />
      <PurchaseRequestDialogs
        isCreateOpen={addDialogOpen}
        setIsCreateOpen={setAddDialogOpen}
        isViewOpen={viewDialogOpen}
        setIsViewOpen={setViewDialogOpen}
        selectedRequest={selectedPurchase}
        isDeleteOpen={false} //Not using delete functionality
        setIsDeleteOpen={() => {}} //Not using delete functionality
        createRequest={handleAddSubmit}
        updateStatus={() => {}} // No update functionality
        deletePurchaseRequest={() => {}} // No delete functionality
        purchaseToDelete={null} // No delete functionality
      />
      <Table>
        <TableHeader>{/* Add your table headers here */}</TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              {/* Add your table cells here */}
              <TableCell>
                <div className="space-y-2">
                  <div>Status: {purchase.workflow_status}</div>
                  <PurchaseRequestApproval request={purchase} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          ;
        </TableBody>
      </Table>
    </div>
  );
};

export default MainPage;
