import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Messages from "./pages/Messages";
import Dashboard from "./pages/Dashboard";
import TenantDashboard from "./pages/dashboards/TenantDashboard";
import LandlordDashboard from "./pages/dashboards/LandlordDashboard";
import AgencyDashboard from "./pages/dashboards/AgencyDashboard";
import BrokerDashboard from "./pages/dashboards/BrokerDashboard";
import CanvasserDashboard from "./pages/dashboards/CanvasserDashboard";
import LandOwnerDashboard from "./pages/dashboards/LandOwnerDashboard";
import InsuranceDashboard from "./pages/dashboards/InsuranceDashboard";
import NotaryDashboard from "./pages/dashboards/NotaryDashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Header from "./components/Header";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route 
                  path="/favorites" 
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/messages" 
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute roles={["ADMIN"]}>
                      <Dashboard />
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
                  path="/landlord-dashboard" 
                  element={
                    <ProtectedRoute roles={["LANDLORD"]}>
                      <LandlordDashboard />
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
                  path="/land-owner-dashboard" 
                  element={
                    <ProtectedRoute roles={["LAND_OWNER"]}>
                      <LandOwnerDashboard />
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
                  path="/notary-dashboard" 
                  element={
                    <ProtectedRoute roles={["NOTARY"]}>
                      <NotaryDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;