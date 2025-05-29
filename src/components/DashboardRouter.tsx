
import { useUser } from "@/contexts/UserContext";
import AdminDashboard from "@/pages/AdminDashboard";
import CompanyDashboard from "@/pages/CompanyDashboard";
import ClientDashboard from "@/pages/ClientDashboard";
import Dashboard from "@/pages/Dashboard";

const DashboardRouter = () => {
  const { user, isAdmin, isCompany, isClient } = useUser();

  if (!user) {
    return <Dashboard />;
  }

  // Role-based dashboard rendering
  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isCompany) {
    return <CompanyDashboard />;
  }

  if (isClient) {
    return <ClientDashboard />;
  }

  return <Dashboard />;
};

export default DashboardRouter;
