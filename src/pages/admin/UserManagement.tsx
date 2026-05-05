import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usersAPI } from "@/services/api";
import { UserRole, UserStatus } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Search, RefreshCw, Eye, Ban, CheckCircle, KeyRound } from "lucide-react";

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
  last_login_at?: string;
}

/* shadcn SelectItem ne supporte pas value="" — on utilise "all" comme sentinelle */
const ROLES: { value: string; label: string }[] = [
  { value: "all", label: "Tous les rôles" },
  { value: "ADMIN", label: "Admin" },
  { value: "MINISTRY_ADMIN", label: "Ministry Admin" },
  { value: "MINISTRY_VIEWER", label: "Ministry Viewer" },
  { value: "MINISTRY_INSPECTOR", label: "Inspecteur" },
  { value: "COMPLIANCE_AGENT", label: "Agent Conformité" },
  { value: "FINANCE_VIEWER", label: "Finance Viewer" },
  { value: "TAX_ANALYST", label: "Analyste Fiscal" },
  { value: "FURNISHED_OPERATOR", label: "Opérateur Meublé" },
  { value: "LANDLORD", label: "Propriétaire" },
  { value: "AGENCY", label: "Agence" },
  { value: "USER", label: "Utilisateur" },
  { value: "TENANT", label: "Locataire" },
];

const STATUSES: { value: string; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "ACTIVE", label: "Actif" },
  { value: "SUSPENDED", label: "Suspendu" },
  { value: "DISABLED", label: "Désactivé" },
  { value: "PENDING", label: "En attente" },
];

const roleBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ADMIN: "destructive",
  MINISTRY_ADMIN: "destructive",
  MINISTRY_INSPECTOR: "default",
  COMPLIANCE_AGENT: "default",
  FINANCE_VIEWER: "secondary",
  TAX_ANALYST: "secondary",
  FURNISHED_OPERATOR: "outline",
  DEFAULT: "outline",
};

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "default",
  SUSPENDED: "destructive",
  DISABLED: "secondary",
  PENDING: "outline",
};

export default function UserManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await usersAPI.getAll({
        search: search || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        limit: 100,
      });
      setUsers(data.users);
      setTotal(data.total);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les utilisateurs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await usersAPI.updateStatus(id, newStatus);
      toast({ title: "Statut mis à jour" });
      fetchUsers();
    } catch {
      toast({ title: "Erreur", description: "Impossible de changer le statut", variant: "destructive" });
    }
  };

  const handleResetPassword = async (id: string, email: string) => {
    if (!confirm(`Réinitialiser le mot de passe de ${email} ?`)) return;
    try {
      const { data } = await usersAPI.resetPassword(id);
      toast({
        title: "Mot de passe réinitialisé",
        description: `Mot de passe temporaire : ${data.temp_password}`,
        duration: 15000,
      });
    } catch {
      toast({ title: "Erreur", description: "Impossible de réinitialiser le mot de passe", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground mt-1">{total} utilisateur{total !== 1 ? "s" : ""} au total</p>
        </div>
        <Button onClick={() => navigate("/admin/users/new")}>
          <UserPlus className="h-4 w-4 mr-2" />
          Créer un utilisateur
        </Button>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par email ou nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchUsers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom / Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {loading ? "Chargement..." : "Aucun utilisateur trouvé"}
                    </TableCell>
                  </TableRow>
                )}
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleBadgeVariant[user.role] ?? "outline"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant[user.status] ?? "outline"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{user.organization || "—"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleDateString("fr-FR")
                          : "Jamais"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost" size="icon"
                          title="Voir le détail"
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {user.status === "ACTIVE" ? (
                          <Button
                            variant="ghost" size="icon"
                            title="Suspendre"
                            onClick={() => handleStatusChange(user.id, "SUSPENDED")}
                          >
                            <Ban className="h-4 w-4 text-destructive" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost" size="icon"
                            title="Réactiver"
                            onClick={() => handleStatusChange(user.id, "ACTIVE")}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost" size="icon"
                          title="Réinitialiser le mot de passe"
                          onClick={() => handleResetPassword(user.id, user.email)}
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
