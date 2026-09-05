"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ERPPageHeader } from "@/components/erp/page-header";
import { eventSchema } from "@/lib/validations";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { z } from "zod";

type EventForm = z.infer<typeof eventSchema>;

interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string | null;
  location: string | null;
}

export default function EventsPage() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: "OTHER",
      title: "",
      description: "",
      startDate: new Date().toISOString().slice(0, 16),
    },
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load events");
      setEvents(data.events || []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (data: EventForm) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create event");
      toast.success("Event created");
      setDialogOpen(false);
      reset();
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this event from the calendar?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Event removed");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove event");
    }
  };

  return (
    <div className="space-y-6">
      <ERPPageHeader
        title="Events"
        description="Manage school events and calendar"
        action={
          <Button variant="default" className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        }
      />

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-yellow dark:text-amber-400" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : events.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No events scheduled. Create your first school event.</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="p-4 rounded-xl border border-border flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{event.type}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDateTime(event.startDate)}</span>
                    </div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    {event.location && <p className="text-xs text-muted-foreground mt-1">📍 {event.location}</p>}
                    {event.endDate && <p className="text-xs text-muted-foreground">Until {formatDate(event.endDate)}</p>}
                  </div>
                  <Button variant="ghost" size="icon" aria-label="Remove event" onClick={() => handleRemove(event.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="eventTitle">Title *</Label>
              <Input id="eventTitle" {...register("title")} className="mt-1" />
              {errors.title && <p className="text-sm text-destructive mt-1" role="alert">{errors.title.message}</p>}
            </div>
            <div>
              <Label>Type *</Label>
              <Select defaultValue="OTHER" onValueChange={(v) => setValue("type", v as EventForm["type"])}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["ACADEMIC", "SPORTS", "CULTURAL", "HOLIDAY", "MEETING", "OTHER"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" rows={4} {...register("description")} className="mt-1" />
              {errors.description && <p className="text-sm text-destructive mt-1" role="alert">{errors.description.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start *</Label>
                <Input id="startDate" type="datetime-local" {...register("startDate")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="endDate">End</Label>
                <Input id="endDate" type="datetime-local" {...register("endDate")} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} className="mt-1" />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
