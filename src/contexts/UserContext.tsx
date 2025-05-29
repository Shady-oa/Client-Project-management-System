
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'company' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
  avatar?: string;
  permissions: string[];
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string, name?: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAdmin: boolean;
  isCompany: boolean;
  isClient: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, name?: string) => {
    // Email-based role detection
    let role: UserRole;
    let companyId: string | undefined;
    let companyName: string | undefined;
    let userName: string;

    if (email === 'admin@gmail.com' && password === 'admin123') {
      role = 'admin';
      userName = name || 'System Administrator';
      companyName = 'ProjectHub Admin';
    } else if (email === 'company@gmail.com' && password === 'company123') {
      role = 'company';
      companyId = 'acme-corp';
      companyName = name || 'Acme Corporation';
      userName = name || 'Company Manager';
    } else if (email === 'client@gmail.com' && password === 'client123') {
      role = 'client';
      companyId = 'client-company';
      companyName = name || 'Client Company';
      userName = name || 'Client User';
    } else {
      // Invalid credentials
      return false;
    }

    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userName,
      email,
      role,
      companyId,
      companyName,
      permissions: role === 'admin' ? ['read', 'write', 'delete', 'manage'] : 
                  role === 'company' ? ['read', 'write', 'manage-team'] : 
                  ['read']
    };

    setUser(userData);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userRole", role);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      if (role === 'company') {
        updatedUser.companyId = 'acme-corp';
        updatedUser.companyName = 'Acme Corp';
      } else if (role === 'client') {
        updatedUser.companyId = 'client-company';
        updatedUser.companyName = 'Client Company';
      }
      setUser(updatedUser);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isCompany = user?.role === 'company';
  const isClient = user?.role === 'client';

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        switchRole,
        isAdmin,
        isCompany,
        isClient,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
