import { Building2, TrendingUp, BarChart3, MapPin, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { furnishedPropertiesMock } from "@/data/furnishedMock";
import { ministryStatsMock } from "@/data/ministryMock";

const districtStats = [
  { name: "Bacongo", total: 12, declared: 10, avgPrice: 32000 },
  { name: "Moungali", total: 8, declared: 5, avgPrice: 24000 },
  { name: "Poto-Poto", total: 15, declared: 14, avgPrice: 45000 },
  { name: "Centre-Ville", total: 6, declared: 4, avgPrice: 28000 },
  { name: "Makélékélé", total: 9, declared: 6, avgPrice: 38000 },
  { name: "Talangaï", total: 11, declared: 9, avgPrice: 27000 },
];

const MarketObservatory = () => {
  const totalUnits = furnishedPropertiesMock.reduce((s, p) => s + p.totalUnits, 0);
  const activeUnits = furnishedPropertiesMock.reduce((s, p) => s + p.activeUnits, 0);
  const avgPrice = Math.round(
    furnishedPropertiesMock.reduce((s, p) => s + p.pricePerNight, 0) / furnishedPropertiesMock.length
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Observatoire du marché</h1>
        <p className="text-muted-foreground">
          Données publiques sur le marché immobilier et les appartements meublés à Brazzaville.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{ministryStatsMock.totalFurnishedProperties}</p>
                <p className="text-sm text-muted-foreground">Biens meublés recensés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{activeUnits}</p>
                <p className="text-sm text-muted-foreground">Unités actives / {totalUnits} total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{avgPrice.toLocaleString()} F</p>
                <p className="text-sm text-muted-foreground">Prix moyen / nuit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{ministryStatsMock.complianceRate}%</p>
                <p className="text-sm text-muted-foreground">Taux de conformité</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Par quartier */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Répartition par quartier — Brazzaville
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 pr-4">Quartier</th>
                  <th className="text-right py-2 pr-4">Biens recensés</th>
                  <th className="text-right py-2 pr-4">Déclarés</th>
                  <th className="text-right py-2 pr-4">Taux</th>
                  <th className="text-right py-2">Prix moy. / nuit</th>
                </tr>
              </thead>
              <tbody>
                {districtStats.map((d) => {
                  const rate = Math.round((d.declared / d.total) * 100);
                  return (
                    <tr key={d.name} className="border-b hover:bg-muted/40">
                      <td className="py-2 pr-4 font-medium">{d.name}</td>
                      <td className="text-right py-2 pr-4">{d.total}</td>
                      <td className="text-right py-2 pr-4">{d.declared}</td>
                      <td className="text-right py-2 pr-4">
                        <Badge variant={rate >= 80 ? "default" : rate >= 60 ? "secondary" : "destructive"}>
                          {rate}%
                        </Badge>
                      </td>
                      <td className="text-right py-2">{d.avgPrice.toLocaleString()} F CFA</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Note publique */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <p>
            Ces données sont issues du registre public des biens meublés déclarés auprès des autorités
            compétentes. Elles sont mises à jour périodiquement et ont une vocation informative.
            Pour tout signalement ou déclaration, contactez le service administratif compétent.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketObservatory;
