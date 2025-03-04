
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Wrench, Search, AlertCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Données factices pour la démo
const mockRequests = [
  {
    id: "1",
    title: "Problème de chauffage",
    property: "Appartement au centre-ville",
    submittedDate: "2023-10-15",
    status: "pending",
    priority: "high"
  },
  {
    id: "2",
    title: "Fuite d'eau dans la salle de bain",
    property: "Villa de luxe avec piscine",
    submittedDate: "2023-11-22",
    status: "in_progress",
    priority: "medium"
  },
  {
    id: "3",
    title: "Serrure cassée sur la porte d'entrée",
    property: "Studio près de l'université",
    submittedDate: "2023-12-10",
    status: "resolved",
    priority: "high"
  }
];

const MaintenanceRequestsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests] = useState(mockRequests);

  const filteredRequests = requests.filter(request => 
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.priority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-blue-500">Basse</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Moyenne</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">Haute</Badge>;
      case 'emergency':
        return <Badge className="bg-red-500">Urgence</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">En cours</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Résolu</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const viewDetails = (id: string) => {
    console.log("View details for request", id);
    // Fonction à implémenter quand la base de données sera prête
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Demandes de Maintenance</h3>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {filteredRequests.length > 0 ? (
          <div className="divide-y">
            {filteredRequests.map((request) => (
              <div key={request.id} className="py-4 flex flex-col sm:flex-row justify-between">
                <div className="space-y-2 mb-3 sm:mb-0">
                  <div className="flex items-start gap-2">
                    <h4 className="font-medium">{request.title}</h4>
                    {getPriorityBadge(request.priority)}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>{request.property}</p>
                    <p>Soumis le {formatDate(request.submittedDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-4">
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      Commenter
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => viewDetails(request.id)}
                    >
                      Détails
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aucune demande trouvée</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm
                ? "Aucun résultat pour cette recherche."
                : "Aucune demande de maintenance n'a été enregistrée."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceRequestsList;
