
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Home, 
  PieChart, 
  Bell, 
  FileText, 
  AlertTriangle, 
  MessageSquare,
  Settings,
  Calendar,
  Users
} from "lucide-react";
import UserDashboardOverview from "@/components/dashboards/UserDashboardOverview";
import PropertyAnalytics from "@/components/dashboards/PropertyAnalytics";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import RentCollection from "@/components/rent/RentCollection";
import LeasesList from "@/components/leases/LeasesList";
import MaintenancePage from "@/components/maintenance/MaintenancePage";
import { useLocation } from "react-router-dom";

interface DashboardProps {
  initialTab?: string;
}

const Dashboard = ({ initialTab = "overview" }: DashboardProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const location = useLocation();
  
  // Update active tab based on path if navigating to a specific route
  useEffect(() => {
    if (location.pathname === "/rent-management") {
      setActiveTab("payments");
    } else if (location.pathname === "/leases") {
      setActiveTab("leases");
    } else if (location.pathname === "/maintenance") {
      setActiveTab("maintenance");
    } else if (location.pathname === "/notifications") {
      setActiveTab("notifications");
    }
  }, [location]);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl font-bold mb-8 text-center sm:text-left"
      >
        Tableau de Bord
      </motion.h1>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-center sm:justify-start mb-6 overflow-x-auto pb-2">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-1">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Accueil</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Analytiques</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="leases" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Contrats</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Paiements</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendrier</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6">
          <UserDashboardOverview />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <PropertyAnalytics />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationCenter />
        </TabsContent>

        <TabsContent value="leases" className="mt-6">
          <LeasesList />
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <RentCollection />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <MaintenancePage />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-4">Module Calendrier</h3>
            <p className="text-muted-foreground">
              Ce module sera bientôt disponible.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-4">Gestion des Utilisateurs</h3>
            <p className="text-muted-foreground">
              Ce module sera bientôt disponible.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-4">Paramètres du Tableau de Bord</h3>
            <p className="text-muted-foreground">
              Ce module sera bientôt disponible.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Dashboard;
