import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, UploadCloud, FileText, X, ShieldCheck, Lock } from "lucide-react";
import { Logo } from "@/components/layout/Sidebar";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = ["Hesap bilgileri", "Mesleki bilgiler", "Belgeler", "Onay"];
const TITLES = ["Pratisyen Hekim", "Aile Hekimi", "Aile Hekimliği Uzmanı", "Uzman Hekim", "Asistan Hekim"];
const MAX = 10 * 1024 * 1024;

const Field = ({ label, error, hint, children }) => (
  <label className="block">
    <div className="mb-1.5 flex items-baseline justify-between"><span className="text-[13px] font-medium">{label}</span>{hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}</div>
    {children}
    {error && <p className="mt-1 text-xs text-rose-600" data-testid="signup-error">{error}</p>}
  </label>
);

const StepRail = ({ step }) => (
  <ol className="space-y-5">
    {STEPS.map((s, i) => (
      <li key={s} className="flex items-center gap-3" data-testid={`signup-rail-${i}`}>
        <span className={cn("grid h-7 w-7 place-items-center rounded-full border font-mono text-[12px] transition-colors", i < step ? "border-teal-400 bg-teal-400 text-navy" : i === step ? "border-white text-white" : "border-white/25 text-white/40")}>{i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
        <span className={cn("text-[14px]", i <= step ? "text-white" : "text-white/45")}>{s}</span>
      </li>
    ))}
  </ol>
);

const DocDrop = ({ docs, setDocs }) => {
  const ref = useRef(null);
  const add = (files) => {
    const next = [...files].filter((f) => {
      if (f.size > MAX) { toast.error(`${f.name}: 10 MB sınırını aşıyor`); return false; }
      return true;
    }).map((f) => ({ name: f.name, size: f.size }));
    setDocs([...docs, ...next].slice(0, 3));
  };
  return (
    <div>
      <button type="button" onClick={() => ref.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files); }} data-testid="signup-dropzone"
        className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-surface/50 px-6 py-10 text-center transition-colors hover:border-brand/50 hover:bg-brand-soft/30">
        <UploadCloud className="h-7 w-7 text-brand" />
        <div className="mt-3 text-[14px] font-medium">Dosya seçin veya buraya sürükleyin</div>
        <div className="mt-1 text-[12px] text-muted-foreground">Diploma, diploma tescil veya uzmanlık belgesi · PDF, JPG, PNG · en fazla 10 MB · 3 dosya</div>
      </button>
      <input ref={ref} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" data-testid="signup-file-input" onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
      <div className="mt-3 space-y-2">
        {docs.map((d) => (
          <div key={d.name} className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5" data-testid="signup-doc-item">
            <FileText className="h-4 w-4 text-muted-foreground" /><span className="flex-1 truncate text-[13px]">{d.name}</span><span className="font-mono text-[11px] text-muted-foreground">{(d.size / 1024).toFixed(0)} KB</span>
            <button type="button" onClick={() => setDocs(docs.filter((x) => x !== d))} aria-label="Kaldır" data-testid="signup-doc-remove"><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
        ))}
      </div>
      <p className="mt-3 flex gap-1.5 text-[11.5px] text-muted-foreground"><Lock className="mt-0.5 h-3 w-3 shrink-0" />Prototip: dosya içeriği yüklenmez, yalnızca dosya adı kaydedilir.</p>
    </div>
  );
};

