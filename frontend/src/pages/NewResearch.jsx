import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, Save, PlayCircle, X, AlertTriangle, FileClock, ArrowRight } from "lucide-react";
import { useStore, useWorkspaceCases, caseTitle } from "@/lib/store";
import { PageHeader, Panel, StatusBadge, caseStatus } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SEXES = ["Kadın", "Erkek", "Belirtilmedi"];
const UNITS = ["gün", "hafta", "ay", "yıl"];
const PII = /(\b\d{11}\b)|(\b0?5\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b)|(@\w+\.)/;
const empty = { complaint: "", age: "", sex: "", durN: "", durU: "hafta", allergies: [], context: "" };

const Label = ({ children, required, hint }) => (
  <div className="mb-1.5 flex items-baseline justify-between"><span className="text-[13px] font-medium">{children}{required && <span className="ml-0.5 text-rose-500">*</span>}</span>{hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}</div>
);

const AllergyInput = ({ value, onChange }) => {
  const [t, setT] = useState("");
  const add = () => { const v = t.trim(); if (v && !value.includes(v)) onChange([...value, v]); setT(""); };
  return (
    <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring/30">
      {value.map((a) => <span key={a} className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">{a}<button onClick={() => onChange(value.filter((x) => x !== a))} aria-label={`${a} kaldır`} data-testid="allergy-remove"><X className="h-3 w-3" /></button></span>)}
      <input data-testid="case-allergy-input" value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }} onBlur={add}
        placeholder={value.length ? "Ekle…" : "ör. Penisilin — Enter ile ekleyin"} className="h-7 min-w-[140px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70" />
    </div>
  );
};

const SideList = ({ title, icon: Icon, items, testId }) => (
  <Panel className="p-2" data-testid={testId}>
    <div className="eyebrow flex items-center gap-1.5 px-3 pb-1 pt-2"><Icon className="h-3 w-3" />{title}</div>
    {items.length ? items.map((c) => (
      <Link key={c.id} to={c.status === "taslak" ? `/arastirma?taslak=${c.id}` : `/arastirma/${c.id}`} className="group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-surface" data-testid={`side-case-${c.id}`}>
        <div className="min-w-0 flex-1"><div className="truncate text-[13px] font-medium">{caseTitle(c)}</div><div className="text-[11px] text-muted-foreground">{timeAgo(c.updatedAt)}</div></div>
        <StatusBadge status={caseStatus(c)} />
      </Link>
    )) : <p className="px-3 py-2 text-[12px] text-muted-foreground">Kayıt yok.</p>}
  </Panel>
);

const formFromDraft = (d, question) => {
  if (!d) return { ...empty, complaint: question || "" };
  const [n, u] = (d.duration || "").split(" ");
  return { complaint: d.complaint, age: d.age ?? "", sex: d.sex || "", durN: n || "", durU: u || "hafta", allergies: d.allergies || [], context: d.context || "" };
};

export default function NewResearch() {
  const [params] = useSearchParams();
  const draftId = params.get("taslak");
  return <ResearchForm key={draftId || "new"} draftId={draftId} question={params.get("soru")} />;
}

