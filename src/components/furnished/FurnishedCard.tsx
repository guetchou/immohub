import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Moon, AlertTriangle } from "lucide-react";
import { FurnishedProperty } from "@/types/furnished";
import { FurnishedStatusBadge } from "./FurnishedStatusBadge";

interface FurnishedCardProps {
  property: FurnishedProperty;
}

function getRiskColor(score: number): string {
  if (score >= 75) return "bg-red-500";
  if (score >= 50) return "bg-orange-400";
  if (score >= 25) return "bg-yellow-400";
  return "bg-green-500";
}

function getRiskLabel(score: number): string {
  if (score >= 75) return "Critique";
  if (score >= 50) return "Élevé";
  if (score >= 25) return "Moyen";
  return "Faible";
}

export function FurnishedCard({ property }: FurnishedCardProps) {
  const riskScore = property.taxRiskScore ?? 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight">{property.name}</CardTitle>
          <FurnishedStatusBadge status={property.complianceStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{property.address}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 shrink-0" />
          <span>{property.district}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" />
            {property.activeUnits}/{property.totalUnits} unités
          </span>
          <span className="text-muted-foreground flex items-center gap-1">
            <Moon className="h-3.5 w-3.5" />
            {property.pricePerNight.toLocaleString("fr-FR")} FCFA/nuit
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              Risque fiscal : {getRiskLabel(riskScore)}
            </span>
            <span className="font-medium">{riskScore}/100</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${getRiskColor(riskScore)} transition-all`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>
        <Button asChild size="sm" variant="outline" className="w-full mt-1">
          <Link to={`/furnished/${property.id}`}>Voir détail</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
