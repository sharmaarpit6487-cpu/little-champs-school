import { GraduationCap, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">Teachers</h1>
          <p className="text-muted-foreground">Manage faculty and staff records</p>
        </div>
        <Button variant="gold" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-gold" />
            Faculty Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-12">
            Teacher management interface. Add teachers via the ERP or seed sample data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
