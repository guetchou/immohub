
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";
import { Link } from "react-router-dom";
import { NavBar } from "@/components/navigation/NavBar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  
  // Use our role redirect hook
  useRoleRedirect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Login attempt with:", email);
      await login(email, password);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur ImmoHub Congo",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      // Error is already handled in login function, no need to display another toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Connexion</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Accédez à votre compte ImmoHub Congo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-real-primary hover:bg-real-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <div className="text-center text-sm space-y-4">
            <div>
              <a href="#" className="text-real-primary hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Pas encore de compte ?</span>{" "}
              <Link to="/register" className="text-real-primary hover:underline">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
