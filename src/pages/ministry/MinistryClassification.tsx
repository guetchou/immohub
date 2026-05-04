import { furnishedPropertiesMock } from "@/data/furnishedMock";
import { FurnishedStatusBadge } from "@/components/furnished/FurnishedStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function MinistryClassification() {
  const properties = furnishedPropertiesMock;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <Star className="h-6 w-6" />
        Classification des biens
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground font-normal">
            {properties.length} bien{properties.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Nom</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Quartier</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Classification actuelle</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Dernière inspection</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{p.district}</td>
                    <td className="px-3 py-2">
                      {p.classificationLevel ? (
                        <span className="flex items-center gap-1 font-medium">
                          <Star className="h-3.5 w-3.5 text-yellow-500" />
                          {p.classificationLevel}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Non classifié</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <FurnishedStatusBadge status={p.complianceStatus} />
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {p.lastInspectionDate
                        ? new Date(p.lastInspectionDate).toLocaleDateString("fr-FR")
                        : "—"}
                    </td>
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
