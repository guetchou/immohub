import { Badge } from "@/components/ui/badge";
import { complianceDocumentsMock } from "@/data/complianceMock";
import { DocumentStatus, DocumentType } from "@/types/compliance";

interface FurnishedCompliancePanelProps {
  propertyId: string;
}

const docTypeLabels: Record<DocumentType, string> = {
  REGISTRATION_CERTIFICATE: "Certificat d'immatriculation",
  TAX_CLEARANCE: "Quitus fiscal",
  FIRE_SAFETY: "Sécurité incendie",
  HEALTH_PERMIT: "Permis sanitaire",
  CLASSIFICATION_CERTIFICATE: "Certificat de classification",
  INSURANCE: "Assurance",
  LEASE_AGREEMENT: "Bail",
  FLOOR_PLAN: "Plan de masse",
  INSPECTION_REPORT: "Rapport d'inspection",
};

const statusConfig: Record<DocumentStatus, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "bg-gray-100 text-gray-600 border-gray-200" },
  SUBMITTED: { label: "Soumis", className: "bg-blue-100 text-blue-700 border-blue-200" },
  UNDER_REVIEW: { label: "En révision", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  VALIDATED: { label: "Validé", className: "bg-green-100 text-green-700 border-green-200" },
  REJECTED: { label: "Rejeté", className: "bg-red-100 text-red-700 border-red-200" },
  EXPIRED: { label: "Expiré", className: "bg-orange-100 text-orange-700 border-orange-200" },
};

function fmt(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

export function FurnishedCompliancePanel({ propertyId }: FurnishedCompliancePanelProps) {
  const docs = complianceDocumentsMock.filter((d) => d.propertyId === propertyId);

  if (docs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">Aucun document enregistré pour ce bien.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="text-left px-3 py-2 font-medium text-muted-foreground">Type document</th>
            <th className="text-left px-3 py-2 font-medium text-muted-foreground">Statut</th>
            <th className="text-left px-3 py-2 font-medium text-muted-foreground">Soumis le</th>
            <th className="text-left px-3 py-2 font-medium text-muted-foreground">Validé le</th>
            <th className="text-left px-3 py-2 font-medium text-muted-foreground">Expiration</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => {
            const sc = statusConfig[doc.status];
            return (
              <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-3 py-2">{docTypeLabels[doc.type]}</td>
                <td className="px-3 py-2">
                  <Badge variant="outline" className={sc.className}>{sc.label}</Badge>
                </td>
                <td className="px-3 py-2 text-muted-foreground">{fmt(doc.submittedAt)}</td>
                <td className="px-3 py-2 text-muted-foreground">{fmt(doc.validatedAt)}</td>
                <td className="px-3 py-2 text-muted-foreground">{fmt(doc.expiresAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
