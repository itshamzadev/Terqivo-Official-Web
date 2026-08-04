import { useEffect, useState } from "react";
import { MessageCircle, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";

type WhatsAppSettings = {
  enabled: boolean;
  adminPhone: string;
  notifyOnContact: boolean;
  notifyOnCourseEnrollment: boolean;
  notifyOnJobApplication: boolean;
  notifyOnPayment: boolean;
};

const defaults: WhatsAppSettings = {
  enabled: true,
  adminPhone: "03470028168",
  notifyOnContact: true,
  notifyOnCourseEnrollment: true,
  notifyOnJobApplication: true,
  notifyOnPayment: true,
};

export default function AdminWhatsAppSettings() {
  const [settings, setSettings] = useState<WhatsAppSettings>(defaults);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const load = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch("/api/whatsapp/settings");
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not load WhatsApp settings");
      setStatus(result.data);
      setSettings({ ...defaults, ...(result.data?.settings || {}) });
    } catch (error: any) {
      toast.error(error.message || "Could not load WhatsApp settings");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => { void load(false); }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/whatsapp/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not save WhatsApp settings");
      setStatus(result.data);
      setSettings({ ...defaults, ...(result.data?.settings || {}) });
      toast.success("WhatsApp settings saved");
    } catch (error: any) {
      toast.error(error.message || "Could not save WhatsApp settings");
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    setTesting(true);
    try {
      const response = await fetch("/api/whatsapp/test", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "WhatsApp test failed");
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message || "WhatsApp test failed");
    } finally {
      setTesting(false);
      void load();
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading WhatsApp settings...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">WhatsApp Alerts</h1>
          <p className="text-muted-foreground mt-1">Receive important website activity on your WhatsApp Business number.</p>
        </div>
        <div className="flex items-center gap-3"><button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"><RefreshCw className="h-4 w-4" /> Refresh</button><MessageCircle className="h-8 w-8 text-green-600" /></div>
      </div>

      <div className={`rounded-xl border p-4 ${status?.configured ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
        <p className="font-semibold">{status?.configured ? "WhatsApp is connected" : status?.provider === "web" ? `WhatsApp Web status: ${status?.connectionStatus || "starting"}` : "WhatsApp API still needs server credentials"}</p>
        <p className="text-sm mt-1">Provider: {status?.provider || "web"} · Recipient: {status?.recipient || "not configured"}</p>
        {status?.provider === "web" && !status?.configured && <p className="text-sm mt-2">Open this page and scan the QR code below. The session is stored in MongoDB so it can survive redeploys.</p>}
        {status?.provider !== "web" && !status?.configured && <p className="text-sm mt-2">Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in the server environment. The token is never stored in this panel.</p>}
        {status?.lastError && <p className="text-sm mt-2 text-red-700">{status.lastError}</p>}
      </div>

      {status?.provider === "web" && status?.qrDataUrl && <div className="rounded-xl border bg-background p-6 text-center space-y-3"><h2 className="font-semibold">Scan this QR with WhatsApp</h2><img src={status.qrDataUrl} alt="WhatsApp login QR code" className="mx-auto w-[360px] max-w-full border rounded-lg" /><p className="text-xs text-muted-foreground">WhatsApp on your phone → Linked devices → Link a device.</p></div>}

      <div className="rounded-xl border bg-background p-6 space-y-5">
        <label className="flex items-center gap-3 font-medium"><input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings((old) => ({ ...old, enabled: e.target.checked }))} /> Enable WhatsApp alerts</label>
        <label className="block text-sm font-medium">Admin WhatsApp number<input value={settings.adminPhone} onChange={(e) => setSettings((old) => ({ ...old, adminPhone: e.target.value }))} placeholder="03470028168" className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3" /><span className="text-xs text-muted-foreground">Pakistan local format is accepted and converted automatically.</span></label>
        <div className="grid md:grid-cols-2 gap-3 border-t pt-5">
          {(["notifyOnContact", "notifyOnCourseEnrollment", "notifyOnJobApplication", "notifyOnPayment"] as const).map((key) => (
            <label key={key} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={settings[key]} onChange={(e) => setSettings((old) => ({ ...old, [key]: e.target.checked }))} /> {key === "notifyOnContact" ? "Contact form messages" : key === "notifyOnCourseEnrollment" ? "Course enrollments / orders" : key === "notifyOnJobApplication" ? "Job applications" : "Payment and status updates"}</label>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 border-t pt-5"><button onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save settings"}</button><button onClick={() => void test()} disabled={testing} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 disabled:opacity-50"><RefreshCw className="h-4 w-4" /> {testing ? "Sending..." : "Send test WhatsApp"}</button></div>
      </div>

      {status?.recipientLink && <a href={status.recipientLink} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">Open WhatsApp chat for this number</a>}
    </div>
  );
}
