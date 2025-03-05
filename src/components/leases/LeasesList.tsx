
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, Search, FileDown, AlertCircle, Loader2, Eye, Edit, Filter, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

type LeaseContract = {
  id: string;
  property_id: string;
  property_name?: string;
  tenant_id: string;
  tenant_name?: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit_amount: number;
  status: string;
};

const LeasesList = () => {
  const [leases, setLeases] = useState<LeaseContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLeases, setFilteredLeases] = useState<LeaseContract[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { user } = useAuth();

  useEffect(() => {
    fetchLeases();
  }, [user]);

  useEffect(() => {
    filterLeases();
  }, [searchTerm, statusFilter, leases]);

  const filterLeases = () => {
    let filtered = [...leases];
    
    // Filter by search term
    if (searchTerm.trim() !== "") {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        lease =>
          lease.property_name?.toLowerCase().includes(lowercasedSearch) ||
          lease.tenant_name?.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(lease => lease.status === statusFilter);
    }
    
    setFilteredLeases(filtered);
  };

  const fetchLeases = async () => {
    setLoading(true);
    try {
      // Base query
      let query = supabase
        .from('lease_contracts')
        .select(`
          *,
          properties(title),
          profiles(full_name)
        `)
        .order('start_date', { ascending: false });

      // Si l'utilisateur est un locataire, on filtre par son ID
      if (user?.role === 'TENANT') {
        query = query.eq('tenant_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const formattedLeases = data.map(item => ({
          id: item.id,
          property_id: item.property_id,
          property_name: item.properties?.title || "Propriété non spécifiée",
          tenant_id: item.tenant_id,
          tenant_name: item.profiles?.full_name || "Locataire non spécifié",
          start_date: item.start_date,
          end_date: item.end_date,
          monthly_rent: item.monthly_rent,
          deposit_amount: item.deposit_amount,
          status: item.status || "draft"
        }));
        
        setLeases(formattedLeases);
        setFilteredLeases(formattedLeases);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des contrats:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les contrats de location.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'expired':
        return <Badge className="bg-red-500">Expiré</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500">Brouillon</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Liste des Contrats de Location
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
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={() => fetchLeases()} title="Rafraîchir">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Rafraîchir</span>
            </Button>
            
            <Button variant="outline" size="icon" title="Exporter">
              <FileDown className="h-4 w-4" />
              <span className="sr-only">Exporter</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredLeases.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriété</TableHead>
                  {(user?.role === 'LANDLORD' || user?.role === 'ADMIN') && (
                    <TableHead>Locataire</TableHead>
                  )}
                  <TableHead>Début</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Loyer mensuel</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeases.map((lease) => (
                  <TableRow key={lease.id}>
                    <TableCell className="font-medium">{lease.property_name}</TableCell>
                    {(user?.role === 'LANDLORD' || user?.role === 'ADMIN') && (
                      <TableCell>{lease.tenant_name}</TableCell>
                    )}
                    <TableCell>{formatDate(lease.start_date)}</TableCell>
                    <TableCell>{formatDate(lease.end_date)}</TableCell>
                    <TableCell>{Number(lease.monthly_rent).toLocaleString()} FCFA</TableCell>
                    <TableCell>{getStatusBadge(lease.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" title="Voir les détails">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(user?.role === 'LANDLORD' || user?.role === 'ADMIN') && (
                          <Button variant="ghost" size="icon" title="Modifier">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aucun contrat trouvé</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm || statusFilter !== "all" ? "Aucun résultat pour cette recherche." : "Commencez par créer un contrat de location."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeasesList;
