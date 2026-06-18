import { Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage school events and calendar</p>
        </div>
        <Button variant="gold" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gold" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-12">
            Create and manage school events from this dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
