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
