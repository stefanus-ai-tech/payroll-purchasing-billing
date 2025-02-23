"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session directly
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          // If we have a session, redirect to dashboard
          navigate("/dashboard", { replace: true });
        } else {
          // If no session, go back to login
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Error during auth callback:", error);
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Signing you in...</h2>
        <p className="text-gray-500">Please wait while we authenticate you.</p>
      </div>
    </div>
  );
}
