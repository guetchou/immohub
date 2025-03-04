
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Eye, Edit, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import LeaseDetails from "./LeaseDetails";

interface Lease {
  id: string;
  property_id: string;
  property_title?: string;
  tenant_id: string;
  tenant_name?: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit_amount: number;
  status: string;
}

const LeasesList = () => {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLeases, setFilteredLeases] = useState<Lease[]>([]);
  const [selectedLease, setSelectedLease] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeases();
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLeases(leases);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = leases.filter(
        lease =>
          lease.property_title?.toLowerCase().includes(lowercasedSearch) ||
          lease.tenant_name?.toLowerCase().includes(lowercasedSearch) ||
          lease.status.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredLeases(filtered);
    }
  }, [searchTerm, leases]);

  const fetchLeases = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('lease_contracts')
        .select(`
          *,
          properties:property_id (title),
          profiles:tenant_id (full_name)
        `);
      
      // Filter by role
      if (user?.role === 'TENANT') {
        query = query.eq('tenant_id', user.id);
      } else if (user?.role === 'LANDLORD') {
        query = query.eq('owner_id', user.id);
      }
      
      query = query.order('start_date', { ascending: false });
      
      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const formattedLeases = data.map(item => ({
          id: item.id,
          property_id: item.property_id,
          property_title: item.properties?.title || "Propriété inconnue",
          tenant_id: item.tenant_id,
          tenant_name: item.profiles?.full_name || "Locataire inconnu",
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
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'expired':
        return <Badge className="bg-red-500">Expiré</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500">Brouillon</Badge>;
      case 'terminated':
        return <Badge className="bg-gray-500">Résilié</Badge>;
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

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  const handleViewLease = (leaseId: string) => {
    setSelectedLease(leaseId);
  };

  const handleCloseDetails = () => {
    setSelectedLease(null);
  };

  if (selectedLease) {
    return <LeaseDetails leaseId={selectedLease} onClose={handleCloseDetails} />;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Contrats de Bail</h3>
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
                  <TableHead>Locataire</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Loyer mensuel</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeases.map((lease) => (
                  <TableRow key={lease.id}>
                    <TableCell className="font-medium">{lease.property_title}</TableCell>
                    <TableCell>{lease.tenant_name}</TableCell>
                    <TableCell>
                      {formatDate(lease.start_date)} - {formatDate(lease.end_date)}
                    </TableCell>
                    <TableCell>{formatCurrency(lease.monthly_rent)}</TableCell>
                    <TableCell>{getStatusBadge(lease.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewLease(lease.id)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir</span>
                      </Button>
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
              {searchTerm
                ? "Aucun résultat pour cette recherche."
                : "Aucun contrat de bail n'a été enregistré."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeasesList;
