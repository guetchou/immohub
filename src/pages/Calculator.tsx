import { NavBar } from "@/components/navigation/NavBar";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import AdvancedMortgageCalculator from "@/components/calculators/AdvancedMortgageCalculator";
import MortgageSimulator from "@/components/calculators/MortgageSimulator";

const Calculator = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-real-primary to-real-accent bg-clip-text text-transparent">
          Calculateurs Immobiliers
        </h1>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="basic">Calculateur Simple</TabsTrigger>
            <TabsTrigger value="advanced">Calculateur Avancé</TabsTrigger>
            <TabsTrigger value="simulator">Simulateur</TabsTrigger>
          </TabsList>
          
          <Card className="mt-6">
            <TabsContent value="basic">
              <MortgageCalculator />
            </TabsContent>
            
            <TabsContent value="advanced">
              <AdvancedMortgageCalculator />
            </TabsContent>
            
            <TabsContent value="simulator">
              <MortgageSimulator />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Calculator;