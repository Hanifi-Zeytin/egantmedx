import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Clock3, BadgeCheck, XCircle, Users, Building2, ScrollText, LayoutGrid, AlertTriangle } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Panel, EmptyState } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ACCOUNTS, WORKSPACES } from "@/data/demo";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const VCLS = { "İnceleniyor": "text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300", "Doğrulandı": "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300", "Reddedildi": "text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300" };
const Pill = ({ s }) => <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", VCLS[s])}>{s}</span>;

const Stat = ({ icon: Icon, label, value, testId }) => (
  <Panel className="p-4" data-testid={testId}><Icon className="h-4 w-4 text-muted-foreground" /><div className="mt-3 font-display text-2xl font-bold">{value}</div><div className="text-[12px] text-muted-foreground">{label}</div></Panel>
);

const ReviewDialog = ({ doc, onClose }) => {
  const { set, log } = useStore();
  const [reason, setReason] = useState("");
  const decide = (status) => {
    if (status === "Reddedildi" && !reason.trim()) { toast.error("Ret gerekçesi gereklidir"); return; }
    set((s) => ({ physicians: s.physicians.map((p) => (p.id === doc.id ? { ...p, status, reason: reason.trim() || undefined } : p)) }));
    log(`${doc.name} → ${status}${reason ? ` (${reason})` : ""}`);
    toast.success(`${doc.name}: ${status}`);
    onClose();
  };
  return (
    <Dialog open={!!doc} onOpenChange={(o) => !o && onClose()}>
      <DialogContent data-testid="review-dialog">
        <DialogHeader><DialogTitle>Doğrulama incelemesi</DialogTitle><DialogDescription>{doc?.name} · {doc?.title} · {doc?.city}</DialogDescription></DialogHeader>
        <div className="rounded-lg border bg-surface p-3 text-[13px]"><div className="text-muted-foreground">Yüklenen belge</div><div className="mt-0.5 font-medium">{doc?.doc} <span className="text-[11px] text-muted-foreground">(örnek — dosya içeriği yok)</span></div></div>
        <Textarea data-testid="review-reason-input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ret gerekçesi (reddetmek için zorunlu)" rows={2} />
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => decide("Reddedildi")} data-testid="review-reject-button" className="text-rose-700"><XCircle className="mr-2 h-4 w-4" />Reddet</Button>
          <Button onClick={() => decide("Doğrulandı")} data-testid="review-approve-button" className="bg-emerald-600 text-white hover:bg-emerald-700"><BadgeCheck className="mr-2 h-4 w-4" />Onayla</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function Admin() {
  const { state, set } = useStore();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);

  if (state.workspace !== "admin") return (
    <EmptyState testId="admin-locked" icon={ShieldCheck} title="Bu alan yalnızca yönetici çalışma alanında görüntülenir" text="Platform yönetimi yetkileri hekim yetkilerinden ayrıdır."
      action={<Button onClick={() => { set({ workspace: "admin" }); navigate("/yonetim"); }} data-testid="admin-switch-button">Platform Yönetimi'ne geç</Button>} />
  );

  const ph = state.physicians;
  const pending = ph.filter((p) => p.status === "İnceleniyor");
  return (
    <div className="space-y-8" data-testid="admin-page">
      <PageHeader eyebrow="Platform Yönetimi" title="Yönetim" description="Hekim doğrulama, hesap ve çalışma alanı yönetimi. Tüm kayıtlar örnektir." />
      <div className="flex items-start gap-3 rounded-xl border border-amber-300/70 bg-amber-50/60 p-4 text-[13px] text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200" data-testid="admin-permission-note"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />Yönetici yetkisi, hekim onayı anlamına gelmez. Klinik modüllere erişim yalnızca doğrulanmış hekim hesaplarıyla mümkündür.</div>
      <Tabs defaultValue="overview">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
          {[["overview", "Genel bakış", LayoutGrid], ["queue", `Doğrulama kuyruğu (${pending.length})`, Clock3], ["accounts", "Hesaplar", Users], ["workspaces", "Çalışma alanları", Building2], ["logs", "Kayıtlar", ScrollText]].map(([v, l, I]) => (
            <TabsTrigger key={v} value={v} data-testid={`admin-tab-${v}`} className="gap-1.5 rounded-lg border border-transparent px-3 py-1.5 data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm"><I className="h-3.5 w-3.5" />{l}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={Clock3} label="Bekleyen doğrulama" value={pending.length} testId="admin-stat-pending" />
            <Stat icon={BadgeCheck} label="Doğrulanmış hekim" value={ph.filter((p) => p.status === "Doğrulandı").length} testId="admin-stat-verified" />
            <Stat icon={XCircle} label="Reddedilen başvuru" value={ph.filter((p) => p.status === "Reddedildi").length} testId="admin-stat-rejected" />
            <Stat icon={Building2} label="Çalışma alanı" value={WORKSPACES.length} testId="admin-stat-workspaces" />
          </div>
        </TabsContent>
        <TabsContent value="queue" className="mt-6 space-y-2">
          {ph.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center" data-testid={`queue-item-${p.id}`}>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="font-semibold text-[14px]">{p.name}</span><Pill s={p.status} /></div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">{p.title} · {p.city} · {p.doc} · başvuru {timeAgo(p.submitted)}{p.reason && ` · Gerekçe: ${p.reason}`}</div></div>
              {p.status === "İnceleniyor" ? <Button size="sm" onClick={() => setReview(p)} data-testid={`queue-review-${p.id}`}>İncele</Button>
                : <Button size="sm" variant="ghost" onClick={() => set((s) => ({ physicians: s.physicians.map((x) => (x.id === p.id ? { ...x, status: "İnceleniyor", reason: undefined } : x)) }))} data-testid={`queue-reopen-${p.id}`}>Yeniden incele</Button>}
            </div>
          ))}
        </TabsContent>
        <TabsContent value="accounts" className="mt-6">
          <Panel className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-[13px]" data-testid="accounts-table">
              <thead className="border-b text-[11.5px] text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Ad</th><th className="px-4 py-3 font-medium">E-posta</th><th className="px-4 py-3 font-medium">Yetkiler</th><th className="px-4 py-3 font-medium">Çalışma alanları</th></tr></thead>
              <tbody>{ACCOUNTS.map((a) => <tr key={a.id} className="border-b last:border-0"><td className="px-4 py-3 font-medium">{a.name}</td><td className="px-4 py-3 text-muted-foreground">{a.email}</td><td className="px-4 py-3"><div className="flex flex-wrap gap-1">{a.roles.map((r) => <span key={r} className={cn("rounded px-1.5 py-0.5 text-[11px]", r.includes("Yönetici") ? "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300" : "bg-brand-soft text-brand-fg")}>{r}</span>)}</div></td><td className="px-4 py-3 text-muted-foreground">{a.ws}</td></tr>)}</tbody>
            </table>
          </Panel>
        </TabsContent>
        <TabsContent value="workspaces" className="mt-6 grid gap-3 md:grid-cols-3">
          {WORKSPACES.map((w) => <Panel key={w.id} className="p-4" data-testid={`admin-workspace-${w.id}`}><div className="text-[14px] font-semibold">{w.name}</div><div className="text-[12px] text-muted-foreground">{w.sub}</div><div className="mt-3 inline-block rounded bg-surface px-2 py-0.5 font-mono text-[11px]">{w.type === "admin" ? "Yönetici bağlamı" : "Hekim bağlamı"}</div></Panel>)}
        </TabsContent>
        <TabsContent value="logs" className="mt-6">
          <Panel className="divide-y" data-testid="admin-logs">{state.audit.map((l) => <div key={l.id} className="flex items-center justify-between px-4 py-2.5 text-[13px]"><span>{l.text}</span><span className="font-mono text-[11px] text-muted-foreground">{timeAgo(l.at)}</span></div>)}</Panel>
        </TabsContent>
      </Tabs>
      <ReviewDialog doc={review} onClose={() => setReview(null)} />
    </div>
  );
}
