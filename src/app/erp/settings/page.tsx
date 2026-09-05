"use client";

import { useCallback, useEffect, useState } from "react";
import { Settings, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ERPPageHeader } from "@/components/erp/page-header";
import { apiFetch } from "@/lib/api-client";
import { SCHOOL_INFO } from "@/lib/school-data";

const DEFAULT_SETTINGS = {
  school_name: SCHOOL_INFO.name,
  academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  office_email: SCHOOL_INFO.email,
  office_phone: SCHOOL_INFO.phone,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ settings: Record<string, string> }>("/api/settings");
      setSettings({ ...DEFAULT_SETTINGS, ...(data.settings || {}) });
    } catch {
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch("/api/settings", {
        method: "PUT",
        body: JSON.stringify({ settings }),
      });
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <ERPPageHeader
        title="Settings"
        description="Configure school and system settings"
        action={
          <Button className="gap-2" onClick={save} disabled={saving || loading}>
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        }
      />

      <Card className="rounded-2xl border-0 shadow-soft max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-brand-yellow dark:text-amber-400" />
            School Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="school_name">School Name</Label>
                <Input
                  id="school_name"
                  className="mt-1"
                  value={settings.school_name}
                  onChange={(e) => setSettings((s) => ({ ...s, school_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="academic_year">Academic Year</Label>
                <Input
                  id="academic_year"
                  className="mt-1"
                  value={settings.academic_year}
                  onChange={(e) => setSettings((s) => ({ ...s, academic_year: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="office_email">Office Email</Label>
                <Input
                  id="office_email"
                  type="email"
                  className="mt-1"
                  value={settings.office_email}
                  onChange={(e) => setSettings((s) => ({ ...s, office_email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="office_phone">Office Phone</Label>
                <Input
                  id="office_phone"
                  className="mt-1"
                  value={settings.office_phone}
                  onChange={(e) => setSettings((s) => ({ ...s, office_phone: e.target.value }))}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
