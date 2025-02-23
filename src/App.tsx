import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Index from "./pages/Index";
import Payroll from "./pages/Payroll";
import Purchase from "./pages/Purchase";
import Billing from "./pages/Billing";
import NotFound from "./pages/NotFound";
import { Login } from "./components/Login"; // Import Login component
import { useUser } from "./hooks/useUser";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import MainLayout from "./components/MainLayout";
import { Dashboard } from "@/components/Dashboard";
import AuthCallbackPage from "@/app/auth/callback/page";

const queryClient = new QueryClient();

// Auth callback route
const AuthCallback = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;
        if (session) {
          window.location.replace("/");
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
        window.location.replace("/login");
      }
    };

    handleAuthCallback();
  }, []);

  return <div>Loading...</div>;
};

// Protected route wrapper
const ProtectedRoute = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Dashboard and protected routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Index />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="purchase" element={<Purchase />} />
            <Route path="billing" element={<Billing />} />
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