function ResearchForm({ draftId, question }) {
  const { state, upsertCase } = useStore();
  const cases = useWorkspaceCases();
  const navigate = useNavigate();
  const [f, setF] = useState(() => formFromDraft(draftId && state.cases.find((c) => c.id === draftId), question));
  const [errors, setErrors] = useState({});

  const up = (k) => (v) => setF((s) => ({ ...s, [k]: v?.target ? v.target.value : v }));
  const piiWarn = PII.test(f.complaint + " " + f.context);
  const toCase = (status) => ({ id: draftId || undefined, complaint: f.complaint.trim(), age: f.age === "" ? null : Number(f.age), sex: f.sex, duration: f.durN ? `${f.durN} ${f.durU}` : "", allergies: f.allergies, context: f.context.trim(), status });

  const saveDraft = () => {
    if (!f.complaint.trim()) { setErrors({ complaint: "Taslak için en az ana şikâyet gereklidir." }); return; }
    setErrors({});
    upsertCase(toCase("taslak"));
    toast.success("Taslak kaydedildi", { description: "Geçmiş ve Ana Sayfa'dan devam edebilirsiniz." });
    navigate("/gecmis?durum=taslak");
  };
  const start = () => {
    const e = {};
    if (!f.complaint.trim()) e.complaint = "Ana şikâyet / klinik soru gereklidir.";
    if (f.age === "" || f.age < 0 || f.age > 120) e.age = "Geçerli bir yaş girin.";
    if (!f.sex) e.sex = "Biyolojik cinsiyet seçin.";
    setErrors(e);
    if (Object.keys(e).length) return;
    const id = upsertCase(toCase("hazir"));
    toast.success("Araştırma başlatıldı");
    navigate(`/arastirma/${id}`);
  };

  return (
    <div className="space-y-10" data-testid="new-research-page">
      <PageHeader eyebrow="Klinik Araştırma" title={draftId ? "Taslak vakayı tamamlayın" : "Yeni klinik araştırma"} description="Anonim bir vaka oluşturun. Asistan yanıtlarını bu bağlama göre yapılandırır. Taslak olarak kaydedebilir veya araştırmayı hemen başlatabilirsiniz." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel className="overflow-hidden">
          <div className="flex items-start gap-3 border-b bg-surface/60 px-5 py-3.5 text-[12.5px] text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />Hasta adı, T.C. kimlik numarası, telefon veya adres gibi doğrudan kimliklendirici bilgiler girmeyin. Yalnızca klinik olarak gerekli anonim bilgileri paylaşın.</div>
          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <Label required hint="Klinik soru veya başvuru şikâyeti">Ana şikâyet / Klinik soru</Label>
              <Textarea data-testid="case-complaint-input" value={f.complaint} onChange={up("complaint")} rows={3} placeholder="ör. 6 haftadır devam eden kuru öksürük, geceleri artıyor." className={cn("resize-none text-[14.5px]", errors.complaint && "border-rose-400")} />
              {errors.complaint && <p className="mt-1 text-xs text-rose-600" data-testid="error-complaint">{errors.complaint}</p>}
            </div>
            <div className="grid gap-5 sm:grid-cols-[120px_1fr_1fr]">
              <div>
                <Label required>Yaş</Label>
                <Input data-testid="case-age-input" type="number" min={0} max={120} value={f.age} onChange={up("age")} placeholder="—" className={cn("font-mono", errors.age && "border-rose-400")} />
                {errors.age && <p className="mt-1 text-xs text-rose-600" data-testid="error-age">{errors.age}</p>}
              </div>
              <div>
                <Label required>Biyolojik cinsiyet</Label>
                <div className={cn("grid grid-cols-3 rounded-md border p-0.5", errors.sex && "border-rose-400")} role="radiogroup">
                  {SEXES.map((s) => <button key={s} role="radio" aria-checked={f.sex === s} data-testid={`case-sex-${s}`} onClick={() => up("sex")(s)} className={cn("h-8 rounded text-[12.5px] font-medium transition-colors", f.sex === s ? "bg-navy text-white dark:bg-brand" : "text-muted-foreground hover:bg-surface")}>{s}</button>)}
                </div>
                {errors.sex && <p className="mt-1 text-xs text-rose-600" data-testid="error-sex">{errors.sex}</p>}
              </div>
              <div>
                <Label>Şikâyet süresi</Label>
                <div className="flex gap-2">
                  <Input data-testid="case-duration-input" type="number" min={0} value={f.durN} onChange={up("durN")} placeholder="—" className="w-20 font-mono" />
                  <Select value={f.durU} onValueChange={up("durU")}>
                    <SelectTrigger data-testid="case-duration-unit" className="flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div><Label hint="İlaç, gıda veya diğer">Bilinen alerjiler</Label><AllergyInput value={f.allergies} onChange={up("allergies")} /></div>
            <div>
              <Label hint="Opsiyonel">Ek klinik bağlam</Label>
              <Textarea data-testid="case-context-input" value={f.context} onChange={up("context")} rows={3} placeholder="Özgeçmiş, kullandığı ilaçlar, muayene bulguları, ilgili öykü…" className="resize-none" />
            </div>
            {piiWarn && <div data-testid="pii-warning" className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-[12.5px] text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />Metinde kimlik numarası, telefon veya e-posta benzeri bir ifade algılandı. Lütfen kaldırın.</div>}
          </div>
          <div className="flex flex-col-reverse gap-2 border-t bg-surface/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[11.5px] text-muted-foreground"><span className="text-rose-500">*</span> Araştırmayı başlatmak için zorunlu alanlar</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveDraft} data-testid="save-draft-button" className="border-dashed"><Save className="mr-2 h-4 w-4" />Taslak Kaydet</Button>
              <Button onClick={start} data-testid="start-research-button" className="bg-navy text-white hover:bg-brand dark:bg-brand dark:hover:bg-brand/90"><PlayCircle className="mr-2 h-4 w-4" />Araştırmayı Başlat</Button>
            </div>
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel className="p-4">
            <div className="eyebrow mb-3">Vaka durumları</div>
            <div className="space-y-3 text-[12.5px]">
              <div className="flex gap-2.5"><StatusBadge status="taslak" /><span className="text-muted-foreground">Eksik bilgiyle kaydedilir, sorgu kullanılmaz.</span></div>
              <div className="flex gap-2.5"><StatusBadge status="hazir" /><span className="text-muted-foreground">Zorunlu alanlar tamam, asistanla araştırılabilir.</span></div>
            </div>
          </Panel>
          <SideList testId="side-drafts" title="Taslaklar" icon={FileClock} items={cases.filter((c) => c.status === "taslak")} />
          <SideList testId="side-ready" title="Araştırmaya hazır / süren" icon={PlayCircle} items={cases.filter((c) => c.status === "hazir")} />
          <Link to="/gecmis" className="flex items-center justify-end gap-1 text-[12.5px] text-muted-foreground hover:text-foreground">Tüm geçmiş<ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </div>
  );
}
