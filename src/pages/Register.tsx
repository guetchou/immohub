import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { UserRole } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER" as UserRole,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const roles = [
    { value: "USER", label: "Utilisateur" },
    { value: "TENANT", label: "Locataire" },
    { value: "OWNER", label: "Propriétaire" },
    { value: "AGENCY", label: "Agence immobilière" },
    { value: "BROKER", label: "Démarcheur/Courtier" },
    { value: "LAND_OWNER", label: "Propriétaire terrain" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration attempt with:", formData);
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate registration success
      await login(formData.email, formData.password);
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur ImmoHub Congo",
      });
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="mt-2 text-sm text-gray-600">
            Rejoignez ImmoHub Congo aujourd'hui
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Type de compte</Label>
            <RadioGroup
              defaultValue={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              className="grid grid-cols-2 gap-4"
            >
              {roles.map((role) => (
                <div key={role.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={role.value} id={role.value} />
                  <Label htmlFor={role.value}>{role.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full">
            S'inscrire
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Déjà membre ?</span>{" "}
          <Link to="/login" className="text-real-primary hover:underline">
            Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;