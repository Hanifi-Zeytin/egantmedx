import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShieldAlert, Plus, X, CheckCircle2, AlertTriangle, Unplug, Info, RotateCcw, Search } from "lucide-react";
import { useStore, caseTitle } from "@/lib/store";
import { PageHeader, Panel, UnavailableValue } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRODUCTS } from "@/data/demo";
import { matches, trLower } from "@/lib/format";
import { cn } from "@/lib/utils";

const Step = ({ n, title, children, done }) => (
  <div className="relative pl-10">
    <div className={cn("absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-full border font-mono text-[12px]", done ? "border-brand bg-brand text-white" : "bg-card")}>{n}</div>
    <div className="mb-3 font-display text-[14.5px] font-semibold">{title}</div>{children}
  </div>
);

const ResultLine = ({ tone, icon: Icon, title, text }) => (
  <div className={cn("flex gap-3 rounded-lg border p-3", tone === "warn" && "border-amber-300 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/30", tone === "ok" && "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20", tone === "na" && "border-dashed")}>
    <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", tone === "warn" ? "text-amber-600" : tone === "ok" ? "text-emerald-600" : "text-muted-foreground")} />
    <div><div className="text-[13.5px] font-medium">{title}</div><div className="mt-0.5 text-[12.5px] text-muted-foreground">{text}</div></div>
  </div>
);

