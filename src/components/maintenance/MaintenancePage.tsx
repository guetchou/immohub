
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, AlertTriangle, Filter, Plus, Wrench, 
  Calendar, Clock, ClipboardCheck, Loader2, RefreshCw 
} from "lucide-react";

const MaintenancePage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredRequests, setFilteredRequests] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, [user]);

  useEffect(() => {
    filterRequests();
  }, [searchTerm, statusFilter, requests]);

  const fetchRequests = async () => {
    setLoading(true);
    
    // Simulons des données pour cette démo
    // Dans une version réelle, vous feriez un appel à l'API ou à Supabase
    setTimeout(() => {
      const demoData = [
        {
          id: "m-001",
          title: "Fuite d'eau dans la salle de bain",
          description: "Il y a une fuite sous le lavabo qui inonde le sol",
          status: "pending",
          priority: "high",
          property: "Appartement Kinshasa Centre",
          submittedBy: "Jean Dupont",
          submittedAt: "2023-10-15T10:30:00",
          scheduledDate: "2023-10-20",
        },
        {
          id: "m-002",
          title: "Problème électrique au salon",
          description: "Les prises électriques du salon ne fonctionnent plus",
          status: "in_progress",
          priority: "medium",
          property: "Villa Brazzaville Sud",
          submittedBy: "Marie Kodia",
          submittedAt: "2023-10-12T15:45:00",
          scheduledDate: "2023-10-18",
        },
        {
          id: "m-003",
          title: "Serrure porte d'entrée cassée",
          description: "La porte d'entrée ne se ferme plus correctement",
          status: "completed",
          priority: "high",
          property: "Duplex Plateau",
          submittedBy: "Paul Mabele",
          submittedAt: "2023-10-05T09:15:00",
          scheduledDate: "2023-10-10",
          completedAt: "2023-10-11T14:30:00",
          resolution: "Remplacement de la serrure et ajustement de la porte"
        },
      ];
      
      setRequests(demoData);
      setFilteredRequests(demoData);
      setLoading(false);
    }, 1000);
  };

  const filterRequests = () => {
    let filtered = [...requests];
    
    // Filtrer par terme de recherche
    if (searchTerm.trim() !== "") {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        request =>
          request.title.toLowerCase().includes(lowercasedSearch) ||
          request.property.toLowerCase().includes(lowercasedSearch) ||
          request.description.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Filtrer par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    setFilteredRequests(filtered);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">En cours</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Terminé</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="border-red-500 text-red-500">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="border-red-500 text-red-500">Haute</Badge>;
      case "medium":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Moyenne</Badge>;
      case "low":
        return <Badge variant="outline" className="border-green-500 text-green-500">Basse</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Demandes de Maintenance
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={() => fetchRequests()} title="Rafraîchir">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Rafraîchir</span>
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle demande
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Nouvelle demande de maintenance</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium">Titre</label>
                    <Input id="title" placeholder="Décrivez brièvement le problème" />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="property" className="text-sm font-medium">Propriété</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une propriété" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prop1">Appartement Kinshasa Centre</SelectItem>
                        <SelectItem value="prop2">Villa Brazzaville Sud</SelectItem>
                        <SelectItem value="prop3">Duplex Plateau</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="priority" className="text-sm font-medium">Priorité</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Textarea id="description" placeholder="Décrivez le problème en détail" rows={4} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline">Annuler</Button>
                  <Button type="submit">Soumettre</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="in_progress">En cours</TabsTrigger>
            <TabsTrigger value="completed">Terminées</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {renderRequestsTable(filteredRequests)}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-0">
            {renderRequestsTable(requests.filter(r => r.status === "pending"))}
          </TabsContent>
          
          <TabsContent value="in_progress" className="mt-0">
            {renderRequestsTable(requests.filter(r => r.status === "in_progress"))}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {renderRequestsTable(requests.filter(r => r.status === "completed"))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  function renderRequestsTable(data) {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Aucune demande trouvée</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm || statusFilter !== "all" 
              ? "Aucun résultat pour cette recherche." 
              : "Aucune demande de maintenance n'est disponible."}
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Propriété</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>{request.property}</TableCell>
                <TableCell>{formatDate(request.submittedAt)}</TableCell>
                <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Détails</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Détails de la demande</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{request.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Soumis le {formatDate(request.submittedAt)} par {request.submittedBy}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-md">
                          <p className="text-sm">{request.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Propriété</h4>
                            <p>{request.property}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Date prévue</h4>
                            <p className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" /> 
                              {request.scheduledDate ? formatDate(request.scheduledDate) : "Non planifiée"}
                            </p>
                          </div>
                        </div>
                        
                        {request.status === "completed" && (
                          <div className="border-t pt-4 mt-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Résolution</h4>
                            <p className="text-sm">{request.resolution}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              <ClipboardCheck className="h-3 w-3 inline mr-1" />
                              Complété le {formatDate(request.completedAt)}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        {request.status === "pending" && (
                          <Button type="button" variant="outline">
                            <Calendar className="h-4 w-4 mr-2" />
                            Planifier
                          </Button>
                        )}
                        {(request.status === "pending" || request.status === "in_progress") && (
                          <Button type="button">
                            <ClipboardCheck className="h-4 w-4 mr-2" />
                            Marquer comme terminé
                          </Button>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default MaintenancePage;
