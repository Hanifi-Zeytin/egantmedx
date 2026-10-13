import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PanelRight, Microscope, Stethoscope, Pill, GitBranch, TestTubes, FileClock, Archive } from "lucide-react";
import { useStore, caseTitle, FREE_QUOTA } from "@/lib/store";
import { StatusBadge, caseStatus } from "@/components/common";
import { Composer } from "@/components/research/Composer";
import { UserMessage, AssistantMessage, ThinkingMessage } from "@/components/research/Message";
import { CasePanel } from "@/components/research/CasePanel";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { buildAssistant, detectKind, QUICK_ACTIONS } from "@/data/mock";
import { uid } from "@/lib/format";
import { toast } from "sonner";

const ICONS = { tedavi: Stethoscope, ilac: Pill, ayirici: GitBranch, tetkik: TestTubes };

const ModelStatus = ({ busy }) => (
  <span data-testid="model-status" className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] text-muted-foreground">
    <span className={busy ? "h-1.5 w-1.5 rounded-full bg-amber-500 dot-pulse" : "h-1.5 w-1.5 rounded-full bg-emerald-500"} />
    Model: Demo simülasyonu · {busy ? "Yanıt hazırlanıyor" : "Hazır"}
  </span>
);

const EmptySession = ({ onPick, disabled }) => (
  <div className="mx-auto max-w-2xl py-10 text-center fade-up" data-testid="research-empty-state">
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border bg-card"><Microscope className="h-5 w-5 text-brand" /></div>
    <h2 className="mt-5 text-xl font-bold tracking-tight">Araştırmaya hazır</h2>
    <p className="mt-1.5 text-sm text-muted-foreground">Vaka bağlamı yüklendi. Bir klinik soru yazın veya aşağıdaki başlıklardan biriyle başlayın.</p>
    <div className="mt-6 grid gap-2 text-left sm:grid-cols-2">
      {QUICK_ACTIONS.map((a) => { const I = ICONS[a.kind]; return (
        <button key={a.kind} disabled={disabled} onClick={() => onPick(a)} data-testid={`empty-start-${a.kind}`} className="group rounded-xl border bg-card p-3.5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-brand/50 disabled:opacity-50">
          <div className="flex items-center gap-2 text-[13.5px] font-semibold"><I className="h-4 w-4 text-brand" />{a.label}</div>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{a.prompt}</p>
        </button>); })}
    </div>
  </div>
);

