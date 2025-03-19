
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { authAPI } from "@/services/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  console.log("AuthProvider rendered with user:", user);

  // Charger l'utilisateur depuis le stockage local au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erreur lors de la lecture du profil utilisateur:", error);
        localStorage.removeItem('user');
      }
    }

    // Vérifier le token et obtenir les données utilisateur du serveur
    const checkAuthState = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const { data } = await authAPI.getCurrentUser();
          if (data.user) {
            const userData = {
              id: data.user.id,
              name: data.user.fullName,
              email: data.user.email,
              role: data.user.role.toUpperCase() as UserRole,
              createdAt: new Date(data.user.createdAt),
              full_name: data.user.fullName,
              phone: data.user.phone,
              company_name: data.user.company_name,
              website: data.user.website,
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'état de l'authentification:", error);
        // Si erreur, déconnecter l'utilisateur
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Tentative de connexion:", email);
      
      const { data } = await authAPI.login(email, password);
      
      // Stocker le token
      localStorage.setItem('authToken', data.token);
      
      // Créer l'objet utilisateur
      const userData: User = {
        id: data.user.id,
        name: data.user.fullName,
        email: data.user.email,
        role: data.user.role.toUpperCase() as UserRole,
        createdAt: new Date(),
        full_name: data.user.fullName,
        phone: data.user.phone,
        company_name: data.user.company_name,
        website: data.user.website,
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${data.user.fullName}`,
      });
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast({
        title: "Erreur de connexion",
        description: error.response?.data?.message || "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      authAPI.logout();
      setUser(null);
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error("Erreur de déconnexion:", error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

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
