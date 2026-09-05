"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, Plus, Trash2, Loader2 } from "lucide-react";
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
import { announcementSchema } from "@/lib/validations";
import { formatDate } from "@/lib/utils";
import type { z } from "zod";

type AnnouncementForm = z.infer<typeof announcementSchema>;

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  publishedAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { type: "GENERAL", title: "", content: "" },
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements?publishedOnly=false");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setAnnouncements(data.announcements || []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (data: AnnouncementForm) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to publish");
      toast.success("Announcement published");
      setDialogOpen(false);
      reset({ type: "GENERAL", title: "", content: "" });
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to publish");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Unpublish this announcement?")) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Announcement removed");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove");
    }
  };

  return (
    <div className="space-y-6">
      <ERPPageHeader
        title="Announcements"
        description="Publish notices and announcements"
        action={
          <Button variant="default" className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Announcement
          </Button>
        }
      />

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-brand-yellow dark:text-amber-400" />
            All Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : announcements.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No announcements yet. Create one to notify parents and staff.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-border flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{item.type}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(item.publishedAt)}</span>
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.content}</p>
                  </div>
                  <Button variant="ghost" size="icon" aria-label="Remove announcement" onClick={() => handleRemove(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Announcement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" {...register("title")} className="mt-1" />
              {errors.title && <p className="text-sm text-destructive mt-1" role="alert">{errors.title.message}</p>}
            </div>
            <div>
              <Label>Type *</Label>
              <Select defaultValue="GENERAL" onValueChange={(v) => setValue("type", v as AnnouncementForm["type"])}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["GENERAL", "URGENT", "ACADEMIC", "FEE", "EVENT"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content">Message *</Label>
              <Textarea id="content" rows={5} {...register("content")} className="mt-1" />
              {errors.content && <p className="text-sm text-destructive mt-1" role="alert">{errors.content.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Publishing..." : "Publish Announcement"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