export default function ResearchWorkspace() {
  const { id } = useParams();
  const { state, updateCase, consumeQuery } = useStore();
  const navigate = useNavigate();
  const c = state.cases.find((x) => x.id === id);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const scrollRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [c?.messages.length, busy]);

  if (!c) return (
    <div className="grid h-full place-items-center p-8 text-center" data-testid="case-not-found">
      <div><h2 className="text-lg font-bold">Vaka bulunamadı</h2><p className="mt-1 text-sm text-muted-foreground">Bu vaka silinmiş veya farklı bir çalışma alanına ait olabilir.</p><Button className="mt-4" onClick={() => navigate("/gecmis")}>Geçmişe dön</Button></div>
    </div>
  );

  const left = FREE_QUOTA - state.queriesUsed;
  const disabledReason =
    c.status === "arsiv" ? "Arşivlenmiş vakada yeni soru sorulamaz — arşivden çıkarın." :
    c.status === "taslak" ? "Taslak vaka: araştırmayı başlatmak için zorunlu alanları tamamlayın." :
    state.verification !== "Doğrulandı" ? `Hekim doğrulaması tamamlanmadan sorgu yapılamaz (durum: ${state.verification}).` :
    left <= 0 ? "Ücretsiz sorgu hakkınız doldu. Ücretli paketler yakında." : null;

  const respond = (kind, text) => {
    setBusy(true); setStep(0);
    timers.current = [setTimeout(() => setStep(1), 550), setTimeout(() => setStep(2), 1100), setTimeout(() => {
      const reply = buildAssistant(kind, c, text);
      updateCase(c.id, (x) => ({ messages: [...x.messages, reply] }));
      if (reply.type === "answer") consumeQuery();
      setBusy(false);
    }, 1700)];
  };

  const send = ({ kind, text }) => {
    const k = kind || detectKind(text);
    updateCase(c.id, (x) => ({ messages: [...x.messages, { id: uid(), role: "user", kind: k, text, createdAt: new Date().toISOString() }] }));
    respond(k, text);
  };

  const retry = (errId) => {
    const idx = c.messages.findIndex((m) => m.id === errId);
    const prev = c.messages[idx - 1];
    updateCase(c.id, (x) => ({ messages: x.messages.filter((m) => m.id !== errId) }));
    respond(prev?.kind || "genel", (prev?.text || "").replace(/hata/gi, ""));
    toast.message("Yeniden deneniyor…");
  };

  return (
    <div className="grid h-full lg:grid-cols-[minmax(0,68fr)_minmax(320px,32fr)]" data-testid="research-workspace">
      <section className="flex min-h-0 min-w-0 flex-col">
        <div className="flex items-center gap-3 border-b px-4 py-3 sm:px-6">
          <Link to="/gecmis" className="grid h-8 w-8 shrink-0 place-items-center rounded-md border hover:bg-surface" aria-label="Geri" data-testid="workspace-back-button"><ArrowLeft className="h-4 w-4" /></Link>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-[15px] font-bold" data-testid="workspace-case-title">{caseTitle(c)}</div>
            <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-muted-foreground"><span className="font-mono">#{c.id.slice(0, 6).toUpperCase()}</span><span>· {c.age} yaş · {c.sex}</span></div>
          </div>
          <div className="hidden md:block"><ModelStatus busy={busy} /></div>
          <StatusBadge status={caseStatus(c)} testId="workspace-case-status" className="hidden sm:inline-flex" />
          <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setPanelOpen(true)} data-testid="open-case-panel-button"><PanelRight className="mr-1.5 h-4 w-4" />Vaka</Button>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-6 sm:px-6">
            {c.status === "taslak" && (
              <div className="flex flex-col gap-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-4 sm:flex-row sm:items-center dark:border-amber-900 dark:bg-amber-950/20" data-testid="draft-banner">
                <FileClock className="h-5 w-5 text-amber-600" /><div className="flex-1 text-[13px]"><b>Bu vaka taslak durumda.</b> Yaş ve biyolojik cinsiyet gibi zorunlu alanları tamamlayarak araştırmayı başlatın.</div>
                <Button size="sm" onClick={() => navigate(`/arastirma?taslak=${c.id}`)} data-testid="draft-complete-button">Tamamla ve başlat</Button>
              </div>
            )}
            {c.status === "arsiv" && <div className="flex items-center gap-3 rounded-xl border bg-surface p-3 text-[13px] text-muted-foreground" data-testid="archived-banner"><Archive className="h-4 w-4" />Bu vaka arşivlendi. Konuşma salt okunur.</div>}
            {c.messages.length === 0 && !busy && c.status === "hazir" && <EmptySession disabled={!!disabledReason} onPick={(a) => send({ kind: a.kind, text: a.prompt })} />}
            {c.messages.map((m) => m.role === "user" ? <UserMessage key={m.id} m={m} /> : <AssistantMessage key={m.id} m={m} onFollow={(t) => !disabledReason && !busy && send({ text: t })} onRetry={() => retry(m.id)} />)}
            {busy && <ThinkingMessage step={step} />}
          </div>
        </div>

        <div className="border-t bg-background/90 px-4 pb-4 pt-3 backdrop-blur sm:px-6">
          <div className="mx-auto max-w-3xl">
            <Composer onSend={send} busy={busy} disabledReason={disabledReason} autoFocus />
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Yanıtlar simüle edilmiştir · klinik karar hekime aittir</span>
              <span className="font-mono" data-testid="workspace-quota">Kalan sorgu: {Math.max(left, 0)}/{FREE_QUOTA}</span>
            </div>
          </div>
        </div>
      </section>

      <aside className="hidden min-h-0 overflow-y-auto border-l bg-surface/50 p-5 scrollbar-thin lg:block"><CasePanel c={c} /></aside>
      <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
        <SheetContent side="right" className="w-[92vw] max-w-sm overflow-y-auto bg-surface p-4 pt-10"><SheetTitle className="sr-only">Vaka özeti</SheetTitle><CasePanel c={c} /></SheetContent>
      </Sheet>
    </div>
  );
}
