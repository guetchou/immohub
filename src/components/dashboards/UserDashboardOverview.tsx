
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Home, FileText, Wallet, Bell, Calendar, AlertTriangle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import DashboardCard from "@/components/dashboards/DashboardCard";

const UserDashboardOverview = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [leasesCount, setLeasesCount] = useState(0);
  const [paymentsTotal, setPaymentsTotal] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [pendingMaintenanceRequests, setPendingMaintenanceRequests] = useState(0);
  const [leasesByStatus, setLeasesByStatus] = useState<any[]>([]);
  const [propertiesByCity, setPropertiesByCity] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch property count based on user role
      const propertyQuery = user?.role === 'LANDLORD' 
        ? supabase.from('properties').select('id', { count: 'exact' }).eq('owner_id', user.id)
        : supabase.from('lease_contracts').select('property_id', { count: 'exact' }).eq('tenant_id', user.id).eq('status', 'active');
      
      const { count: propertyCount, error: propertyError } = await propertyQuery;
      if (propertyError) throw propertyError;
      setPropertiesCount(propertyCount || 0);

      // Fetch leases
      const leaseQuery = user?.role === 'LANDLORD'
        ? supabase.from('lease_contracts').select('*').eq('owner_id', user.id)
        : supabase.from('lease_contracts').select('*').eq('tenant_id', user.id);
      
      const { data: leaseData, error: leaseError } = await leaseQuery;
      if (leaseError) throw leaseError;
      setLeasesCount(leaseData?.length || 0);
      
      // Process lease status for chart
      const statusCounts: Record<string, number> = {};
      leaseData?.forEach(lease => {
        const status = lease.status || 'unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        value: count
      }));
      setLeasesByStatus(statusData);

      // Fetch payments
      const paymentQuery = user?.role === 'LANDLORD'
        ? supabase.from('rent_payments').select('amount').eq('status', 'completed')
        : supabase.from('rent_payments').select('amount').eq('tenant_id', user.id).eq('status', 'completed');
      
      const { data: paymentData, error: paymentError } = await paymentQuery;
      if (paymentError) throw paymentError;
      
      const total = paymentData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
      setPaymentsTotal(total);

      // Fetch unread notifications
      const { count: notifCount, error: notifError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (notifError) throw notifError;
      setUnreadNotifications(notifCount || 0);

      // Fetch city data for landlords
      if (user?.role === 'LANDLORD') {
        const { data: cityData, error: cityError } = await supabase
          .from('properties')
          .select('city')
          .eq('owner_id', user.id);
        
        if (cityError) throw cityError;
        
        const cityCounts: Record<string, number> = {};
        cityData?.forEach(property => {
          const city = property.city || 'Non spécifié';
          cityCounts[city] = (cityCounts[city] || 0) + 1;
        });
        
        const cityChartData = Object.entries(cityCounts).map(([city, count]) => ({
          name: city,
          value: count
        }));
        setPropertiesByCity(cityChartData);
      }
      
      // Simulate pending maintenance requests and upcoming appointments for now
      setPendingMaintenanceRequests(Math.floor(Math.random() * 5));
      setUpcomingAppointments(Math.floor(Math.random() * 3));
      
    } catch (error) {
      console.error("Erreur lors du chargement des données du tableau de bord:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">
        Bienvenue, {user?.name || user?.full_name || 'Utilisateur'}
      </h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title={user?.role === 'LANDLORD' ? "Propriétés" : "Locations actives"}
          value={propertiesCount.toString()}
          icon={Home}
          description={user?.role === 'LANDLORD' ? "Nombre de propriétés gérées" : "Biens en location active"}
        />
        <DashboardCard
          title="Contrats"
          value={leasesCount.toString()}
          icon={FileText}
          description="Contrats de location en cours"
        />
        <DashboardCard
          title="Paiements totaux"
          value={`${paymentsTotal.toLocaleString()} FCFA`}
          icon={Wallet}
          description="Montant total des paiements"
        />
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Vue générale</TabsTrigger>
          <TabsTrigger value="analytics">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Notifications"
              value={unreadNotifications.toString()}
              icon={Bell}
              description="Notifications non lues"
              action={
                <Button asChild variant="link" size="sm" className="p-0">
                  <Link to="/notifications">Voir tout</Link>
                </Button>
              }
            />
            <DashboardCard
              title="Rendez-vous"
              value={upcomingAppointments.toString()}
              icon={Calendar}
              description="Rendez-vous à venir"
              action={
                <Button asChild variant="link" size="sm" className="p-0">
                  <Link to="/appointments">Voir tout</Link>
                </Button>
              }
            />
            <DashboardCard
              title="Demandes maintenance"
              value={pendingMaintenanceRequests.toString()}
              icon={AlertTriangle}
              description="Demandes en attente"
              action={
                <Button asChild variant="link" size="sm" className="p-0">
                  <Link to="/maintenance">Voir tout</Link>
                </Button>
              }
            />
          </div>
          
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accès rapide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <Link to="/rent-management">
                      <Wallet className="h-6 w-6 mb-2" />
                      <span>Paiements</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <Link to="/leases">
                      <FileText className="h-6 w-6 mb-2" />
                      <span>Contrats</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <Link to="/properties">
                      <Home className="h-6 w-6 mb-2" />
                      <span>Propriétés</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                    <Link to="/maintenance">
                      <AlertTriangle className="h-6 w-6 mb-2" />
                      <span>Maintenance</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contrats par statut</CardTitle>
              </CardHeader>
              <CardContent>
                {leasesByStatus.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leasesByStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={renderCustomizedLabel}
                        >
                          {leasesByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} contrat(s)`, '']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    Aucun contrat disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {user?.role === 'LANDLORD' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Propriétés par ville</CardTitle>
                </CardHeader>
                <CardContent>
                  {propertiesByCity.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={propertiesByCity}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {propertiesByCity.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} propriété(s)`, '']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-64 text-gray-500">
                      Aucune propriété disponible
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions recommandées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {unreadNotifications > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <span>Vous avez {unreadNotifications} notification{unreadNotifications > 1 ? 's' : ''} non lue{unreadNotifications > 1 ? 's' : ''}</span>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/notifications">Voir</Link>
                    </Button>
                  </div>
                )}
                
                {pendingMaintenanceRequests > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <span>{pendingMaintenanceRequests} demande{pendingMaintenanceRequests > 1 ? 's' : ''} de maintenance en attente</span>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/maintenance">Traiter</Link>
                    </Button>
                  </div>
                )}
                
                {upcomingAppointments > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <span>{upcomingAppointments} rendez-vous à venir</span>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/appointments">Voir</Link>
                    </Button>
                  </div>
                )}
                
                {/* Toujours afficher cette suggestion */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-purple-500" />
                    <span>Gérer vos paiements de loyer</span>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/rent-management">Accéder</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboardOverview;
