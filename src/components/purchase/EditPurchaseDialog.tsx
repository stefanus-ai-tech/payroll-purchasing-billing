import { useState, useEffect } from "react";
import { EditDialog } from "@/components/ui/edit-dialog";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const to24Hour = (time12: string | undefined): string => {
  if (!time12) return "";

  // Check if it's already in 24-hour format
  if (time12.match(/^\d{2}:\d{2}$/)) return time12;

  const [timePart, period] = time12.split(" ");
  if (!timePart || !period) return "";

  let [hours, minutes] = timePart.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return "";

  if (hours === 12) {
    hours = period === "PM" ? 12 : 0;
  } else if (period === "PM") {
    hours += 12;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const to12Hour = (time24: string): string => {
  if (!time24) return "";

  const [hours24, minutes] = time24.split(":").map(Number);
  if (isNaN(hours24) || isNaN(minutes)) return "";

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;

  return `${hours12.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
};

interface PurchaseData {
  itemName: string;
  quantity: number;
  date: Date;
  time: string; // Will always be in 24-hour format "HH:mm"
  no_urut: number;
  created_at?: string;
}

interface EditPurchaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editPurchase: PurchaseData;
  setEditPurchase: (purchase: PurchaseData) => void;
  onSubmit: () => void;
}

const formatDateTimeString = (date: Date): string => {
  try {
    return date.toISOString().slice(0, 16);
  } catch {
    return new Date().toISOString().slice(0, 16);
  }
};

const parseDateTimeString = (
  dateTimeStr: string
): { date: Date; time: string } => {
  const date = new Date(dateTimeStr);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;
  return { date, time };
};

const formatDate = (date: Date): string => {
  try {
    if (!date || isNaN(date.getTime())) {
      return new Date().toISOString().split("T")[0];
    }
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.warn("Error formatting date:", error);
    return new Date().toISOString().split("T")[0];
  }
};

const formatTime = (date: Date): string => {
  try {
    if (!date || isNaN(date.getTime())) {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (error) {
    console.warn("Error formatting time:", error);
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }
};

export const EditPurchaseDialog: React.FC<EditPurchaseDialogProps> = ({
  isOpen,
  onOpenChange,
  editPurchase,
  setEditPurchase,
  onSubmit,
}) => {
  const [localPurchase, setLocalPurchase] = useState(editPurchase);

  useEffect(() => {
    setLocalPurchase(editPurchase);
  }, [editPurchase]);

  const validateField = (
    name: keyof PurchaseData,
    value: any
  ): string | null => {
    switch (name) {
      case "itemName":
        if (!value || value.trim() === "") return "Item name is required";
        if (value.length > 100)
          return "Item name must be less than 100 characters";
        return null;
      case "quantity":
        if (value <= 0) return "Quantity must be greater than 0";
        if (value > 1000000000)
          return "Quantity must be less than 1,000,000,000";
        return null;
      default:
        return null;
    }
  };

  const handleDateTimeChange = (dateTimeStr: string) => {
    try {
      const { date, time } = parseDateTimeString(dateTimeStr);
      if (!isNaN(date.getTime())) {
        setLocalPurchase((prev) => ({
          ...prev,
          date,
          time,
        }));
      }
    } catch (error) {
      console.error("Invalid datetime:", error);
    }
  };

  const handleDateChange = (dateStr: string) => {
    try {
      const newDate = new Date(dateStr);
      if (!isNaN(newDate.getTime())) {
        let currentHours = 0;
        let currentMinutes = 0;

        if (!isNaN(localPurchase.date.getTime())) {
          currentHours = localPurchase.date.getHours();
          currentMinutes = localPurchase.date.getMinutes();
        }

        newDate.setHours(currentHours, currentMinutes, 0, 0);

        setLocalPurchase((prev) => ({
          ...prev,
          date: newDate,
          time: formatTime(newDate),
        }));
      }
    } catch (error) {
      console.error("Invalid date:", error);
    }
  };

  const handleTimeChange = (timeStr: string) => {
    setLocalPurchase((prev) => ({
      ...prev,
      time: to12Hour(timeStr),
    }));
  };

  const handleSubmit = async () => {
    const errors = Object.entries(localPurchase)
      .map(([key, value]) => ({
        field: key,
        error: validateField(key as keyof PurchaseData, value),
      }))
      .filter((result) => result.error !== null);

    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      return;
    }

    try {
      const dateTime = new Date(localPurchase.date);

      const time24 = to24Hour(localPurchase.time);
      if (!time24) {
        throw new Error("Invalid time format");
      }

      const [hours, minutes] = time24.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid time values");
      }

      dateTime.setHours(hours, minutes, 0, 0);

      if (isNaN(dateTime.getTime())) {
        throw new Error("Invalid date/time combination");
      }

      const updatedPurchase = {
        ...localPurchase,
        date: dateTime,
        created_at: dateTime.toISOString(),
      };

      setEditPurchase(updatedPurchase);
      onSubmit();
    } catch (error) {
      console.error("Error processing date/time:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Purchase Request</DialogTitle>
          <DialogDescription>
            Make changes to your purchase request here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={localPurchase.itemName}
                onChange={(e) =>
                  setLocalPurchase((prev) => ({
                    ...prev,
                    itemName: e.target.value,
                  }))
                }
                placeholder="Enter item name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Amount</Label>
              <Input
                id="quantity"
                type="number"
                value={localPurchase.quantity}
                onChange={(e) =>
                  setLocalPurchase((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formatDate(localPurchase.date)}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={localPurchase.time ? to24Hour(localPurchase.time) : ""}
                onChange={(e) => handleTimeChange(e.target.value)}
                step="60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="no_urut">No Urut</Label>
              <Input
                id="no_urut"
                type="number"
                value={localPurchase.no_urut}
                readOnly
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
