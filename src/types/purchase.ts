import { Tables } from "@/integrations/supabase/types";

export type WorkflowStatus =
  | "pending_validation"
  | "pending_approval_leader"
  | "pending_nom"
  | "pending_sm"
  | "completed"
  | "rejected";

export type PurchaseRequest = Tables<"purchase_requests"> & {
  admin_validated: boolean;
  admin_validated_at: string | null;
  admin_validator: string | null;
  approval_leader_signed: boolean;
  approval_leader_signed_at: string | null;
  approval_leader_id: string | null;
  nom_signed: boolean;
  nom_signed_at: string | null;
  nom_id: string | null;
  sm_signed: boolean;
  sm_signed_at: string | null;
  sm_id: string | null;
  workflow_status: WorkflowStatus;
  position: string;
  file_url: string | null;
};

export interface ApprovalSignature {
  requestId: string;
  userId: string;
  role: "admin" | "approval_leader" | "nom" | "sm";
  approve: boolean;
}
