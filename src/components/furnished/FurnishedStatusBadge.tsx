import { Badge } from "@/components/ui/badge";
import { ComplianceStatus } from "@/types/furnished";

interface FurnishedStatusBadgeProps {
  status: ComplianceStatus;
}

const statusConfig: Record<ComplianceStatus, { label: string; className: string }> = {
  UNDECLARED: { label: "Non déclaré", className: "bg-red-100 text-red-800 border-red-200" },
  PENDING_DOCUMENTS: { label: "Documents en attente", className: "bg-orange-100 text-orange-800 border-orange-200" },
  DECLARED: { label: "Déclaré", className: "bg-blue-100 text-blue-800 border-blue-200" },
  AUTHORIZED: { label: "Autorisé", className: "bg-green-100 text-green-800 border-green-200" },
  CLASSIFIED: { label: "Classifié", className: "bg-emerald-100 text-emerald-900 border-emerald-200" },
  NON_COMPLIANT: { label: "Non conforme", className: "bg-red-200 text-red-900 border-red-300" },
  SUSPENDED: { label: "Suspendu", className: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function FurnishedStatusBadge({ status }: FurnishedStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
