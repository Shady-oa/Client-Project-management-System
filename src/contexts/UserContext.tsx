
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
  login: (user: User) => void;
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
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    permissions: ['read', 'write', 'delete'],
  });

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
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
