import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea

interface EditDialogProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'textarea'; // Include 'textarea' type
  }[];
  editData: T;
  setEditData: (data: T) => void;
  onSubmit: () => void;
}

export function EditDialog<T extends object>({
  isOpen,
  onOpenChange,
  title,
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
        </DialogHeader>
        <div className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={`edit-${field.name}`}>{field.label}</Label>
              {field.type === 'textarea' ? (
                <Textarea // Use Textarea component
                  id={`edit-${field.name}`}
                  value={(editData as any)[field.name]}
                  onChange={(e) => setEditData({ ...editData, [field.name]: e.target.value })}
                />
              ) : (
                <Input
                  id={`edit-${field.name}`}
                  type={field.type}
                  value={(editData as any)[field.name]}
                  onChange={(e) => setEditData({ ...editData, [field.name]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSubmit} disabled={Object.values(editData).some(value => !value)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
