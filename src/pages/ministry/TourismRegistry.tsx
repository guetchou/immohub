import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Hash, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tourismRegistryMock, TourismRegistryEntry } from "@/data/tourismRegistryMock";
import { useToast } from "@/hooks/use-toast";

const STATUS_LABELS: Record<string, string> = {
  AUTHORIZED: "Autorisé",
  CLASSIFIED: "Classifié",
  DECLARED: "Déclaré",
  PENDING_DOCUMENTS: "Docs en attente",
  NON_COMPLIANT: "Non conforme",
  UNDECLARED: "Non déclaré",
  SUSPENDED: "Suspendu",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  AUTHORIZED: "default",
  CLASSIFIED: "default",
  DECLARED: "secondary",
  PENDING_DOCUMENTS: "outline",
  NON_COMPLIANT: "destructive",
  UNDECLARED: "destructive",
  SUSPENDED: "destructive",
};

const TourismRegistry = () => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState<TourismRegistryEntry[]>(tourismRegistryMock);
  const { toast } = useToast();

  const filtered = entries.filter((e) => {
    const q = search.toLowerCase();
    return (
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.operatorName.toLowerCase().includes(q) ||
      e.district.toLowerCase().includes(q) ||
      (e.nimt ?? "").toLowerCase().includes(q)
    );
  });

  const handleGenerateNimt = async (entry: TourismRegistryEntry) => {
    if (entry.nimt) return;
    try {
      const res = await fetch(`/api/tourism-registry/${entry.id}/generate-nimt`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, nimt: data.nimt, complianceStatus: "DECLARED" } : e));
        toast({ title: "NIMT généré", description: data.nimt });
      } else {
        toast({ title: "Erreur", description: "Impossible de générer le NIMT", variant: "destructive" });
      }
    } catch {
      toast({ title: "API indisponible", description: "Mode hors-ligne — NIMT non généré", variant: "destructive" });
    }
  };

  const handleTransmit = async (entry: TourismRegistryEntry) => {
    if (!entry.nimt) {
      toast({ title: "NIMT requis", description: "Générez d'abord le NIMT avant de transmettre", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`/api/tourism-registry/${entry.id}/transmit-finance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: new Date().getFullYear() }),
      });
      if (res.ok) {
        toast({ title: "Dossier transmis", description: `${entry.name} transmis aux Finances & Impôts` });
      } else {
        toast({ title: "Erreur transmission", variant: "destructive" });
      }
    } catch {
      toast({ title: "API indisponible", variant: "destructive" });
    }
  };

  const withNimt = entries.filter((e) => e.nimt).length;
  const undeclared = entries.filter((e) => e.complianceStatus === "UNDECLARED").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registre national NIMT</h1>
          <p className="text-sm text-muted-foreground">
            Meublés touristiques — République du Congo
          </p>
        </div>
        <Button asChild>
          <Link to="/ministry/tourism-registry/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau dossier
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{entries.length}</p>
            <p className="text-sm text-muted-foreground">Biens recensés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-green-700">{withNimt}</p>
            <p className="text-sm text-muted-foreground">NIMT attribués</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold text-red-600">{undeclared}</p>
            <p className="text-sm text-muted-foreground">Non déclarés</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher nom, NIMT, opérateur…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-normal text-muted-foreground">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">NIMT</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Bien</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Quartier</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Opérateur</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Statut</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground">Risque</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-2">
                      {e.nimt ? (
                        <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                          {e.nimt}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">Non attribué</span>
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium">{e.name}</td>
                    <td className="px-4 py-2 text-muted-foreground">{e.district}</td>
                    <td className="px-4 py-2 text-muted-foreground">{e.operatorName}</td>
                    <td className="px-4 py-2">
                      <Badge variant={STATUS_VARIANT[e.complianceStatus] ?? "outline"}>
                        {STATUS_LABELS[e.complianceStatus] ?? e.complianceStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <span className={`font-semibold ${
                        e.taxRiskScore >= 75 ? "text-red-600" :
                        e.taxRiskScore >= 50 ? "text-orange-500" :
                        e.taxRiskScore >= 25 ? "text-yellow-600" : "text-green-600"
                      }`}>
                        {e.taxRiskScore}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        {!e.nimt && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateNimt(e)}
                            title="Générer le NIMT"
                          >
                            <Hash className="h-3 w-3 mr-1" />
                            NIMT
                          </Button>
                        )}
                        {e.nimt && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTransmit(e)}
                            title="Transmettre aux finances"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Finances
                          </Button>
                        )}
                      </div>
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
};

export default TourismRegistry;
