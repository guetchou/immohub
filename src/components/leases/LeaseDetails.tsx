
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { FileText, Printer, Download, Loader2 } from "lucide-react";

export interface LeaseDetailsProps {
  leaseId: string;
  onClose?: () => void;
}

const LeaseDetails = ({ leaseId, onClose }: LeaseDetailsProps) => {
  const [lease, setLease] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);

  useEffect(() => {
    fetchLeaseDetails();
  }, [leaseId]);

  const fetchLeaseDetails = async () => {
    setLoading(true);
    try {
      // Fetch lease contract
      const { data: leaseData, error: leaseError } = await supabase
        .from('lease_contracts')
        .select('*')
        .eq('id', leaseId)
        .single();

      if (leaseError) throw leaseError;
      setLease(leaseData);

      // Fetch property details
      if (leaseData.property_id) {
        const { data: propertyData } = await supabase
          .from('properties')
          .select('*')
          .eq('id', leaseData.property_id)
          .single();
        
        setProperty(propertyData);
      }

      // Fetch tenant details
      if (leaseData.tenant_id) {
        const { data: tenantData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', leaseData.tenant_id)
          .single();
        
        setTenant(tenantData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des détails du contrat:", error);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'expired':
        return <Badge className="bg-red-500">Expiré</Badge>;
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
        <p>Impossible de trouver les détails du contrat.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Contrat #{lease.id.substring(0, 8)}
        </h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Statut</h4>
            <div className="mt-1">{getStatusBadge(lease.status)}</div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Période</h4>
            <p className="mt-1">
              Du {formatDate(lease.start_date)} au {formatDate(lease.end_date)}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Loyer mensuel</h4>
            <p className="mt-1 font-semibold">{Number(lease.monthly_rent).toLocaleString()} FCFA</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Caution</h4>
            <p className="mt-1">{Number(lease.deposit_amount).toLocaleString()} FCFA</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {property && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Propriété</h4>
              <p className="mt-1 font-medium">{property.title}</p>
              <p className="text-sm text-gray-500">{property.address}, {property.city}</p>
            </div>
          )}
          
          {tenant && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Locataire</h4>
              <p className="mt-1">{tenant.full_name}</p>
              <p className="text-sm text-gray-500">{tenant.phone}</p>
            </div>
          )}
        </div>
      </div>

      {lease.terms && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Termes du contrat</h4>
          <div className="bg-gray-50 p-4 rounded border text-sm">
            {lease.terms}
          </div>
        </div>
      )}
      
      <div className="border-t pt-4 mt-6">
        <p className="text-sm text-gray-500">
          <FileText className="h-4 w-4 inline mr-1" /> 
          Contrat créé le {formatDate(lease.created_at)}
        </p>
      </div>
    </div>
  );
};

export default LeaseDetails;
