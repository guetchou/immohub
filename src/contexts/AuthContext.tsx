import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  console.log("AuthProvider rendered with user:", user);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual authentication
      console.log("Login attempt:", email);
      
      // Simuler un délai d'authentification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a proper UUID for testing
      const mockUUID = "123e4567-e89b-12d3-a456-426614174000";
      
      // Simuler un utilisateur connecté avec un rôle
      const role = email.includes('admin') ? 'ADMIN' as UserRole :
                   email.includes('tenant') ? 'TENANT' as UserRole :
                   email.includes('landlord') ? 'LANDLORD' as UserRole :
                   email.includes('agency') ? 'AGENCY' as UserRole :
                   email.includes('broker') ? 'BROKER' as UserRole :
                   'USER' as UserRole;

      setUser({
        id: mockUUID,
        name: "John Doe",
        email,
        role,
        createdAt: new Date(),
      });

      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${email}`,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};