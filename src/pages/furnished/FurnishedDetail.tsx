import { useParams, Link } from "react-router-dom";
import { furnishedPropertiesMock } from "@/data/furnishedMock";
import { FurnishedStatusBadge } from "@/components/furnished/FurnishedStatusBadge";
import { FurnishedCompliancePanel } from "@/components/furnished/FurnishedCompliancePanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Building2, Moon, Calendar, Star } from "lucide-react";

export default function FurnishedDetail() {
  const { id } = useParams<{ id: string }>();
  const property = furnishedPropertiesMock.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-lg font-medium text-muted-foreground">Bien non trouvé.</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/furnished"><ArrowLeft className="h-4 w-4 mr-1" />Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/furnished"><ArrowLeft className="h-4 w-4 mr-1" />Retour</Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{property.name}</h1>
          <p className="text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-4 w-4" />{property.address}, {property.district}
          </p>
        </div>
        <FurnishedStatusBadge status={property.complianceStatus} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <Building2 className="h-7 w-7 text-blue-500 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Unités</p>
              <p className="text-lg font-semibold">{property.activeUnits}/{property.totalUnits}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <Moon className="h-7 w-7 text-indigo-500 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Prix / nuit</p>
              <p className="text-lg font-semibold">{property.pricePerNight.toLocaleString("fr-FR")} FCFA</p>
            </div>
          </CardContent>
        </Card>
        {property.classificationLevel && (
          <Card>
            <CardContent className="flex items-center gap-3 pt-5">
              <Star className="h-7 w-7 text-yellow-500 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Classification</p>
                <p className="text-lg font-semibold">{property.classificationLevel}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {property.declaredAt && (
          <Card>
            <CardContent className="flex items-center gap-3 pt-5">
              <Calendar className="h-7 w-7 text-green-500 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Déclaré le</p>
                <p className="text-lg font-semibold">{new Date(property.declaredAt).toLocaleDateString("fr-FR")}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Opérateur :</span>{" "}
          <span className="font-medium">{property.operatorName}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Ville :</span>{" "}
          <span className="font-medium">{property.city}</span>
        </div>
        {property.lastInspectionDate && (
          <div>
            <span className="text-muted-foreground">Dernière inspection :</span>{" "}
            <span className="font-medium">{new Date(property.lastInspectionDate).toLocaleDateString("fr-FR")}</span>
          </div>
        )}
        {property.taxRiskScore !== undefined && (
          <div>
            <span className="text-muted-foreground">Score risque fiscal :</span>{" "}
            <span className="font-medium">{property.taxRiskScore}/100</span>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Documents de conformité</CardTitle>
        </CardHeader>
        <CardContent>
          <FurnishedCompliancePanel propertyId={property.id} />
        </CardContent>
      </Card>
    </div>
  );
}
