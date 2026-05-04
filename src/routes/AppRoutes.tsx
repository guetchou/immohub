
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/types/user";
import { Loader2 } from "lucide-react";

// Lazy loaded pages for better performance
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Properties = lazy(() => import("@/pages/Properties"));
const PropertyDetail = lazy(() => import("@/pages/PropertyDetail"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));
const Contact = lazy(() => import("@/pages/Contact"));
const CustomerService = lazy(() => import("@/pages/CustomerService"));
const Favorites = lazy(() => import("@/pages/Favorites"));
const Messages = lazy(() => import("@/pages/Messages"));
const Statistics = lazy(() => import("@/pages/Statistics"));
const Admin = lazy(() => import("@/pages/Admin"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Calculator = lazy(() => import("@/pages/Calculator"));
const Settings = lazy(() => import("@/pages/Settings"));
const MaintenancePage = lazy(() => import("@/components/maintenance/MaintenancePage"));

// Role-specific dashboards
const AgencyDashboard = lazy(() => import("@/pages/dashboards/AgencyDashboard"));

const BrokerDashboard = lazy(() => import("@/pages/dashboards/BrokerDashboard"));
const CanvasserDashboard = lazy(() => import("@/pages/dashboards/CanvasserDashboard"));
const InsuranceDashboard = lazy(() => import("@/pages/dashboards/InsuranceDashboard"));
const LandOwnerDashboard = lazy(() => import("@/pages/dashboards/LandOwnerDashboard"));
const LandlordDashboard = lazy(() => import("@/pages/dashboards/LandlordDashboard"));
const NotaryDashboard = lazy(() => import("@/pages/dashboards/NotaryDashboard"));
const TenantDashboard = lazy(() => import("@/pages/dashboards/TenantDashboard"));

// Ministry pages
const MinistryDashboard = lazy(() => import("@/pages/ministry/MinistryDashboard"));
const MinistryRegistry = lazy(() => import("@/pages/ministry/MinistryRegistry"));
const MinistryMap = lazy(() => import("@/pages/ministry/MinistryMap"));
const MinistryInspections = lazy(() => import("@/pages/ministry/MinistryInspections"));
const MinistryClassification = lazy(() => import("@/pages/ministry/MinistryClassification"));
const MinistryStatistics = lazy(() => import("@/pages/ministry/MinistryStatistics"));
const MinistryTaxRisk = lazy(() => import("@/pages/ministry/MinistryTaxRisk"));
const MinistryReports = lazy(() => import("@/pages/ministry/MinistryReports"));
const MinistryAlerts = lazy(() => import("@/pages/ministry/MinistryAlerts"));
const MinistryCases = lazy(() => import("@/pages/ministry/MinistryCases"));

// Market Observatory
const MarketObservatory = lazy(() => import("@/pages/MarketObservatory"));

// Furnished pages
const FurnishedListings = lazy(() => import("@/pages/furnished/FurnishedListings"));
const FurnishedDetail = lazy(() => import("@/pages/furnished/FurnishedDetail"));
const FurnishedDashboard = lazy(() => import("@/pages/dashboards/FurnishedDashboard"));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/market-observatory" element={<MarketObservatory />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/calculator" element={<Calculator />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-service"
          element={
            <ProtectedRoute>
              <CustomerService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Role-Specific Routes */}
        <Route
          path="/landlord-dashboard"
          element={
            <ProtectedRoute roles={["LANDLORD"]}>
              <LandlordDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant-dashboard"
          element={
            <ProtectedRoute roles={["TENANT"]}>
              <TenantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agency-dashboard"
          element={
            <ProtectedRoute roles={["AGENCY"]}>
              <AgencyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/broker-dashboard"
          element={
            <ProtectedRoute roles={["BROKER"]}>
              <BrokerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/canvasser-dashboard"
          element={
            <ProtectedRoute roles={["CANVASSER"]}>
              <CanvasserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insurance-dashboard"
          element={
            <ProtectedRoute roles={["INSURANCE"]}>
              <InsuranceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/land-owner-dashboard"
          element={
            <ProtectedRoute roles={["LAND_OWNER"]}>
              <LandOwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notary-dashboard"
          element={
            <ProtectedRoute roles={["NOTARY"]}>
              <NotaryDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        
        {/* Property Management Routes */}
        <Route
          path="/rent-management"
          element={
            <ProtectedRoute roles={["TENANT", "LANDLORD", "ADMIN"]}>
              <RentManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leases"
          element={
            <ProtectedRoute roles={["TENANT", "LANDLORD", "ADMIN"]}>
              <LeasesManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute roles={["TENANT", "LANDLORD", "ADMIN"]}>
              <MaintenanceManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Furnished / Meublés - public listing */}
        <Route path="/furnished" element={<FurnishedListings />} />
        <Route path="/furnished/:id" element={<FurnishedDetail />} />

        {/* Furnished Dashboard - opérateur */}
        <Route
          path="/furnished-dashboard"
          element={
            <ProtectedRoute roles={["FURNISHED_OPERATOR", "ADMIN"]}>
              <FurnishedDashboard />
            </ProtectedRoute>
          }
        />

        {/* Ministry routes - protégées */}
        <Route
          path="/ministry-dashboard"
          element={
            <ProtectedRoute roles={["ADMIN", "MINISTRY_ADMIN", "MINISTRY_VIEWER", "MINISTRY_INSPECTOR", "COMPLIANCE_AGENT", "TAX_ANALYST"]}>
              <MinistryDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ministry/registry"
          element={
            <ProtectedRoute roles={["ADMIN", "MINISTRY_ADMIN", "MINISTRY_VIEWER", "MINISTRY_INSPECTOR", "COMPLIANCE_AGENT", "TAX_ANALYST"]}>
              <MinistryRegistry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ministry/map"
          element={
            <ProtectedRoute roles={["ADMIN", "MINISTRY_ADMIN", "MINISTRY_VIEWER", "MINISTRY_INSPECTOR", "COMPLIANCE_AGENT", "TAX_ANALYST"]}>
              <MinistryMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ministry/inspections"
          element={
            <ProtectedRoute roles={["ADMIN", "MINISTRY_ADMIN", "MINISTRY_INSPECTOR"]}>
              <MinistryInspections />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ministry/classification"
          element={
            <ProtectedRoute roles={["ADMIN", "MINISTRY_ADMIN", "MINISTRY_VIEWER", "COMPLIANCE_AGENT"]}>
              <MinistryClassification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ministry/statistics"
          element={
            <ProtectedRoute roles={["ADMIN", "MINISTRY_ADMIN", "MINISTRY_VIEWER", "TAX_ANALYST"]}>
              <MinistryStatistics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ministry/tax-risk"
          element={
            <ProtectedRoute roles={["ADMIN", "MINISTRY_ADMIN", "TAX_ANALYST"]}>
              <MinistryTaxRisk />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ministry/reports"
          element={
            <ProtectedRoute roles={["ADMIN", "MINISTRY_ADMIN", "TAX_ANALYST"]}>
              <MinistryReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ministry/alerts"
          element={
            <ProtectedRoute roles={["ADMIN", "MINISTRY_ADMIN", "MINISTRY_VIEWER", "MINISTRY_INSPECTOR", "COMPLIANCE_AGENT", "TAX_ANALYST"]}>
              <MinistryAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ministry/cases"
          element={
            <ProtectedRoute roles={["ADMIN", "MINISTRY_ADMIN", "MINISTRY_INSPECTOR", "COMPLIANCE_AGENT"]}>
              <MinistryCases />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

// Simple placeholder pages that redirect to specific tabs in the Dashboard
const RentManagementPage = () => {
  return <Dashboard initialTab="payments" />;
};

const LeasesManagementPage = () => {
  return <Dashboard initialTab="leases" />;
};

const MaintenanceManagementPage = () => {
  return <Dashboard initialTab="maintenance" />;
};

const NotificationsPage = () => {
  return <Dashboard initialTab="notifications" />;
};

export default AppRoutes;