export default function Signup() {
  const navigate = useNavigate();
  const { state, submitSignup, importTour } = useStore();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ name: "", email: "", password: "", title: "", specialty: "", institution: "", city: "", diploma: "" });
  const [docs, setDocs] = useState([]);
  const [consent, setConsent] = useState({ physician: false, kvkk: false });
  const [err, setErr] = useState({});
  const up = (k) => (e) => setF({ ...f, [k]: e?.target ? e.target.value : e });

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (f.name.trim().length < 3) e.name = "Ad soyad girin.";
      if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Geçerli bir e-posta girin.";
      if (f.password.length < 8) e.password = "Şifre en az 8 karakter olmalı.";
    }
    if (step === 1) {
      if (!f.title) e.title = "Unvan seçin.";
      if (!f.institution.trim()) e.institution = "Kurum girin.";
      if (!f.city.trim()) e.city = "Şehir girin.";
      if (!/^\d{4,}$/.test(f.diploma.replace(/\s/g, ""))) e.diploma = "Diploma tescil numarasını girin (yalnızca rakam).";
    }
    if (step === 2 && !docs.length) e.docs = "En az bir belge ekleyin.";
    if (step === 3 && (!consent.physician || !consent.kvkk)) e.consent = "Devam etmek için iki onayı da işaretleyin.";
    setErr(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (!validate()) return;
    if (step < 3) return setStep(step + 1);
    const words = f.name.trim().split(/\s+/);
    const hasDr = /^dr\.?$/i.test(words[0]);
    const display = hasDr ? f.name.trim() : `Dr. ${f.name.trim()}`;
    const initials = words.filter((w) => !/^dr\.?$/i.test(w)).slice(0, 2).map((w) => w[0].toLocaleUpperCase("tr-TR")).join("");
    const hadTour = !!state.pendingTour;
    submitSignup({ name: display, initials, title: f.specialty.trim() || f.title, institution: `${f.institution.trim()}, ${f.city.trim()}`, city: f.city.trim(), email: f.email.trim(), diploma: `•••• ${f.diploma.slice(-4)}`, since: new Date().toLocaleDateString("tr-TR", { month: "long", year: "numeric" }), docs });
    toast.success("Başvurunuz alındı", { description: "Belgeleriniz incelemeye gönderildi." });
    if (hadTour) { const id = importTour(); navigate(`/arastirma/${id}`); } else navigate("/");
  };

  return (
    <div className="grid h-full overflow-y-auto lg:grid-cols-[420px_1fr]" data-testid="signup-page">
      <aside className="hidden flex-col justify-between bg-navy p-10 text-white lg:flex">
        <div className="[&_*]:!text-white"><Logo /></div>
        <div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">Hekim hesabınızı<br />oluşturun.</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-white/65">Doğrulama sonrasında 5 ücretsiz klinik sorgu tanımlanır.</p>
          <div className="mt-10"><StepRail step={step} /></div>
        </div>
        <p className="flex gap-2 text-[12px] leading-relaxed text-white/55"><ShieldCheck className="h-4 w-4 shrink-0 text-teal-300" />Platform yöneticisi belgelerinizi inceler. Yönetici yetkisi hekim onayı anlamına gelmez.</p>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10 lg:px-16 lg:py-12">
        <div className="flex items-center justify-between">
          <Link to="/tanitim" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground" data-testid="signup-back-landing"><ArrowLeft className="h-4 w-4" />Tanıtım sayfası</Link>
          <span className="font-mono text-[12px] text-muted-foreground lg:hidden">Adım {step + 1}/4</span>
        </div>
        <div className="mx-auto mt-10 w-full max-w-lg flex-1 fade-up" key={step}>
          <div className="eyebrow">Adım {step + 1} · {STEPS[step]}</div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">{["Hesabınızı oluşturalım", "Mesleki bilgileriniz", "Doğrulama belgeleri", "Son kontrol"][step]}</h2>
          {state.pendingTour && step === 0 && <div className="mt-4 rounded-xl border border-brand/40 bg-brand-soft/50 px-4 py-3 text-[13px]" data-testid="signup-tour-notice">Canlı turdaki vakanız kayıttan sonra hesabınıza aktarılacak.</div>}
          <div className="mt-8 space-y-5">
            {step === 0 && (<>
              <Field label="Ad soyad" error={err.name}><Input data-testid="signup-name" value={f.name} onChange={up("name")} placeholder="ör. Ayşe Kaya" /></Field>
              <Field label="E-posta" error={err.email}><Input data-testid="signup-email" type="email" value={f.email} onChange={up("email")} placeholder="ornek@kurum.tr" /></Field>
              <Field label="Şifre" hint="en az 8 karakter" error={err.password}><Input data-testid="signup-password" type="password" value={f.password} onChange={up("password")} /></Field>
            </>)}
            {step === 1 && (<>
              <Field label="Unvan" error={err.title}>
                <Select value={f.title} onValueChange={up("title")}><SelectTrigger data-testid="signup-title"><SelectValue placeholder="Seçin" /></SelectTrigger><SelectContent>{TITLES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
              </Field>
              <Field label="Uzmanlık alanı" hint="opsiyonel"><Input data-testid="signup-specialty" value={f.specialty} onChange={up("specialty")} placeholder="ör. İç Hastalıkları" /></Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Kurum" error={err.institution}><Input data-testid="signup-institution" value={f.institution} onChange={up("institution")} placeholder="ör. Örnek ASM" /></Field>
                <Field label="Şehir" error={err.city}><Input data-testid="signup-city" value={f.city} onChange={up("city")} placeholder="ör. Ankara" /></Field>
              </div>
              <Field label="Diploma tescil numarası" error={err.diploma}><Input data-testid="signup-diploma" inputMode="numeric" value={f.diploma} onChange={up("diploma")} className="font-mono" /></Field>
            </>)}
            {step === 2 && (<><DocDrop docs={docs} setDocs={setDocs} />{err.docs && <p className="text-xs text-rose-600" data-testid="signup-error">{err.docs}</p>}</>)}
            {step === 3 && (<>
              <div className="divide-y rounded-2xl border bg-card text-[13.5px]" data-testid="signup-summary">
                {[["Ad soyad", f.name], ["E-posta", f.email], ["Unvan", f.specialty || f.title], ["Kurum", `${f.institution}, ${f.city}`], ["Belgeler", docs.map((d) => d.name).join(", ")]].map(([k, v]) => <div key={k} className="flex gap-4 px-4 py-3"><span className="w-28 shrink-0 text-muted-foreground">{k}</span><span className="min-w-0 break-words font-medium">{v}</span></div>)}
              </div>
              <label className="flex items-start gap-3 text-[13px]"><Checkbox data-testid="signup-consent-physician" checked={consent.physician} onCheckedChange={(v) => setConsent({ ...consent, physician: !!v })} className="mt-0.5" />Hekim olduğumu ve verdiğim bilgilerin doğru olduğunu beyan ederim.</label>
              <label className="flex items-start gap-3 text-[13px]"><Checkbox data-testid="signup-consent-kvkk" checked={consent.kvkk} onCheckedChange={(v) => setConsent({ ...consent, kvkk: !!v })} className="mt-0.5" />Kişisel verilerin işlenmesine ilişkin aydınlatma metnini okudum.</label>
              {err.consent && <p className="text-xs text-rose-600" data-testid="signup-error">{err.consent}</p>}
            </>)}
          </div>
          <div className="mt-10 flex items-center justify-between">
            {step > 0 ? <button onClick={() => { setErr({}); setStep(step - 1); }} data-testid="signup-prev" className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Geri</button> : <span />}
            <button onClick={next} data-testid="signup-next" className="inline-flex h-11 items-center gap-2 rounded-xl bg-navy px-6 text-sm font-semibold text-white transition-colors hover:bg-brand dark:bg-brand">{step === 3 ? "Başvuruyu gönder" : "Devam"}<ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </main>
    </div>
  );
}
