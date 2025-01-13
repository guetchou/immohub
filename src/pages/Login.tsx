import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { toast } = useToast();
  
  // Utiliser notre nouveau hook de redirection
  useRoleRedirect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      console.log("Login successful for:", email);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur ImmoHub Congo",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants et réessayez",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="mt-2 text-sm text-gray-600">
            Accédez à votre compte ImmoHub Congo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>

          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>

        <div className="text-center text-sm">
          <a href="#" className="text-real-primary hover:underline">
            Mot de passe oublié ?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;