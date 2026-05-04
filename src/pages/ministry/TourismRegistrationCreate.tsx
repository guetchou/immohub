import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const DISTRICTS = ["Bacongo", "Moungali", "Poto-Poto", "Centre-Ville", "Makélékélé", "Talangaï", "Ouenzé", "Mfilou"];

const TourismRegistrationCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    district: "",
    city: "Brazzaville",
    operator_name: "",
    total_units: "",
    price_per_night: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.operator_name || !form.district) {
      toast({ title: "Champs requis", description: "Nom, opérateur et quartier sont obligatoires", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tourism-registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          total_units: parseInt(form.total_units) || 0,
          price_per_night: parseFloat(form.price_per_night) || 0,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast({ title: "Dossier créé", description: `Identifiant : ${data.id}` });
        navigate("/ministry/tourism-registry");
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Erreur", description: err.message || "Création impossible", variant: "destructive" });
      }
    } catch {
      toast({ title: "API indisponible", description: "Vérifiez votre connexion", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nouveau dossier meublé touristique</h1>
          <p className="text-sm text-muted-foreground">Enregistrement au registre national NIMT</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Identification du bien</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nom du bien *</Label>
              <Input
                id="name"
                placeholder="Ex: Résidence Les Flamboyants"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                placeholder="Rue, numéro"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Quartier *</Label>
                <Select value={form.district} onValueChange={(v) => update("district", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Opérateur et capacité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="operator">Opérateur / Propriétaire *</Label>
              <Input
                id="operator"
                placeholder="Nom ou raison sociale"
                value={form.operator_name}
                onChange={(e) => update("operator_name", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="units">Nombre d'unités</Label>
                <Input
                  id="units"
                  type="number"
                  min={1}
                  placeholder="Ex: 10"
                  value={form.total_units}
                  onChange={(e) => update("total_units", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Prix / nuit (F CFA)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  placeholder="Ex: 25000"
                  value={form.price_per_night}
                  onChange={(e) => update("price_per_night", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Enregistrement…" : "Créer le dossier"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TourismRegistrationCreate;
