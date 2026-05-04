import { useState } from "react";
import { furnishedPropertiesMock } from "@/data/furnishedMock";
import { FurnishedCard } from "@/components/furnished/FurnishedCard";
import { FurnishedFilters, FurnishedFiltersState } from "@/components/furnished/FurnishedFilters";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle, AlertCircle } from "lucide-react";

export default function FurnishedListings() {
  const [filters, setFilters] = useState<FurnishedFiltersState>({
    district: "",
    status: "",
    maxPrice: "",
  });

  const total = furnishedPropertiesMock.length;
  const authorized = furnishedPropertiesMock.filter(
    (p) => p.complianceStatus === "AUTHORIZED" || p.complianceStatus === "CLASSIFIED"
  ).length;
  const undeclared = furnishedPropertiesMock.filter(
    (p) => p.complianceStatus === "UNDECLARED"
  ).length;

  const filtered = furnishedPropertiesMock.filter((p) => {
    if (filters.district && p.district !== filters.district) return false;
    if (filters.status && p.complianceStatus !== filters.status) return false;
    if (filters.maxPrice && p.pricePerNight > Number(filters.maxPrice)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Appartements meublés</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <Building2 className="h-8 w-8 text-blue-500 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Total biens</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <CheckCircle className="h-8 w-8 text-green-500 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Autorisés / Classifiés</p>
              <p className="text-2xl font-bold">{authorized}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <AlertCircle className="h-8 w-8 text-red-500 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Non déclarés</p>
              <p className="text-2xl font-bold">{undeclared}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <FurnishedFilters onFilterChange={setFilters} />

      <div className="text-sm text-muted-foreground">
        {filtered.length} bien{filtered.length !== 1 ? "s" : ""} affiché{filtered.length !== 1 ? "s" : ""}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">Aucun bien ne correspond aux filtres sélectionnés.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <FurnishedCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
