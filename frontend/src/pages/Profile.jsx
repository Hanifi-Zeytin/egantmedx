import { BadgeCheck, Clock3, XCircle, Moon, Sun, RotateCcw, Trash2, Building2, Mail, Stethoscope, FileText } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Panel } from "@/components/common";
import { VerificationPill } from "@/components/layout/Topbar";
import { PHYSICIAN, WORKSPACES } from "@/data/demo";
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
  const { state, set, toggleTheme, resetDemo, emptyDemo } = useStore();
  const ws = WORKSPACES.find((w) => w.id === state.workspace);
  const current = STATES.find((s) => s.k === state.verification);
  return (
    <div className="space-y-8" data-testid="profile-page">
      <PageHeader eyebrow="Hesap" title="Profil" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6 min-w-0">
          <Panel className="p-5 sm:p-6">
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

          <Panel className="p-5 sm:p-6" data-testid="profile-verification-card">
            <div className="eyebrow mb-4">Hekim doğrulama durumu</div>
            <div className="grid gap-2 sm:grid-cols-3">
              {STATES.map((s) => (
                <button key={s.k} onClick={() => { set({ verification: s.k }); toast.message(`Demo: durum “${s.k}” olarak ayarlandı`); }} data-testid={`verification-demo-${s.k}`}
                  className={cn("rounded-xl border p-3 text-left transition-colors", state.verification === s.k ? "border-foreground/30 bg-surface" : "hover:bg-surface/60")}>
                  <s.icon className={cn("h-4 w-4", s.k === "Doğrulandı" ? "text-emerald-600" : s.k === "İnceleniyor" ? "text-amber-600" : "text-rose-600")} />
                  <div className="mt-2 text-[13px] font-semibold">{s.k}</div>
                </button>
              ))}
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground" data-testid="verification-description">{current.text}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">Prototip: durumlar arasında geçiş yaparak arayüzün nasıl değiştiğini inceleyebilirsiniz.</p>
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
