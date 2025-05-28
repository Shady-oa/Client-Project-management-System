
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { 
  Briefcase, 
  Users, 
  Archive, 
  Grid, 
  DollarSign, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Shield,
  Building2,
  AlertCircle,
  BarChart3
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, isAdmin, isCompany, isClient } = useUser();

  // Dynamic navigation based on user role
  const getNavigation = () => {
    if (isAdmin) {
      return [
        { name: "Dashboard", href: "/dashboard", icon: Grid },
        { name: "Companies", href: "/admin", icon: Building2 },
        { name: "All Projects", href: "/projects", icon: Briefcase },
        { name: "All Users", href: "/users", icon: Users },
        { name: "System Issues", href: "/issues", icon: AlertCircle },
        { name: "Billing", href: "/billing", icon: DollarSign },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
      ];
    } else if (isCompany) {
      return [
        { name: "Dashboard", href: "/dashboard", icon: Grid },
        { name: "Projects", href: "/projects", icon: Briefcase },
        { name: "Kanban", href: "/kanban", icon: Archive },
        { name: "Team", href: "/users", icon: Users },
        { name: "Issues", href: "/issues", icon: AlertCircle },
        { name: "Billing", href: "/billing", icon: DollarSign },
      ];
    } else if (isClient) {
      return [
        { name: "Dashboard", href: "/dashboard", icon: Grid },
        { name: "My Projects", href: "/projects", icon: Briefcase },
        { name: "Issues", href: "/issues", icon: AlertCircle },
        { name: "Support", href: "/contact", icon: Bell },
      ];
    }
    return [];
  };

  const navigation = getNavigation();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  const getRoleInfo = () => {
    if (isAdmin) return { label: "System Admin", icon: Shield, color: "text-red-600" };
    if (isCompany) return { label: "Company Manager", icon: Building2, color: "text-blue-600" };
    if (isClient) return { label: "Client User", icon: User, color: "text-green-600" };
    return { label: "User", icon: User, color: "text-gray-600" };
  };

  const roleInfo = getRoleInfo();

  return (
    <div className={cn(
      "flex flex-col bg-white/80 backdrop-blur-sm border-r border-emerald-200 transition-all duration-300 shadow-lg",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-emerald-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">ProjectHub</h2>
              <p className="text-xs text-emerald-600">{user?.companyName || "Your Company"}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-emerald-50"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="p-4 border-b border-emerald-100">
          <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-lg">
            <roleInfo.icon className={`w-4 h-4 ${roleInfo.color}`} />
            <span className="text-sm font-medium text-gray-700">{roleInfo.label}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive(item.href)
                  ? "bg-gradient-to-r from-emerald-100 to-amber-100 text-emerald-700 border border-emerald-200 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-emerald-50"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="p-4 border-t border-emerald-200">
          <Card className="p-3 bg-gradient-to-r from-emerald-50 to-amber-50 border-emerald-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">
                  {isAdmin ? "Total Companies" : isCompany ? "Active Projects" : "My Projects"}
                </span>
                <span className="font-semibold text-gray-900">
                  {isAdmin ? "156" : isCompany ? "12" : "3"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">
                  {isAdmin ? "Active Users" : isCompany ? "Team Members" : "Open Issues"}
                </span>
                <span className="font-semibold text-gray-900">
                  {isAdmin ? "2,847" : isCompany ? "18" : "2"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">
                  {isAdmin ? "Support Tickets" : "Open Issues"}
                </span>
                <Badge variant="secondary" className="text-xs h-5">
                  {isAdmin ? "23" : isCompany ? "8" : "1"}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-emerald-200">
        {collapsed ? (
          <Button variant="ghost" size="sm" className="w-full p-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-amber-400 text-white text-xs">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-amber-400 text-white text-sm">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="p-1 hover:bg-emerald-50">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
