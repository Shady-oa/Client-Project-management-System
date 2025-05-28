
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Building2, User } from "lucide-react";
import { useUser, UserRole } from "@/contexts/UserContext";

const RoleSwitcher = () => {
  const { user, switchRole } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { value: 'admin', label: 'System Admin', icon: Shield, color: 'text-red-600' },
    { value: 'company', label: 'Company Manager', icon: Building2, color: 'text-blue-600' },
    { value: 'client', label: 'Client User', icon: User, color: 'text-green-600' }
  ];

  const currentRole = roles.find(role => role.value === user?.role);

  const handleRoleChange = (newRole: string) => {
    switchRole(newRole as UserRole);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-sm border border-emerald-200 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Current Role:</span>
        </div>
        <Select value={user?.role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-48 border-emerald-300">
            <div className="flex items-center gap-2">
              {currentRole && (
                <>
                  <currentRole.icon className={`w-4 h-4 ${currentRole.color}`} />
                  <SelectValue />
                </>
              )}
            </div>
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                <div className="flex items-center gap-2">
                  <role.icon className={`w-4 h-4 ${role.color}`} />
                  {role.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RoleSwitcher;
