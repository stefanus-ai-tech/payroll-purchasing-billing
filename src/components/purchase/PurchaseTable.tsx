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
import { PurchaseRequest } from "@/types/purchase";
import { PurchaseRequestApproval } from "../PurchaseRequestApproval";
import { WorkflowStatus } from "@/types/purchase";

type PurchaseTableProps = {
  requests: PurchaseRequest[];
  onView: (request: PurchaseRequest) => void;
  onDelete: (request: PurchaseRequest) => void;
};

export const PurchaseTable: React.FC<PurchaseTableProps> = ({
  requests,
  onView,
  onDelete,
}) => {
  const getWorkflowStatusBadge = (status: WorkflowStatus | undefined) => {
    if (!status) return <Badge variant="secondary">Pending</Badge>;

    const variants: Record<
      WorkflowStatus,
      "secondary" | "destructive" | "default" | "outline"
    > = {
      pending_validation: "secondary",
      pending_approval_leader: "secondary",
      pending_nom: "secondary",
      pending_sm: "secondary",
      completed: "default",
      rejected: "destructive",
    };

    const displayText = status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return <Badge variant={variants[status]}>{displayText}</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No Urut</TableHead>
          <TableHead>Request ID</TableHead>
          <TableHead>Requester</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>File URL</TableHead>
          <TableHead>Workflow Status</TableHead>
          <TableHead>Approvals</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.no_urut}</TableCell>
            <TableCell className="font-medium">{request.request_id}</TableCell>
            <TableCell>{request.requester}</TableCell>
            <TableCell>{request.position}</TableCell>
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
              {new Date(request.created_at).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
                hour12: false,
              })}
            </TableCell>
            <TableCell>
              {request.file_url ? (
                <a
                  href={request.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View File
                </a>
              ) : (
                "No File"
              )}
            </TableCell>
            <TableCell>
              {getWorkflowStatusBadge(request.workflow_status)}
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1 text-xs">
                {request.admin_validated ? (
                  <span>
                    ✓ Admin:{" "}
                    {new Date(request.admin_validated_at!).toLocaleDateString()}
                  </span>
                ) : (
                  <span>✗ Admin</span>
                )}
                {request.approval_leader_signed ? (
                  <span>
                    ✓ Leader:{" "}
                    {new Date(
                      request.approval_leader_signed_at!
                    ).toLocaleDateString()}
                  </span>
                ) : (
                  <span>✗ Leader</span>
                )}
                {request.nom_signed ? (
                  <span>
                    ✓ NOM:{" "}
                    {new Date(request.nom_signed_at!).toLocaleDateString()}
                  </span>
                ) : (
                  <span>✗ NOM</span>
                )}
                {request.sm_signed ? (
                  <span>
                    ✓ SM: {new Date(request.sm_signed_at!).toLocaleDateString()}
                  </span>
                ) : (
                  <span>✗ SM</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <PurchaseRequestApproval request={request} />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" onClick={() => onView(request)}>
                View Details
              </Button>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-700"
                onClick={() => onDelete(request)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
