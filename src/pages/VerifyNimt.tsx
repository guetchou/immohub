import { useState } from "react";
import { Search, CheckCircle2, XCircle, AlertTriangle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isValidNimt } from "@/lib/registrationNumber";
import { tourismRegistryMock } from "@/data/tourismRegistryMock";

const STATUS_LABELS: Record<string, string> = {
  AUTHORIZED: "Conforme",
  CLASSIFIED: "Classifié",
  DECLARED: "Déclaré",
  PENDING_DOCUMENTS: "Documents en attente",
  NON_COMPLIANT: "Non conforme",
  UNDECLARED: "Non déclaré",
  SUSPENDED: "Suspendu",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  AUTHORIZED: "default",
  CLASSIFIED: "default",
  DECLARED: "secondary",
  PENDING_DOCUMENTS: "secondary",
  NON_COMPLIANT: "destructive",
  UNDECLARED: "destructive",
  SUSPENDED: "destructive",
};

interface NimtResult {
  found: boolean;
  nimt?: string;
  status?: string;
  district?: string;
  city?: string;
  type?: string;
  totalUnits?: number;
  classificationLevel?: string | null;
}

const lookupNimt = async (nimt: string): Promise<NimtResult> => {
  try {
    const res = await fetch(`/api/verify-nimt/${encodeURIComponent(nimt.toUpperCase())}`);
    if (res.status === 404) return { found: false };
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    // Fallback to mock when API unreachable
    const entry = tourismRegistryMock.find(
      (e) => e.nimt?.toUpperCase() === nimt.toUpperCase()
    );
    if (!entry) return { found: false };
    return {
      found: true,
      nimt: entry.nimt!,
      status: entry.complianceStatus,
      district: entry.district,
      city: entry.city,
      type: "Meublé touristique",
      totalUnits: entry.totalUnits,
      classificationLevel: entry.classificationLevel,
    };
  }
};

const VerifyNimt = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NimtResult | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const value = input.trim().toUpperCase();
    if (!value) return;

    if (!isValidNimt(value)) {
      setError("Format attendu : CG-BZV-MT-2024-000001");
      setResult(null);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await lookupNimt(value);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-700 text-white rounded-full p-3">
            <Building2 className="h-7 w-7" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-1">Vérification du numéro NIMT</h1>
        <p className="text-muted-foreground text-sm">
          Vérifiez si un meublé touristique est enregistré auprès du Ministère du Tourisme de la République du Congo.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="CG-BZV-MT-2024-000001"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="font-mono text-sm tracking-widest"
              maxLength={22}
            />
            <Button onClick={handleSearch} disabled={loading || !input.trim()}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Recherche..." : "Vérifier"}
            </Button>
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> {error}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Le Numéro d'Identification du Meublé Touristique (NIMT) figure sur l'attestation
            d'enregistrement délivrée par le Ministère du Tourisme.
          </p>
        </CardContent>
      </Card>

      {result !== null && (
        <Card className={result.found ? "border-green-300 bg-green-50 dark:bg-green-950/20" : "border-red-300 bg-red-50 dark:bg-red-950/20"}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              {result.found ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              {result.found ? "Numéro NIMT reconnu" : "Numéro NIMT non trouvé"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.found ? (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">NIMT</dt>
                  <dd className="font-mono font-semibold">{result.nimt}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Statut</dt>
                  <dd>
                    <Badge variant={STATUS_VARIANT[result.status!] ?? "secondary"}>
                      {STATUS_LABELS[result.status!] ?? result.status}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Type</dt>
                  <dd>{result.type}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Quartier</dt>
                  <dd>{result.district} — {result.city}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Capacité</dt>
                  <dd>{result.totalUnits} unité{(result.totalUnits ?? 0) > 1 ? "s" : ""}</dd>
                </div>
                {result.classificationLevel && (
                  <div>
                    <dt className="text-muted-foreground">Classement</dt>
                    <dd>{result.classificationLevel}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                Ce numéro ne correspond à aucun bien enregistré dans le registre national.
                Vérifiez l'orthographe ou contactez le service administratif compétent.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerifyNimt;
