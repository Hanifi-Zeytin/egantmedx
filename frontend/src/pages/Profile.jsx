import { BadgeCheck, Clock3, XCircle, Moon, Sun, RotateCcw, Trash2, Building2, Mail, Stethoscope, FileText, UploadCloud, Check } from "lucide-react";
import { useRef } from "react";
import { useStore, usePhysician } from "@/lib/store";
import { PageHeader, Panel } from "@/components/common";
import { VerificationPill } from "@/components/layout/Topbar";
import { WORKSPACES } from "@/data/demo";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATES = [
  { k: "İnceleniyor", icon: Clock3, text: "Belgeleriniz yönetici tarafından inceleniyor. Bu süreçte klinik sorgu yapılamaz." },
  { k: "Doğrulandı", icon: BadgeCheck, text: "Hekim kimliğiniz doğrulandı. Ücretsiz Deneme kapsamında 5 klinik sorgu tanımlandı." },
  { k: "Reddedildi", icon: XCircle, text: "Belgeleriniz doğrulanamadı. Güncel belge yükleyerek yeniden başvurabilirsiniz." },
];

const Info = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 border-b py-3 last:border-0"><Icon className="h-4 w-4 text-muted-foreground" /><span className="w-36 text-[12.5px] text-muted-foreground">{label}</span><span className="min-w-0 truncate text-[13.5px] font-medium">{value}</span></div>
);

