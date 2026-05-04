import { useState } from "react";
import { inspectionsMock } from "@/data/ministryMock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList, Plus } from "lucide-react";
import { Inspection } from "@/types/ministry";

const statusConfig: Record<Inspection["status"], { label: string; className: string }> = {
  SCHEDULED: { label: "Planifiée", className: "bg-blue-100 text-blue-700 border-blue-200" },
  CONDUCTED: { label: "Effectuée", className: "bg-green-100 text-green-700 border-green-200" },
  CANCELLED: { label: "Annulée", className: "bg-gray-100 text-gray-600 border-gray-200" },
  PENDING_REPORT: { label: "Rapport en attente", className: "bg-orange-100 text-orange-700 border-orange-200" },
};

export default function MinistryInspections() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ property: "", inspector: "", date: "" });

  function handleSubmit() {
    setOpen(false);
    setForm({ property: "", inspector: "", date: "" });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-6 w-6" />
          Inspections
        </h1>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Planifier inspection
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground font-normal">
            {inspectionsMock.length} inspection{inspectionsMock.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Bien</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Date prévue</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Date effectuée</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Inspecteur</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Constats</th>
                </tr>
              </thead>
              <tbody>
                {inspectionsMock.map((insp) => {
                  const sc = statusConfig[insp.status];
                  return (
                    <tr key={insp.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-3 py-2 font-medium">{insp.propertyName}</td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className={sc.className}>{sc.label}</Badge>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {new Date(insp.scheduledDate).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {insp.conductedDate
                          ? new Date(insp.conductedDate).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{insp.inspectorName}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {insp.findings ? `${insp.findings.length} constat(s)` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Planifier une inspection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="insp-property">Bien concerné</Label>
              <Input
                id="insp-property"
                placeholder="Nom du bien"
                value={form.property}
                onChange={(e) => setForm({ ...form, property: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="insp-inspector">Inspecteur</Label>
              <Input
                id="insp-inspector"
                placeholder="Nom de l'inspecteur"
                value={form.inspector}
                onChange={(e) => setForm({ ...form, inspector: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="insp-date">Date prévue</Label>
              <Input
                id="insp-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit}>Planifier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
