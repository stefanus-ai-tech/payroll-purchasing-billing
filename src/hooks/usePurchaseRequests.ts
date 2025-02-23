import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PurchaseRequest } from "@/pages/Purchase";

export const usePurchaseRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch purchase requests
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["purchase_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_requests")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as any as PurchaseRequest[];
    },
  });

  // Create purchase request
  const createRequest = useMutation({
    mutationFn: async (newRequest: {
      requester: string;
      items: string;
      amount: number;
      position: string;
      file: File | null;
    }) => {
      try {
        const requestId = `PR${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`;

        let fileUrl: string | null = null;
        if (newRequest.file) {
          const fileName = `${Date.now()}-${newRequest.file.name}`;
          const filePath = `${requestId}/${fileName}`;

          // Check file size and type before upload
          if (newRequest.file.size > 5 * 1024 * 1024) {
            // 5MB limit
            throw new Error("File size exceeds 5MB limit");
          }

          // Upload file with proper content type
          const { error: uploadError } = await supabase.storage
            .from("purchase-requests")
            .upload(filePath, newRequest.file, {
              contentType: newRequest.file.type,
              upsert: false,
            });

          if (uploadError) {
            console.error("Upload error:", uploadError);
            throw new Error(`File upload failed: ${uploadError.message}`);
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from("purchase-requests").getPublicUrl(filePath);

          fileUrl = publicUrl;
        }

        // Get the latest no_urut in a transaction
        const { data: latestRequests, error: latestError } = await supabase
          .from("purchase_requests")
          .select("no_urut")
          .order("no_urut", { ascending: false })
          .limit(1);

        if (latestError) throw latestError;

        const nextNoUrut = (latestRequests?.[0]?.no_urut ?? 0) + 1;

        // Insert the new request
        const { error: insertError } = await supabase
          .from("purchase_requests")
          .insert({
            request_id: requestId,
            requester: newRequest.requester,
            items: newRequest.items,
            amount: newRequest.amount,
            position: newRequest.position,
            status: "Pending",
            no_urut: nextNoUrut,
            file_url: fileUrl,
          });

        if (insertError) {
          if (fileUrl) {
            const filePath = fileUrl.split("/").slice(-2).join("/");
            await supabase.storage.from("purchase-requests").remove([filePath]);
          }
          throw insertError;
        }
      } catch (error: any) {
        console.error("Error in createRequest:", error);
        throw new Error(error.message || "Failed to create purchase request");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase_requests"] });
      toast({
        title: "Success",
        description: "Purchase request created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create request: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Update request status
  const updateStatus = useMutation({
    mutationFn: async (params: {
      id: string;
      status: "Pending" | "Approved" | "Rejected";
    }) => {
      const { error } = await supabase
        .from("purchase_requests")
        .update({ status: params.status })
        .eq("id", params.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase_requests"] });
      toast({
        title: "Success",
        description: "Request status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update request: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Edit purchase request
  const editPurchaseRequest = useMutation({
    mutationFn: async (updatedRequest: PurchaseRequest) => {
      const { error } = await supabase
        .from("purchase_requests")
        .update({
          requester: updatedRequest.requester,
          items: updatedRequest.items,
          amount: updatedRequest.amount,
          no_urut: updatedRequest.no_urut,
          status: updatedRequest.status,
        })
        .eq("id", updatedRequest.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase_requests"] });
      // Log the requests after invalidation
      console.log(
        "Requests after update:",
        queryClient.getQueryData(["purchase_requests"])
      );
      toast({
        title: "Success",
        description: "Purchase request updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update purchase request: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Delete purchase request
  const deletePurchaseRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from("purchase_requests")
        .delete()
        .eq("id", requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase_requests"] });
      toast({
        title: "Success",
        description: "Purchase request deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete purchase request: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    requests,
    isLoading,
    createRequest,
    updateStatus,
    editPurchaseRequest,
    deletePurchaseRequest,
  };
};
