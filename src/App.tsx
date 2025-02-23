
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

const queryClient = new QueryClient();

// Auth callback route
const AuthCallback = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error in auth callback:", error);
        // Handle error (e.g., redirect to an error page)
      } else if (session) {
        // Redirect to home page after successful login
        window.location.href = "/";
      }
    };

    handleAuthCallback();
  }, []);

  return <div>Loading...</div>; // Or a loading spinner
};

// Protected route wrapper
const ProtectedRoute = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* Wrap routes that require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout><Index /></MainLayout>} />
            <Route path="/payroll" element={<MainLayout><Payroll /></MainLayout>} />
            <Route path="/purchase" element={<MainLayout><Purchase /></MainLayout>} />
            <Route path="/billing" element={<MainLayout><Billing /></MainLayout>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
