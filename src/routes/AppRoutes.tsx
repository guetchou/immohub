import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import Messages from "@/pages/Messages";
import Favorites from "@/pages/Favorites";
import CustomerService from "@/pages/CustomerService";
import Calculator from "@/pages/Calculator";
import Contact from "@/pages/Contact";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import UserProfile from "@/pages/UserProfile";
import Settings from "@/pages/Settings";
import Statistics from "@/pages/Statistics";
import Admin from "@/pages/Admin";
import { useAuth } from "@/contexts/AuthContext";
import TenantDashboard from "@/pages/dashboards/TenantDashboard";
import LandlordDashboard from "@/pages/dashboards/LandlordDashboard";
import AgencyDashboard from "@/pages/dashboards/AgencyDashboard";
import BrokerDashboard from "@/pages/dashboards/BrokerDashboard";

const AppRoutes = () => {
  const { user } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
      case "TENANT":
        return <TenantDashboard />;
      case "LANDLORD":
        return <LandlordDashboard />;
      case "AGENCY":
        return <AgencyDashboard />;
      case "BROKER":
        return <BrokerDashboard />;
      case "ADMIN":
        return <Dashboard />;
      default:
        return <Navigate to="/" />;
    }
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
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
      
      <Route
        path="/statistics"
        element={
          <ProtectedRoute roles={["ADMIN", "AGENCY"]}>
            <Statistics />
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
      
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
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
        path="/customer-service"
        element={
          <ProtectedRoute>
            <CustomerService />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/calculator"
        element={
          <ProtectedRoute>
            <Calculator />
          </ProtectedRoute>
        }
      />
      
      {/* Dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {getDashboardRoute()}
          </ProtectedRoute>
        }
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;