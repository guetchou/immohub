import { RoleManager } from "@/components/role/RoleManager";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Building, Home, MessageSquare, Settings, User } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const menuItems = [
    {
      title: "Mes propriétés",
      icon: Building,
      link: "/properties",
      description: "Gérer vos biens immobiliers",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      link: "/messages",
      description: "Voir vos conversations",
    },
    {
      title: "Profil",
      icon: User,
      link: "/profile",
      description: "Modifier vos informations",
    },
    {
      title: "Paramètres",
      icon: Settings,
      link: "/settings",
      description: "Gérer vos préférences",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <Button asChild>
          <Link to="/properties/new">
            <Home className="mr-2 h-4 w-4" />
            Ajouter un bien
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {menuItems.map((item, index) => (
          <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
            <Link to={item.link} className="space-y-3">
              <div className="flex items-center space-x-2">
                <item.icon className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </Link>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <RoleManager />
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Nouvelle visite programmée</p>
                <p className="text-sm text-gray-600">Pour la propriété: Villa Moderne</p>
              </div>
              <span className="text-sm text-gray-500">Il y a 2 heures</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Message reçu</p>
                <p className="text-sm text-gray-600">De: Jean Dupont</p>
              </div>
              <span className="text-sm text-gray-500">Il y a 1 jour</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Contrat signé</p>
                <p className="text-sm text-gray-600">Location: Appartement Centre-ville</p>
              </div>
              <span className="text-sm text-gray-500">Il y a 3 jours</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;