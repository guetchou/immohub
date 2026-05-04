import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, FileSpreadsheet, BarChart2, ClipboardCheck } from "lucide-react";

interface MockReport {
  id: string;
  title: string;
  type: string;
  generatedAt: string;
  size: string;
}

const mockReports: MockReport[] = [
  {
    id: "r-001",
    title: "Rapport mensuel - Avril 2025",
    type: "Mensuel",
    generatedAt: "2025-05-01",
    size: "1.2 Mo",
  },
  {
    id: "r-002",
    title: "Statistiques conformité - T1 2025",
    type: "Conformité",
    generatedAt: "2025-04-05",
    size: "854 Ko",
  },
  {
    id: "r-003",
    title: "Rapport mensuel - Mars 2025",
    type: "Mensuel",
    generatedAt: "2025-04-01",
    size: "1.1 Mo",
  },
  {
    id: "r-004",
    title: "Analyse risque fiscal - Q1 2025",
    type: "Risque fiscal",
    generatedAt: "2025-03-31",
    size: "2.3 Mo",
  },
];

export default function MinistryReports() {
  function handleExport(type: string) {
    alert(`Export ${type} en cours de génération... (simulation)`);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <FileText className="h-6 w-6" />
        Rapports et exports
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Générer un export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => handleExport("Excel")}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport("PDF")}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport("Rapport mensuel")}>
              <BarChart2 className="h-4 w-4 mr-2" />
              Rapport mensuel
            </Button>
            <Button variant="outline" onClick={() => handleExport("Statistiques conformité")}>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Statistiques conformité
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rapports récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Titre</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Généré le</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Taille</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockReports.map((report) => (
                  <tr key={report.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-3 py-2 font-medium">{report.title}</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {report.type}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {new Date(report.generatedAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{report.size}</td>
                    <td className="px-3 py-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => alert(`Téléchargement de "${report.title}" (simulation)`)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
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
}
