
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  User
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Grid },
    { name: "Projects", href: "/projects", icon: Briefcase },
    { name: "Kanban", href: "/kanban", icon: Archive },
    { name: "Issues", href: "/issues", icon: Archive },
    { name: "Users", href: "/users", icon: Users },
    { name: "Billing", href: "/billing", icon: DollarSign },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">ProjectHub</h2>
              <p className="text-xs text-gray-500">Acme Corp</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-2"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
        <div className="p-4 border-t border-gray-200">
          <Card className="p-3 bg-gray-50 border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Active Projects</span>
                <span className="font-semibold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Team Members</span>
                <span className="font-semibold text-gray-900">18</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Open Issues</span>
                <Badge variant="secondary" className="text-xs h-5">
                  23
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        {collapsed ? (
          <Button variant="ghost" size="sm" className="w-full p-2">
            <User className="w-5 h-5" />
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                John Doe
              </p>
              <p className="text-xs text-gray-500 truncate">
                Admin
              </p>
            </div>
            <Button variant="ghost" size="sm" className="p-1">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
