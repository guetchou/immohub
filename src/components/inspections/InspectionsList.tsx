
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clipboard, Search, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Données factices pour la démo
const mockInspections = [
  {
    id: "1",
    property: "Appartement au centre-ville",
    date: "2023-10-15",
    type: "entry",
    status: "completed"
  },
  {
    id: "2",
    property: "Villa de luxe avec piscine",
    date: "2023-11-22",
    type: "routine",
    status: "scheduled"
  },
  {
    id: "3",
    property: "Studio près de l'université",
    date: "2023-12-10",
    type: "exit",
    status: "completed"
  }
];

const InspectionsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inspections] = useState(mockInspections);

  const filteredInspections = inspections.filter(inspection => 
    inspection.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'entry': return 'État des lieux d\'entrée';
      case 'routine': return 'Inspection de routine';
      case 'exit': return 'État des lieux de sortie';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Terminé</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Planifié</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const viewDetails = (id: string) => {
    console.log("View details for inspection", id);
    // Fonction à implémenter quand la base de données sera prête
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Clipboard className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Inspections des Propriétés</h3>
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

        {filteredInspections.length > 0 ? (
          <div className="divide-y">
            {filteredInspections.map((inspection) => (
              <div key={inspection.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="space-y-1 mb-2 sm:mb-0">
                  <h4 className="font-medium">{inspection.property}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-4">{formatDate(inspection.date)}</span>
                    <span>{getTypeLabel(inspection.type)}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4">
                    {getStatusBadge(inspection.status)}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => viewDetails(inspection.id)}>
                    Voir les détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aucune inspection trouvée</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm
                ? "Aucun résultat pour cette recherche."
                : "Aucune inspection n'a été enregistrée."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InspectionsList;
