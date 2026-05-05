import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usersAPI } from "@/services/api";
import { UserRole, UserStatus } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Ban, CheckCircle, KeyRound, Trash2 } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  organization?: string;
  department?: string;
  created_at: string;
  updated_at?: string;
  last_login_at?: string;
}

const ALL_ROLES: UserRole[] = [
  "USER", "TENANT", "LANDLORD", "AGENCY", "FURNISHED_OPERATOR",
  "MINISTRY_VIEWER", "MINISTRY_INSPECTOR", "MINISTRY_ADMIN",
  "COMPLIANCE_AGENT", "FINANCE_VIEWER", "TAX_ANALYST", "ADMIN",
];

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "default",
  SUSPENDED: "destructive",
  DISABLED: "secondary",
  PENDING: "outline",
};

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "", organization: "", department: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    usersAPI.getById(id)
      .then(({ data }) => {
        setUser(data.user);
        setEditForm({
          full_name: data.user.full_name,
          phone: data.user.phone || "",
          organization: data.user.organization || "",
          department: data.user.department || "",
        });
      })
      .catch(() => toast({ title: "Erreur", description: "Utilisateur introuvable", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [id, toast]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const { data } = await usersAPI.update(id, editForm);
      setUser(data.user);
      setIsEditing(false);
      toast({ title: "Profil mis à jour" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de sauvegarder", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (role: string) => {
    if (!id || !user) return;
    try {
      await usersAPI.updateRole(id, role);
      setUser({ ...user, role: role as UserRole });
      toast({ title: "Rôle mis à jour", description: `Nouveau rôle : ${role}` });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.response?.data?.message || "Impossible de changer le rôle", variant: "destructive" });
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!id || !user) return;
    try {
      await usersAPI.updateStatus(id, status);
      setUser({ ...user, status: status as UserStatus });
      toast({ title: "Statut mis à jour", description: `Nouveau statut : ${status}` });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.response?.data?.message || "Impossible de changer le statut", variant: "destructive" });
    }
  };

  const handleResetPassword = async () => {
    if (!id || !user) return;
    if (!confirm(`Réinitialiser le mot de passe de ${user.email} ?`)) return;
    try {
      const { data } = await usersAPI.resetPassword(id);
      toast({
        title: "Mot de passe temporaire généré",
        description: `Mot de passe : ${data.temp_password} — À transmettre manuellement.`,
        duration: 20000,
      });
    } catch {
      toast({ title: "Erreur", description: "Impossible de réinitialiser le mot de passe", variant: "destructive" });
    }
  };

  const handleDisable = async () => {
    if (!id || !user) return;
    if (!confirm(`Désactiver définitivement le compte de ${user.email} ?`)) return;
    try {
      await usersAPI.disable(id);
      toast({ title: "Compte désactivé" });
      navigate("/admin/users");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.response?.data?.message || "Impossible de désactiver", variant: "destructive" });
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  if (!user) return <div className="container mx-auto px-4 py-8">Utilisateur introuvable.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate("/admin/users")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la liste
      </Button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user.full_name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={statusBadgeVariant[user.status] ?? "outline"}>{user.status}</Badge>
          <Badge variant="outline">{user.role}</Badge>
        </div>
      </div>

      {/* Profil */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Informations du compte</CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Modifier</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Annuler</Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-1" />
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Nom complet</Label>
            <Input
              value={editForm.full_name}
              onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Organisation</Label>
            <Input
              value={editForm.organization}
              onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Département</Label>
            <Input
              value={editForm.department}
              onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label>Créé le</Label>
            <Input value={new Date(user.created_at).toLocaleDateString("fr-FR")} disabled />
          </div>
          <div>
            <Label>Dernière connexion</Label>
            <Input
              value={user.last_login_at ? new Date(user.last_login_at).toLocaleString("fr-FR") : "Jamais"}
              disabled
            />
          </div>
        </CardContent>
      </Card>

      {/* Rôle */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rôle</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={user.role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_ROLES.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-3">
            {user.status === "ACTIVE" ? (
              <Button variant="outline" onClick={() => handleStatusChange("SUSPENDED")}>
                <Ban className="h-4 w-4 mr-2 text-destructive" />
                Suspendre le compte
              </Button>
            ) : (
              <Button variant="outline" onClick={() => handleStatusChange("ACTIVE")}>
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Réactiver le compte
              </Button>
            )}
            <Button variant="outline" onClick={handleResetPassword}>
              <KeyRound className="h-4 w-4 mr-2" />
              Réinitialiser le mot de passe
            </Button>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              La désactivation est irréversible depuis cette interface (soft delete). L'utilisateur ne pourra plus se connecter.
            </p>
            <Button variant="destructive" onClick={handleDisable}>
              <Trash2 className="h-4 w-4 mr-2" />
              Désactiver définitivement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
