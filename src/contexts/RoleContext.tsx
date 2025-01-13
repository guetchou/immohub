import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { UserRole } from "@/types/user";

interface RoleContextType {
  hasRole: (roles: UserRole[]) => boolean;
  currentRole: UserRole | null;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const hasRole = (roles: UserRole[]) => {
    if (!user?.role) return false;
    return roles.includes(user.role as UserRole);
  };

  const value = {
    hasRole,
    currentRole: user?.role as UserRole || null,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};