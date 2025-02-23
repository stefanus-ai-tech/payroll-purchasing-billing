import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import React from "react";

interface EditDialogProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string; // Optional description
  fields: {
    name: string;
    label: string;
    type: "text" | "number" | "date" | "textarea" | "custom";
    component?: React.ComponentType<any>;
    placeholder?: string
  }[];
  editData: T;
  setEditData: (data: T) => void;
  onSubmit: () => void;
}

export function EditDialog<T extends object>({
  isOpen,
  onOpenChange,
  title,
  description,
  fields,
  editData,
  setEditData,
  onSubmit,
}: EditDialogProps<T>) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={`edit-${field.name}`}>{field.label}</Label>
              {field.component ? (
                <field.component
                  id={`edit-${field.name}`}
                  value={(editData as any)[field.name]}
                  onChange={(e) => {
                    // Check if 'e' is a Date object (from Calendar)
                    if (e instanceof Date) {
                      setEditData({ ...editData, [field.name]: e });
                    } else if (typeof e === 'string') {
                      // if e is string, pass directly (likely from timepicker)
                      setEditData({ ...editData, [field.name]: e });
                    }
                    else {
                      // For other custom components, assume they pass the value directly in onChange
                      setEditData({ ...editData, [field.name]: e.target.value });
                    }
                  }}
                  placeholder={field.placeholder}
                />
              ) : field.type === "textarea" ? (
                <Textarea
                  id={`edit-${field.name}`}
                  value={(editData as any)[field.name]}
                  onChange={(e) =>
                    setEditData({ ...editData, [field.name]: e.target.value })
                  }
                  placeholder={field.placeholder}
                />
              ) : (
                <Input
                  id={`edit-${field.name}`}
                  type={field.type}
                  value={(editData as any)[field.name]}
                  onChange={(e) =>
                    setEditData({ ...editData, [field.name]: e.target.value })
                  }
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={Object.values(editData).some((value) => !value)}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
