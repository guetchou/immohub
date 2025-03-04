
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Loader2, FileText, Home, User, Calendar, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface LeaseDetailsProps {
  leaseId: string;
  onClose: () => void;
}

const LeaseDetails = ({ leaseId, onClose }: LeaseDetailsProps) => {
  const [lease, setLease] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaseDetails();
  }, [leaseId]);

  const fetchLeaseDetails = async () => {
    try {
      const { data: leaseData, error: leaseError } = await supabase
        .from('lease_contracts')
        .select('*')
        .eq('id', leaseId)
        .single();
      
      if (leaseError) throw leaseError;
      setLease(leaseData);
      
      // Fetch property details
      if (leaseData.property_id) {
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', leaseData.property_id)
          .single();
        
        if (!propertyError) {
          setProperty(propertyData);
        }
      }
      
      // Fetch tenant details
      if (leaseData.tenant_id) {
        const { data: tenantData, error: tenantError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', leaseData.tenant_id)
          .single();
        
        if (!tenantError) {
          setTenant(tenantData);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des détails du bail:", error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="text-center py-8">
        <p>Impossible de trouver les détails de ce contrat.</p>
        <Button onClick={onClose} variant="outline" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onClose} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        
        <div>{getStatusBadge(lease.status)}</div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contrat de Bail
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                  <Home className="h-4 w-4 mr-2" />
                  Propriété
                </h3>
                <p className="text-lg font-medium">{property?.title || 'Non spécifié'}</p>
                <p className="text-sm text-muted-foreground">{property?.address || 'Adresse non spécifiée'}</p>
              </div>
              
              <div>
                <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                  <User className="h-4 w-4 mr-2" />
                  Locataire
                </h3>
                <p className="text-lg font-medium">{tenant?.full_name || 'Non spécifié'}</p>
                <p className="text-sm text-muted-foreground">{tenant?.phone || 'Contact non spécifié'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Période du bail
                </h3>
                <p className="text-base">Du {formatDate(lease.start_date)} au {formatDate(lease.end_date)}</p>
              </div>
              
              <div>
                <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Informations financières
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Loyer mensuel</p>
                    <p className="text-base font-medium">{formatCurrency(lease.monthly_rent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Caution</p>
                    <p className="text-base font-medium">{formatCurrency(lease.deposit_amount)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {lease.terms && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Termes et conditions</h3>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm whitespace-pre-line">{lease.terms}</p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-6">
          <p className="text-sm text-muted-foreground">
            Contrat créé le {formatDate(lease.created_at)}
          </p>
          
          {(user?.role === 'LANDLORD' || user?.role === 'ADMIN') && (
            <Button variant="outline">
              Imprimer le contrat
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default LeaseDetails;