export default function SafetyCheck() {
  const [params] = useSearchParams();
  const { state } = useStore();
  const linkedCase = state.cases.find((c) => c.id === params.get("vaka"));
  const [selected, setSelected] = useState(() => PRODUCTS.filter((p) => p.id === params.get("ilac")));
  const [allergies, setAllergies] = useState((linkedCase?.allergies || []).join(", "));
  const [q, setQ] = useState("");
  const [result, setResult] = useState(null);

  const options = useMemo(() => (q ? PRODUCTS.filter((p) => matches(`${p.name} ${p.ingredient}`, q) && !selected.includes(p)).slice(0, 5) : []), [q, selected]);
  const add = (p) => { setSelected([...selected, p]); setQ(""); setResult(null); };

  const run = () => {
    const al = allergies.split(",").map((a) => trLower(a.trim())).filter(Boolean);
    const allergyHits = selected.filter((p) => al.some((a) => trLower(p.ingredient).includes(a) || a.includes(trLower(p.ingredient.split(" ")[0]))));
    const counts = selected.reduce((m, p) => ({ ...m, [p.ingredient]: (m[p.ingredient] || 0) + 1 }), {});
    const dups = Object.entries(counts).filter(([, n]) => n > 1).map(([k]) => k);
    setResult({ allergyHits, dups, hasAllergies: al.length > 0 });
  };

  return (
    <div className="space-y-8" data-testid="safety-check-page">
      <PageHeader eyebrow="İlaçlar · Ayrı iş akışı" title="İlaç Güvenlik Kontrolü" description="Seçilen ürünlerin etken maddelerini kayıtlı alerjilerle ve birbirleriyle ad düzeyinde karşılaştırır. Klinik etkileşim veritabanı bu prototipte bağlı değildir." />
      {linkedCase && <div className="flex items-center gap-2 rounded-lg border bg-surface px-4 py-2.5 text-[13px]" data-testid="safety-linked-case">Bağlı vaka: <Link to={`/arastirma/${linkedCase.id}`} className="font-medium underline-offset-2 hover:underline">{caseTitle(linkedCase)}</Link><span className="text-muted-foreground">· alerjiler otomatik aktarıldı</span></div>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel className="space-y-7 p-5 sm:p-6">
          <Step n={1} title="Ürünleri seçin (en az 1)" done={selected.length > 0}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input data-testid="safety-med-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ürün adı veya etken madde ara…" className="pl-9" />
              {options.length > 0 && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-lg">
                  {options.map((p) => <button key={p.id} onClick={() => add(p)} data-testid={`safety-option-${p.id}`} className="flex w-full items-center justify-between px-3 py-2 text-left text-[13px] hover:bg-surface"><span>{p.name} <span className="font-mono text-muted-foreground">{p.strength}</span></span><span className="flex items-center gap-1 text-[11px] text-muted-foreground">{p.ingredient}<Plus className="h-3.5 w-3.5" /></span></button>)}
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5" data-testid="safety-selected">
              {selected.map((p) => <span key={p.id} className="inline-flex items-center gap-1.5 rounded-lg border bg-surface px-2.5 py-1 text-[12.5px]">{p.name} {p.strength}<span className="text-muted-foreground">· {p.ingredient}</span><button onClick={() => { setSelected(selected.filter((x) => x !== p)); setResult(null); }} aria-label="Kaldır" data-testid={`safety-remove-${p.id}`}><X className="h-3 w-3" /></button></span>)}
              {!selected.length && <span className="text-[12.5px] text-muted-foreground">Henüz ürün seçilmedi.</span>}
            </div>
          </Step>
          <Step n={2} title="Bilinen alerjiler" done={!!allergies.trim()}>
            <Input data-testid="safety-allergies-input" value={allergies} onChange={(e) => { setAllergies(e.target.value); setResult(null); }} placeholder="Virgülle ayırın — ör. Penisilin, Amoksisilin" />
            <p className="mt-1.5 text-[11.5px] text-muted-foreground">Opsiyonel. Boş bırakılırsa alerji karşılaştırması yapılmaz.</p>
          </Step>
          <div className="flex gap-2 pl-10">
            <Button onClick={run} disabled={!selected.length} data-testid="safety-run-button" className="bg-indigo-600 text-white hover:bg-indigo-700"><ShieldAlert className="mr-2 h-4 w-4" />Kontrolü çalıştır</Button>
            {result && <Button variant="ghost" onClick={() => { setResult(null); setSelected([]); setAllergies(""); }} data-testid="safety-reset-button"><RotateCcw className="mr-2 h-4 w-4" />Sıfırla</Button>}
          </div>
        </Panel>

        <div className="space-y-4" data-testid="safety-results">
          {!result ? (
            <div className="grid h-full min-h-[260px] place-items-center rounded-xl border border-dashed p-6 text-center">
              <div><ShieldAlert className="mx-auto h-6 w-6 text-muted-foreground" /><div className="mt-3 font-display text-sm font-semibold">Sonuçlar burada görünecek</div><p className="mt-1 text-[12px] text-muted-foreground">Gerekli girdi: en az bir ürün. Alerji alanı opsiyoneldir.</p></div>
            </div>
          ) : (
            <div className="space-y-4 fade-up">
              <Panel className="space-y-2 p-4">
                <div className="eyebrow mb-1">Ad düzeyinde karşılaştırma · prototip</div>
                {!result.hasAllergies ? <ResultLine tone="na" icon={Info} title="Alerji karşılaştırması yapılmadı" text="Alerji bilgisi girilmedi." />
                  : result.allergyHits.length ? result.allergyHits.map((p) => <ResultLine key={p.id} tone="warn" icon={AlertTriangle} title={`${p.name}: etken madde adı kayıtlı alerjiyle eşleşti`} text={`“${p.ingredient}” girilen alerji listesindeki bir ifadeyle eşleşiyor. Çapraz reaksiyon değerlendirmesi bu kontrolün kapsamında değildir.`} />)
                  : <ResultLine tone="ok" icon={CheckCircle2} title="Ad eşleşmesi bulunmadı" text="Etken madde adları girilen alerjilerle birebir eşleşmiyor. Bu, güvenli olduğu anlamına gelmez." />}
                {result.dups.length ? result.dups.map((d) => <ResultLine key={d} tone="warn" icon={AlertTriangle} title="Tekrarlayan etken madde" text={`“${d}” birden fazla seçili üründe bulunuyor.`} />)
                  : <ResultLine tone="ok" icon={CheckCircle2} title="Tekrarlayan etken madde yok" text="Seçilen ürünlerde aynı etken madde tekrarlanmıyor." />}
              </Panel>
              <Panel className="space-y-3 p-4" data-testid="safety-unavailable">
                <div className="eyebrow">Kullanılamayan veriler</div>
                <div className="flex items-center justify-between gap-3 text-[13px]"><span>İlaç–ilaç etkileşimleri</span><span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground"><Unplug className="h-3.5 w-3.5" />Entegrasyon bağlı değil</span></div>
                <div className="flex items-center justify-between gap-3 text-[13px]"><span>Kontrendikasyonlar</span><UnavailableValue /></div>
                <div className="flex items-center justify-between gap-3 text-[13px]"><span>Doz uygunluğu</span><UnavailableValue /></div>
              </Panel>
              <p className="text-[11.5px] leading-relaxed text-muted-foreground">Bu kontrol yalnızca metin eşleşmesine dayanır ve klinik karar desteği yerine geçmez.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
