import { useState } from "react";
import { Check, Clock, Info, Bell, BellRing } from "lucide-react";
import { useStore, FREE_QUOTA } from "@/lib/store";
import { PageHeader } from "@/components/common";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PLANS = [
  { id: "trial", name: "Ücretsiz Deneme", price: "₺0", tag: "Etkin", desc: "Hekim doğrulaması sonrası platformu tanımak için.", features: ["5 klinik sorgu", "Kanıt Ara erişimi", "İlaç kataloğu araması", "İlaç Güvenlik Kontrolü (ad düzeyinde)", "Kişisel çalışma alanı"] },
  { id: "pro", name: "Professional", price: "Yakında", tag: "Yakında", desc: "Günlük klinik pratiğinde düzenli kullanan hekimler için.", features: ["Genişletilmiş klinik sorgu hakkı", "Gelişmiş kanıt filtreleri", "Vaka dışa aktarma", "Öncelikli destek"] },
  { id: "org", name: "Klinik / Kurum", price: "Yakında", tag: "Yakında", desc: "Aile sağlığı merkezleri, poliklinikler ve kurumlar için.", features: ["Ekip çalışma alanları", "Yönetici paneli", "Kurumsal hesap yönetimi", "Kurum içi raporlama"] },
];

export default function Packages() {
  const { state } = useStore();
  const [notify, setNotify] = useState({});
  const left = Math.max(FREE_QUOTA - state.queriesUsed, 0);
  return (
    <div className="space-y-8" data-testid="packages-page">
      <PageHeader eyebrow="Abonelik" title="Paketler" description="Şu anda yalnızca Ücretsiz Deneme etkindir. Ücretli paketler ve ödeme altyapısı henüz kullanıma açılmamıştır." />
      <div className="flex items-start gap-3 rounded-xl border border-dashed bg-surface/60 p-4 text-[13px]" data-testid="packages-notice"><Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" /><span>Ödeme alınmaz ve satın alma yapılamaz. “Yakında” paketler için yalnızca bilgilendirme tercihi kaydedebilirsiniz (prototip, yerel).</span></div>
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p, i) => {
          const active = p.id === "trial";
          return (
            <div key={p.id} data-testid={`plan-${p.id}`} style={{ animationDelay: `${i * 70}ms` }} className={cn("fade-up flex flex-col rounded-2xl border bg-card p-6", active && "border-brand/60 shadow-[0_0_0_4px_hsl(var(--brand)/0.08)]")}>
              <div className="flex items-center justify-between"><h3 className="font-display text-lg font-bold">{p.name}</h3>
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium", active ? "bg-brand-soft text-brand-fg" : "border border-dashed text-muted-foreground")}>{active ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}{p.tag}</span></div>
              <div className={cn("mt-4 font-display text-3xl font-extrabold tracking-tight", !active && "text-muted-foreground")}>{p.price}</div>
              <p className="mt-2 text-[13px] text-muted-foreground">{p.desc}</p>
              {active && (
                <div className="mt-4 rounded-lg bg-surface p-3" data-testid="plan-trial-usage">
                  <div className="flex justify-between text-[12.5px]"><span>Kalan sorgu</span><span className="font-mono font-medium">{left}/{FREE_QUOTA}</span></div>
                  <div className="mt-2 flex gap-1">{Array.from({ length: FREE_QUOTA }).map((_, k) => <span key={k} className={cn("h-1.5 flex-1 rounded-full", k < left ? "bg-brand" : "bg-border")} />)}</div>
                  <div className="mt-1.5 text-[11px] text-muted-foreground">Hekim durumu: {state.verification}</div>
                </div>
              )}
              <ul className="mt-5 flex-1 space-y-2">{p.features.map((f) => <li key={f} className="flex gap-2 text-[13px]"><Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", active ? "text-brand" : "text-muted-foreground")} />{f}</li>)}</ul>
              {active ? <div className="mt-6 h-10 rounded-lg border text-center text-sm font-medium leading-10 text-muted-foreground">Mevcut paketiniz</div> : (
                <button data-testid={`plan-notify-${p.id}`} onClick={() => { setNotify({ ...notify, [p.id]: !notify[p.id] }); if (!notify[p.id]) toast.success("Bilgilendirme tercihi kaydedildi", { description: "Paket kullanıma açıldığında haberdar edileceksiniz (demo)." }); }}
                  className={cn("mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors", notify[p.id] ? "border-brand/50 bg-brand-soft text-brand-fg" : "hover:bg-surface")}>
                  {notify[p.id] ? <><BellRing className="h-4 w-4" />Haber verilecek</> : <><Bell className="h-4 w-4" />Yakında · Haber ver</>}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
