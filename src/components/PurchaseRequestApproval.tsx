import { Button } from "./ui/button";
import { PurchaseRequest, ApprovalSignature } from "@/types/purchase";
import { usePurchaseRequests } from "@/hooks/usePurchaseRequests";
import { useUser } from "@/hooks/useUser";

interface ApprovalProps {
  request: PurchaseRequest;
}

export function PurchaseRequestApproval({ request }: ApprovalProps) {
  const { signRequest } = usePurchaseRequests();
  const { user } = useUser();

  const handleApproval = async (approve: boolean) => {
    if (!user?.id) return;

    let role: ApprovalSignature["role"];

    switch (request.workflow_status) {
      case "pending_validation":
        role = "admin";
        break;
      case "pending_approval_leader":
        role = "approval_leader";
        break;
      case "pending_nom":
        role = "nom";
        break;
      case "pending_sm":
        role = "sm";
        break;
      default:
        return; // No action needed for other statuses
    }

    await signRequest.mutateAsync({
      requestId: request.id,
      userId: user.id,
      role,
      approve,
    });
  };

  // Render buttons only for the correct user and workflow status
  const isAdmin = user?.role === "admin";
  const isApprovalLeader = user?.role === "approval_leader";
  const isNom = user?.role === "nom";
  const isSm = user?.role === "sm";

  if (
    request.workflow_status === "completed" ||
    request.workflow_status === "rejected"
  ) {
    return null;
  }

  if (
    (request.workflow_status === "pending_validation" && isAdmin) ||
    (request.workflow_status === "pending_approval_leader" &&
      isApprovalLeader) ||
    (request.workflow_status === "pending_nom" && isNom) ||
    (request.workflow_status === "pending_sm" && isSm)
  ) {
    return (
      <div className="flex gap-2">
        <Button
          variant="default"
          onClick={() => handleApproval(true)}
          disabled={signRequest.isPending}
        >
          Approve
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleApproval(false)}
          disabled={signRequest.isPending}
        >
          Reject
        </Button>
      </div>
    );
  }

  return null;
}