export default function Profile() {
  const { state, set, toggleTheme, resetDemo, emptyDemo, setPhysicianStatus, log } = useStore();
  const PHYSICIAN = usePhysician();
  const fileRef = useRef(null);
  const setStatus = (k) => (state.profile ? setPhysicianStatus("me", k) : set({ verification: k }));
  const reupload = (files) => {
    const docs = [...files].map((f) => ({ name: f.name, size: f.size }));
    if (!docs.length) return;
    if (state.profile) set((s) => ({ profile: { ...s.profile, docs: [...s.profile.docs, ...docs.filter((d) => !s.profile.docs.some((x) => x.name === d.name && x.size === d.size))] }, physicians: s.physicians.map((p) => (p.id === "me" ? { ...p, doc: docs.map((d) => d.name).join(", "), submitted: new Date().toISOString() } : p)) }));
    setStatus("İnceleniyor");
    log(`${PHYSICIAN.name} belgelerini yeniden yükledi`);
    toast.success("Belgeler yeniden incelemeye gönderildi");
  };
  const ws = WORKSPACES.find((w) => w.id === state.workspace);
  const current = STATES.find((s) => s.k === state.verification);
  return (
    <div className="space-y-10" data-testid="profile-page">
      <PageHeader eyebrow="Hesap" title="Profil" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6 min-w-0">
          <Panel className="p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-navy font-display text-lg font-bold text-white">{PHYSICIAN.initials}</div>
              <div className="min-w-0 flex-1"><div className="font-display text-xl font-bold" data-testid="profile-name">{PHYSICIAN.name}</div><div className="text-[13px] text-muted-foreground">{PHYSICIAN.title}</div></div>
              <VerificationPill status={state.verification} testId="profile-verification-pill" />
            </div>
            <div className="mt-5">
              <Info icon={Stethoscope} label="Uzmanlık" value={PHYSICIAN.title} />
              <Info icon={Building2} label="Kurum" value={PHYSICIAN.institution} />
              <Info icon={Mail} label="E-posta" value={PHYSICIAN.email} />
              <Info icon={FileText} label="Diploma tescil no" value={<span className="font-mono">{PHYSICIAN.diploma}</span>} />
            </div>
          </Panel>

          <Panel className="p-6 sm:p-8" data-testid="profile-verification-card">
            <div className="eyebrow mb-6">Hekim doğrulama süreci</div>
            <ol className="relative space-y-6 border-l pl-6" data-testid="verification-timeline">
              {[
                { t: "Başvuru alındı", d: state.profile ? "Hesap ve mesleki bilgiler kaydedildi." : "Demo hesabı oluşturuldu.", done: true },
                { t: "Belge incelemesi", d: state.verification === "İnceleniyor" ? "Yönetici belgelerinizi inceliyor." : "İnceleme tamamlandı.", done: state.verification !== "İnceleniyor", current: state.verification === "İnceleniyor" },
                { t: state.verification === "Reddedildi" ? "Reddedildi" : "Doğrulandı", d: current.text, done: state.verification === "Doğrulandı", fail: state.verification === "Reddedildi" },
              ].map((s, i) => (
                <li key={s.t} className="relative">
                  <span className={cn("absolute -left-[33px] top-0.5 grid h-4 w-4 place-items-center rounded-full border-2 bg-card", s.fail ? "border-rose-500" : s.done ? "border-brand bg-brand" : s.current ? "border-amber-500" : "border-border")}>{s.done && !s.fail && <Check className="h-2.5 w-2.5 text-white" />}</span>
                  <div className={cn("text-[14px] font-semibold", s.fail && "text-rose-600")}>{s.t}</div>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground" data-testid={i === 2 ? "verification-description" : undefined}>{s.d}</p>
                </li>
              ))}
            </ol>
            {state.profile?.docs?.length > 0 && (
              <div className="mt-8"><div className="eyebrow mb-2">Yüklenen belgeler</div><div className="space-y-1.5">{state.profile.docs.map((d) => <div key={`${d.name}-${d.size}`} className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-[13px]" data-testid="profile-doc-item"><FileText className="h-3.5 w-3.5 text-muted-foreground" />{d.name}</div>)}</div></div>
            )}
            {state.verification === "Reddedildi" && (
              <div className="mt-6">
                <Button onClick={() => fileRef.current?.click()} data-testid="profile-reupload-button" className="bg-navy text-white hover:bg-brand dark:bg-brand"><UploadCloud className="mr-2 h-4 w-4" />Belgeleri yeniden yükle</Button>
                <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" data-testid="profile-reupload-input" onChange={(e) => { reupload(e.target.files); e.target.value = ""; }} />
              </div>
            )}
            <div className="mt-8 border-t pt-5">
              <div className="mb-2 text-[11.5px] text-muted-foreground">Prototip: durumu elle değiştirerek arayüzün tepkisini inceleyin.</div>
              <div className="flex flex-wrap gap-2">
                {STATES.map((s) => (
                  <button key={s.k} onClick={() => { setStatus(s.k); toast.message(`Demo: durum “${s.k}” olarak ayarlandı`); }} data-testid={`verification-demo-${s.k}`}
                    className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] transition-colors", state.verification === s.k ? "border-foreground/30 bg-surface font-medium" : "text-muted-foreground hover:bg-surface/60")}>
                    <s.icon className={cn("h-3.5 w-3.5", s.k === "Doğrulandı" ? "text-emerald-600" : s.k === "İnceleniyor" ? "text-amber-600" : "text-rose-600")} />{s.k}
                  </button>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel className="p-4">
            <div className="eyebrow mb-3">Etkin çalışma alanı</div>
            <div className="text-[14px] font-semibold">{ws.name}</div><div className="text-[12px] text-muted-foreground">{ws.sub} · Üyelik: {PHYSICIAN.since}</div>
            <p className="mt-3 text-[11.5px] text-muted-foreground">Hekim yetkileri ve platform yöneticisi yetkileri ayrı tutulur.</p>
          </Panel>
          <Panel className="divide-y p-0">
            <div className="eyebrow px-4 pb-2 pt-4">Ayarlar</div>
            <label className="flex items-center justify-between px-4 py-3 text-[13px]"><span className="flex items-center gap-2">{state.theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}Koyu tema</span><Switch checked={state.theme === "dark"} onCheckedChange={toggleTheme} data-testid="settings-theme-switch" /></label>
            <label className="flex items-center justify-between px-4 py-3 text-[13px]"><span>Kenar çubuğunu daralt</span><Switch checked={state.collapsed} onCheckedChange={(v) => set({ collapsed: v })} data-testid="settings-collapse-switch" /></label>
            <div className="flex items-center justify-between px-4 py-3 text-[13px]"><span>Arayüz dili</span><span className="text-muted-foreground">Türkçe</span></div>
          </Panel>
          <Panel className="space-y-2 p-4">
            <div className="eyebrow mb-1">Prototip verisi</div>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => { resetDemo(); toast.success("Demo verisi sıfırlandı"); }} data-testid="reset-demo-button"><RotateCcw className="mr-2 h-3.5 w-3.5" />Demo verisini sıfırla</Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => { emptyDemo(); toast.success("Yeni kullanıcı görünümü etkin"); }} data-testid="empty-demo-button"><Trash2 className="mr-2 h-3.5 w-3.5" />Yeni kullanıcı (boş) görünümü</Button>
          </Panel>
        </div>
      </div>
    </div>
  );
}
