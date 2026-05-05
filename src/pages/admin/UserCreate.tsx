import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const ROLES = [
  { value: "USER", label: "Utilisateur" },
  { value: "TENANT", label: "Locataire" },
  { value: "LANDLORD", label: "Propriétaire" },
  { value: "AGENCY", label: "Agence" },
  { value: "FURNISHED_OPERATOR", label: "Opérateur Meublé" },
  { value: "MINISTRY_VIEWER", label: "Ministry Viewer" },
  { value: "MINISTRY_INSPECTOR", label: "Inspecteur" },
  { value: "MINISTRY_ADMIN", label: "Ministry Admin" },
  { value: "COMPLIANCE_AGENT", label: "Agent Conformité" },
  { value: "FINANCE_VIEWER", label: "Finance Viewer" },
  { value: "TAX_ANALYST", label: "Analyste Fiscal" },
  { value: "ADMIN", label: "Administrateur" },
];

const STATUSES = [
  { value: "ACTIVE", label: "Actif" },
  { value: "PENDING", label: "En attente" },
  { value: "SUSPENDED", label: "Suspendu" },
];

export default function UserCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "USER",
    status: "ACTIVE",
    phone: "",
    organization: "",
    department: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = "Nom requis";
    if (!form.email.trim()) e.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.password) e.password = "Mot de passe requis";
    else if (form.password.length < 10) e.password = "Minimum 10 caractères";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await usersAPI.create({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role,
        status: form.status,
        phone: form.phone || undefined,
        organization: form.organization || undefined,
        department: form.department || undefined,
      });
      toast({ title: "Utilisateur créé avec succès" });
      navigate("/admin/users");
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.response?.data?.message || "Impossible de créer l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate("/admin/users")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la liste
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Créer un utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identité */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Nom complet *</Label>
                <Input id="full_name" {...field("full_name")} />
                {errors.full_name && <p className="text-destructive text-sm mt-1">{errors.full_name}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" {...field("phone")} placeholder="+242 XX XXX XXXX" />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...field("email")} />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Mot de passe */}
            <div>
              <Label htmlFor="password">Mot de passe * (min. 10 caractères)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...field("password")}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Rôle et statut */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Rôle *</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Statut initial</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Organisation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organization">Organisation</Label>
                <Input id="organization" {...field("organization")} placeholder="Ex : Ministère du Tourisme" />
              </div>
              <div>
                <Label htmlFor="department">Département</Label>
                <Input id="department" {...field("department")} placeholder="Ex : Direction des Inspections" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/users")}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer l'utilisateur"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
