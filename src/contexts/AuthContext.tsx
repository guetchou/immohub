
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          }
          
          // Map the user role from profile
          const role = determineUserRole(profileData?.role);
          
          setUser({
            id: session.user.id,
            name: profileData?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: role,
            createdAt: new Date(session.user.created_at || Date.now()),
            full_name: profileData?.full_name,
            phone: profileData?.phone,
            company_name: profileData?.company_name,
            website: profileData?.website,
          });
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (session?.user) {
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }
        
        // Map the user role
        const role = determineUserRole(profileData?.role);
        
        setUser({
          id: session.user.id,
          name: profileData?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: role,
          createdAt: new Date(session.user.created_at || Date.now()),
          full_name: profileData?.full_name,
          phone: profileData?.phone,
          company_name: profileData?.company_name,
          website: profileData?.website,
        });
      } else {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to map database role to UserRole type
  const determineUserRole = (dbRole: string | null): UserRole => {
    if (!dbRole) return 'USER';
    
    // Convert role string to uppercase for matching with UserRole type
    const upperRole = dbRole.toUpperCase();
    
    // Check if the uppercase role matches a valid UserRole value
    if (upperRole === 'ADMIN' || 
        upperRole === 'USER' || 
        upperRole === 'TENANT' || 
        upperRole === 'LANDLORD' ||
        upperRole === 'AGENCY' || 
        upperRole === 'BROKER' || 
        upperRole === 'CANVASSER' || 
        upperRole === 'LAND_OWNER' || 
        upperRole === 'INSURANCE' || 
        upperRole === 'NOTARY') {
      return upperRole as UserRole;
    }
    
    return 'USER'; // Default role
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Login attempt:", email);
      
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error("No user returned from authentication");
      }
      
      // Get or create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile:", profileError);
      }
      
      // Determine the role
      let role: UserRole = 'USER';
      
      if (profileData) {
        role = determineUserRole(profileData.role);
      } else {
        // Create a new profile if it doesn't exist
        const defaultRole = email.includes('admin') ? 'ADMIN' : 
                           email.includes('tenant') ? 'TENANT' : 
                           email.includes('landlord') ? 'LANDLORD' : 
                           email.includes('agency') ? 'AGENCY' : 
                           email.includes('broker') ? 'BROKER' : 'USER';
        
        // Use the determined role string
        const roleString = defaultRole.toLowerCase();
        
        const { error: insertError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            role: roleString,
            full_name: "John Doe",
            status: 'active',
          });
        
        if (insertError) {
          console.error("Error creating profile:", insertError);
        }
        
        role = defaultRole as UserRole;
      }
      
      setUser({
        id: data.user.id,
        name: profileData?.full_name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email || '',
        role,
        createdAt: new Date(data.user.created_at || Date.now()),
        full_name: profileData?.full_name,
        phone: profileData?.phone,
        company_name: profileData?.company_name,
        website: profileData?.website,
      });

      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${data.user.email}`,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
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
