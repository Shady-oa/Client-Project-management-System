
import { useUser } from "@/contexts/UserContext";
import AdminDashboard from "@/pages/AdminDashboard";
import CompanyDashboard from "@/pages/CompanyDashboard";
import ClientDashboard from "@/pages/ClientDashboard";
import Dashboard from "@/pages/Dashboard";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardRouter = () => {
  const { user, isAdmin, isCompany, isClient } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Auto-redirect based on role and current path
    if (user && location.pathname === "/dashboard") {
      if (isAdmin && !location.pathname.includes("/admin")) {
        // Admin can stay on general dashboard or go to admin dashboard
        return;
      }
      if (isCompany && !location.pathname.includes("/company")) {
        // Company stays on company dashboard
        return;
      }
      if (isClient && !location.pathname.includes("/client")) {
        // Client stays on client dashboard
        return;
      }
    }
  }, [user, isAdmin, isCompany, isClient, location.pathname, navigate]);

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
