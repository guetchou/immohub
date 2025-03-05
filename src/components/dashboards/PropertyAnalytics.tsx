
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, PieChart as PieChartIcon, BarChart as BarChartIcon, LineChart as LineChartIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PropertyData = {
  id: string;
  title: string;
  city: string;
  status: string;
  type: string;
  surface_area: number;
  price: number;
  created_at: string;
};

type AnalyticsProps = {
  filter?: "city" | "type" | "status" | "price";
  period?: "month" | "quarter" | "year";
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const PropertyAnalytics = ({ filter = "city", period = "year" }: AnalyticsProps) => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityData, setCityData] = useState<any[]>([]);
  const [typeData, setTypeData] = useState<any[]>([]);
  const [priceRangeData, setPriceRangeData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>(filter);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(period);
  const { user } = useAuth();

  useEffect(() => {
    fetchProperties();
  }, [user]);

  useEffect(() => {
    if (properties.length > 0) {
      processData();
    }
  }, [properties, selectedFilter, selectedPeriod]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          city,
          status,
          property_types(name),
          property_prices(price),
          surface_area,
          created_at
        `);

      if (error) throw error;

      if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
          title: item.title,
          city: item.city,
          status: item.status,
          type: item.property_types?.name || "Non spécifié",
          surface_area: item.surface_area || 0,
          price: item.property_prices?.[0]?.price || 0,
          created_at: item.created_at
        }));
        
        setProperties(formattedData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des propriétés:", error);
    } finally {
      setLoading(false);
    }
  };

  const processData = () => {
    // Process data by city
    const cityCounts: Record<string, number> = {};
    properties.forEach(property => {
      const city = property.city || "Non spécifié";
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    
    const cityDataArray = Object.entries(cityCounts).map(([city, count]) => ({
      name: city,
      value: count
    }));
    setCityData(cityDataArray);

    // Process data by property type
    const typeCounts: Record<string, number> = {};
    properties.forEach(property => {
      const type = property.type || "Non spécifié";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    const typeDataArray = Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: count
    }));
    setTypeData(typeDataArray);

    // Process data by price range
    const priceRanges = [
      { range: "< 100k", min: 0, max: 100000 },
      { range: "100k-500k", min: 100000, max: 500000 },
      { range: "500k-1M", min: 500000, max: 1000000 },
      { range: "1M-5M", min: 1000000, max: 5000000 },
      { range: "5M-10M", min: 5000000, max: 10000000 },
      { range: "> 10M", min: 10000000, max: Infinity }
    ];
    
    const priceRangeCounts = priceRanges.map(range => {
      const count = properties.filter(
        property => property.price >= range.min && property.price < range.max
      ).length;
      
      return {
        name: range.range,
        value: count
      };
    });
    
    setPriceRangeData(priceRangeCounts);

    // Process timeline data based on creation date
    const timelineMap: Record<string, number> = {};
    const periodFormat = selectedPeriod === "month" ? "YYYY-MM" : 
                         selectedPeriod === "quarter" ? "YYYY-[Q]Q" : "YYYY";
    
    properties.forEach(property => {
      const date = new Date(property.created_at);
      const yearStr = date.getFullYear().toString();
      let period;
      
      if (selectedPeriod === "month") {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        period = `${yearStr}-${month}`;
      } else if (selectedPeriod === "quarter") {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        period = `${yearStr}-Q${quarter}`;
      } else {
        period = yearStr;
      }
      
      timelineMap[period] = (timelineMap[period] || 0) + 1;
    });
    
    // Sort by period
    const sortedTimeline = Object.entries(timelineMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, count]) => ({
        period,
        count
      }));
    
    setTimelineData(sortedTimeline);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill="#000" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>Analyse des Propriétés</CardTitle>
            <CardDescription>
              Visualisation analytique du portefeuille immobilier
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={selectedFilter}
              onValueChange={setSelectedFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="city">Par Ville</SelectItem>
                <SelectItem value="type">Par Type</SelectItem>
                <SelectItem value="price">Par Prix</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Par Mois</SelectItem>
                <SelectItem value="quarter">Par Trimestre</SelectItem>
                <SelectItem value="year">Par Année</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="distribution" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="distribution" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Distribution
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              Comparaison
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              Chronologie
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={selectedFilter === "city" ? cityData : 
                          selectedFilter === "type" ? typeData : 
                          priceRangeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(selectedFilter === "city" ? cityData : 
                     selectedFilter === "type" ? typeData : 
                     priceRangeData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} propriétés`, 'Quantité']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={selectedFilter === "city" ? cityData : 
                        selectedFilter === "type" ? typeData : 
                        priceRangeData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} propriétés`, 'Quantité']} />
                  <Legend />
                  <Bar dataKey="value" name="Nombre de propriétés" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timelineData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} propriétés`, 'Quantité']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Propriétés ajoutées" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertyAnalytics;
