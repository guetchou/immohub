
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Receipt, Search, FileDown, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type RentPayment = {
  id: string;
  amount: number;
  payment_date: string;
  reference: string;
  status: string;
  payment_method: string;
  note?: string;
  tenant_id?: string;
  tenant_name?: string;
};

const RentPaymentsList = () => {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPayments, setFilteredPayments] = useState<RentPayment[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchPayments();
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPayments(payments);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = payments.filter(
        payment =>
          payment.reference?.toLowerCase().includes(lowercasedSearch) ||
          payment.tenant_name?.toLowerCase().includes(lowercasedSearch) ||
          payment.payment_method?.toLowerCase().includes(lowercasedSearch) ||
          payment.note?.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredPayments(filtered);
    }
  }, [searchTerm, payments]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('rent_payments')
        .select(`
          *,
          profiles:tenant_id (full_name)
        `)
        .order('payment_date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const formattedPayments = data.map(item => ({
          id: item.id,
          amount: item.amount,
          payment_date: item.payment_date,
          reference: item.reference || "",
          status: item.status || "completed",
          payment_method: item.payment_method || "cash",
          note: item.note,
          tenant_id: item.tenant_id,
          tenant_name: item.profiles?.full_name || "Non spécifié"
        }));
        
        setPayments(formattedPayments);
        setFilteredPayments(formattedPayments);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paiements:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Espèces';
      case 'mobile_money': return 'Mobile Money';
      case 'bank_transfer': return 'Virement bancaire';
      case 'check': return 'Chèque';
      default: return method;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Payé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Échoué</Badge>;
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
            <Receipt className="h-5 w-5" />
            Historique des Paiements
          </CardTitle>
          <div className="flex items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            {/* Bouton pour télécharger les données - Fonctionnalité future */}
            <Button variant="outline" size="icon" className="ml-2">
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
        ) : filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Référence</TableHead>
                  {(user?.role === 'LANDLORD' || user?.role === 'ADMIN' || user?.role === 'landlord' || user?.role === 'admin') && (
                    <TableHead>Locataire</TableHead>
                  )}
                  <TableHead>Méthode</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.payment_date)}</TableCell>
                    <TableCell className="font-medium">
                      {Number(payment.amount).toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.reference}
                    </TableCell>
                    {(user?.role === 'LANDLORD' || user?.role === 'ADMIN' || user?.role === 'landlord' || user?.role === 'admin') && (
                      <TableCell>{payment.tenant_name}</TableCell>
                    )}
                    <TableCell>{getPaymentMethodLabel(payment.payment_method)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aucun paiement trouvé</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? "Aucun résultat pour cette recherche." : "Commencez par enregistrer un paiement."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RentPaymentsList;
