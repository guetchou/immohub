import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import PropertySaleCalculator from "@/components/calculators/PropertySaleCalculator";
import InsuranceSimulator from "@/components/insurance/InsuranceSimulator";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/calculators/property-sale" element={<PropertySaleCalculator />} />
      <Route path="/calculators/mortgage" element={<MortgageCalculator />} />
      <Route path="/insurance/simulator" element={<InsuranceSimulator />} />
    </Routes>
  );
}
