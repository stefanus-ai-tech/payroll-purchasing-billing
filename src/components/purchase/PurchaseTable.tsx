import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PurchaseRequest } from "@/pages/Purchase";

type PurchaseTableProps = {
  requests: PurchaseRequest[];
  onView: (request: PurchaseRequest) => void;
  onEdit: (request: PurchaseRequest) => void;
  onDelete: (request: PurchaseRequest) => void;
};

const format12HourTime = (time24: string): string => {
  try {
    const [hours24, minutes] = time24.split(":").map(Number);
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  } catch {
    return time24; // Fallback to original format if parsing fails
  }
};

export const PurchaseTable: React.FC<PurchaseTableProps> = ({
  requests,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No Urut</TableHead>
          <TableHead>Request ID</TableHead>
          <TableHead>Requester</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.no_urut}</TableCell>
            <TableCell className="font-medium">{request.request_id}</TableCell>
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
            <TableCell>
              {new Date(request.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {format12HourTime(
                new Date(request.created_at).toLocaleTimeString([], {
                  hour12: false,
                })
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" onClick={() => onView(request)}>
                View Details
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(request)}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => onDelete(request)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
