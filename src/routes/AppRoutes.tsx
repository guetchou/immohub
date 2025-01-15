import { Routes, Route } from "react-router-dom";
import Contact from "@/pages/Contact";
import Favorites from "@/pages/Favorites";
import Messages from "@/pages/Messages";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Index from "@/pages/Index";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomerService from "@/components/crm/CustomerService";
import AdvancedMortgageCalculator from "@/components/calculators/AdvancedMortgageCalculator";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/customer-service" element={<CustomerService />} />
      <Route path="/calculator" element={<AdvancedMortgageCalculator />} />
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
    </Routes>
  );
};

export default AppRoutes;