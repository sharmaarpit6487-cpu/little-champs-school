import { ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">Mark and manage student attendance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-gold" />
            Mark Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Select a class and date to mark attendance for students.
          </p>
          <Button variant="gold">Mark Today&apos;s Attendance</Button>
        </CardContent>
      </Card>
    </div>
  );
}
