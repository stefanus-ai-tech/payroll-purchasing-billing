import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

export function Login() {
  const { user } = useUser();

  if (user) {
    // Redirect to home page if user is already logged in
    return <Navigate to="/" replace />;
  }

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={["google"]} // Add other providers if needed
      redirectTo={`${window.location.origin}/auth/callback`}
    />
  );
}
