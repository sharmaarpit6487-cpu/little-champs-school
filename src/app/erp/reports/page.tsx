import { BarChart3, Download, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const REPORTS = [
  { title: "Student List", description: "Complete list of all active students", format: "Excel" },
  { title: "Fee Collection Report", description: "Monthly fee collection summary", format: "PDF" },
  { title: "Pending Fees Report", description: "Students with outstanding fees", format: "Excel" },
  { title: "Attendance Report", description: "Monthly attendance summary by class", format: "PDF" },
  { title: "Admission Report", description: "Admission applications and status", format: "Excel" },
  { title: "Revenue Analysis", description: "Annual revenue breakdown by fee type", format: "PDF" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and export reports</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORTS.map((report) => (
          <Card key={report.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {report.format === "Excel" ? (
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                ) : (
                  <BarChart3 className="h-5 w-5 text-gold" />
                )}
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <Button variant="outline" className="gap-2 w-full">
                <Download className="h-4 w-4" />
                Export {report.format}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
