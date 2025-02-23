import { Outlet } from "react-router-dom";
import MainLayout from "./MainLayout";
import { useUser } from "@/hooks/useUser";

export const Dashboard = () => {
    const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
