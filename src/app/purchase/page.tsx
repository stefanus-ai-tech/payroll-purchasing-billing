import React, { useState, useEffect } from "react";
import PurchaseTable from "./PurchaseTable";
import AddPurchaseDialog from "./AddPurchaseDialog";
import EditPurchaseDialog from "./EditPurchaseDialog";

const MainPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPurchase, setEditPurchase] = useState(null);

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

  const handleEditSubmit = async () => {
    if (!editPurchase) return;

    try {
      // Format the data properly before sending
      const dataToUpdate = {
        itemName: editPurchase.itemName,
        quantity: editPurchase.quantity,
        created_at: new Date(editPurchase.date)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        // Add other fields as needed
      };

      const response = await fetch(`/api/purchases/${editPurchase.no_urut}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update purchase");
      }

      await loadPurchases(); // Reload the data
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating purchase:", error);
      // Add error notification here if you want
    }
  };

  return (
    <div>
      <h1>Purchase Management</h1>
      <button onClick={() => setAddDialogOpen(true)}>Add Purchase</button>
      <PurchaseTable
        purchases={purchases}
        onEdit={(purchase) => {
          setEditPurchase(purchase);
          setEditDialogOpen(true);
        }}
      />
      <AddPurchaseDialog
        isOpen={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddSubmit}
      />
      <EditPurchaseDialog
        isOpen={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editPurchase={editPurchase}
        setEditPurchase={setEditPurchase}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default MainPage;
