import { furnishedPropertiesMock } from "@/data/furnishedMock";
import { FurnishedStatusBadge } from "@/components/furnished/FurnishedStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, MapPin } from "lucide-react";

export default function MinistryMap() {
  const propertiesWithCoords = furnishedPropertiesMock.filter(
    (p) => p.latitude !== undefined && p.longitude !== undefined
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <Map className="h-6 w-6" />
        Carte des biens
      </h1>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20">
            <div className="text-center space-y-2">
              <Map className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground font-medium">Carte interactive — Intégration Mapbox à configurer</p>
              <p className="text-xs text-muted-foreground">Ajoutez votre clé MAPBOX_TOKEN pour activer la carte</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Biens géolocalisés ({propertiesWithCoords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Nom</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Quartier</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Latitude</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Longitude</th>
                </tr>
              </thead>
              <tbody>
                {propertiesWithCoords.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.district}</td>
                    <td className="px-3 py-2">
                      <FurnishedStatusBadge status={p.complianceStatus} />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{p.latitude}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{p.longitude}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
