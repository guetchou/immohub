import { Routes, Route } from "react-router-dom";
import Contact from "@/pages/Contact";
import Favorites from "@/pages/Favorites";
import Messages from "@/pages/Messages";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Index from "@/pages/Index";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import Calculator from "@/pages/Calculator";
import CustomerService from "@/components/crm/CustomerService";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/types/user";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/customer-service" element={<CustomerService />} />
      <Route path="/favorites" element={
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Role-specific dashboard routes */}
      <Route path="/tenant-dashboard" element={
        <ProtectedRoute roles={["TENANT" as UserRole]}>
          <div>Tableau de bord locataire</div>
        </ProtectedRoute>
      } />
      <Route path="/landlord-dashboard" element={
        <ProtectedRoute roles={["LANDLORD" as UserRole]}>
          <div>Tableau de bord propriétaire</div>
        </ProtectedRoute>
      } />
      <Route path="/agency-dashboard" element={
        <ProtectedRoute roles={["AGENCY" as UserRole]}>
          <div>Tableau de bord agence</div>
        </ProtectedRoute>
      } />
      <Route path="/broker-dashboard" element={
        <ProtectedRoute roles={["BROKER" as UserRole]}>
          <div>Tableau de bord courtier</div>
        </ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute roles={["ADMIN" as UserRole]}>
          <div>Tableau de bord administrateur</div>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;