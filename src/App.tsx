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
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import MainLayout from "./components/MainLayout";
import AuthCallbackPage from "@/app/auth/callback/page";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

// Auth callback route (no longer needed with custom auth)
// const AuthCallback = () => { ... };

// Protected route wrapper (modified to check for selectedRole)
const ProtectedRoute = ({
  children,
  selectedRole,
}: {
  children: React.ReactNode;
  selectedRole: string | null;
}) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!selectedRole) {
    return <Navigate to="/role-selection" replace />;
  }

  return <>{children}</>;
};

const RoleSelection = ({
  onRoleSelect,
}: {
  onRoleSelect: (role: string) => void;
}) => {
  const roles = ["Admin", "Manager", "Employee"];

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-center text-3xl font-bold">Select a Role</h2>
        <div className="flex space-x-4">
          {roles.map((role) => (
            <Button key={role} onClick={() => onRoleSelect(role)}>
              {role}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface DashboardProps {
  selectedRole: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedRole }) => {
  return (
    <MainLayout>
      <div className="p-4">
        <h1>Dashboard</h1>
        <p>Welcome! You are logged in as: {selectedRole}</p>
      </div>
    </MainLayout>
  );
};

const App = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const { user } = useUser();

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/role-selection" replace />
                ) : (
                  <Login onLoginSuccess={() => {}} />
                )
              }
            />

            <Route
              path="/role-selection"
              element={
                selectedRole ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <RoleSelection onRoleSelect={handleRoleSelect} />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute selectedRole={selectedRole}>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Dashboard selectedRole={selectedRole} />}
              />
              <Route path="payroll" element={<Payroll />} />
              <Route path="purchase" element={<Purchase />} />
              <Route path="billing" element={<Billing />} />
            </Route>

            <Route
              path="/"
              element={
                selectedRole ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
