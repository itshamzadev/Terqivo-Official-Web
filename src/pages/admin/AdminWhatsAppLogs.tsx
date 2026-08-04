import { useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";

export default function AdminWhatsAppLogs() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/whatsapp/logs").then((response) => response.json()).then((result) => setItems(result.data || [])).finally(() => setLoading(false));
  }, []);

  return <div className="space-y-6"><div><h1 className="text-3xl font-heading font-bold">WhatsApp Logs</h1><p className="text-muted-foreground mt-1">Delivery history and full notification details.</p></div><Card><CardContent className="p-0 overflow-x-auto"><table className="w-full text-sm"><thead className="bg-muted/50 border-b"><tr><th className="p-4 text-left">Event</th><th className="p-4 text-left">Status</th><th className="p-4 text-left">Details</th><th className="p-4 text-left">Date</th></tr></thead><tbody>{loading ? <tr><td colSpan={4} className="p-8 text-center">Loading WhatsApp logs...</td></tr> : items.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No WhatsApp notifications yet.</td></tr> : items.map((item) => <tr key={item._id} className="border-b align-top"><td className="p-4 whitespace-nowrap">{item.eventType}</td><td className="p-4"><span className={item.status === "sent" ? "text-green-700" : item.status === "failed" ? "text-red-700" : "text-amber-700"}>{item.status}</span>{item.errorMessage && <p className="text-xs text-muted-foreground mt-1">{item.errorMessage}</p>}</td><td className="p-4 min-w-[420px]"><pre className="whitespace-pre-wrap font-sans text-xs">{item.message}</pre></td><td className="p-4 whitespace-nowrap text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</td></tr>)}</tbody></table></CardContent></Card></div>;
}
