import { useEffect, useRef, useState } from "react";
import { PlayCircle, Lock, RotateCcw, ArrowRight, FolderInput } from "lucide-react";
import { useStore } from "@/lib/store";
import { Composer } from "@/components/research/Composer";
import { UserMessage, AssistantMessage, ThinkingMessage } from "@/components/research/Message";
import { buildAssistant, detectKind } from "@/data/mock";
import { uid } from "@/lib/format";
import { cn } from "@/lib/utils";

const LIMIT = 3;
const KEY = "medassistix-tour-used";

const CASES = [
  { id: "t1", label: "Kronik öksürük", complaint: "6 haftadır devam eden kuru öksürük", age: 45, sex: "Kadın", duration: "6 hafta", allergies: ["Penisilin"] },
  { id: "t2", label: "Poliüri ve susama", complaint: "Artan susama ve sık idrara çıkma", age: 58, sex: "Erkek", duration: "1 ay", allergies: ["Sülfonamid"] },
  { id: "t3", label: "Tekrarlayan baş ağrısı", complaint: "Sabahları belirgin tekrarlayan baş ağrısı", age: 32, sex: "Kadın", duration: "3 ay", allergies: [] },
];

const CasePicker = ({ active, onPick }) => (
  <div className="space-y-2">
    <div className="eyebrow mb-1">Örnek vaka seçin</div>
    {CASES.map((c) => (
      <button key={c.id} onClick={() => onPick(c)} data-testid={`tour-case-${c.id}`}
        className={cn("w-full rounded-xl border p-3 text-left transition-[border-color,background-color]", active.id === c.id ? "border-brand/60 bg-brand-soft/60" : "bg-card hover:border-foreground/20")}>
        <div className="text-[13.5px] font-semibold">{c.label}</div>
        <div className="mt-0.5 text-[11.5px] text-muted-foreground">{c.age} yaş · {c.sex} · {c.duration}{c.allergies.length ? ` · Alerji: ${c.allergies.join(", ")}` : ""}</div>
      </button>
    ))}
    <p className="pt-1 text-[11px] leading-relaxed text-muted-foreground">Örnek vakalar kurgusaldır. Girişsiz deneme kaydedilmez.</p>
  </div>
);

const LimitCard = ({ onLogin, onCarry }) => (
  <div className="rounded-2xl border border-dashed bg-surface/70 p-5 text-center fade-up" data-testid="tour-limit-reached">
    <Lock className="mx-auto h-5 w-5 text-muted-foreground" />
    <div className="mt-2 font-display text-[15px] font-bold">Deneme sorularınız tamamlandı</div>
    <p className="mt-1 text-[12.5px] text-muted-foreground">Kendi vakalarınızla devam etmek için giriş yapın; doğrulamadan sonra 5 ücretsiz sorgu tanımlanır.</p>
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      <button onClick={onCarry} data-testid="tour-limit-carry-button" className="inline-flex h-10 items-center gap-2 rounded-lg bg-navy px-4 text-sm font-medium text-white hover:bg-brand dark:bg-brand"><FolderInput className="h-4 w-4" />Vakayı hesabıma aktar</button>
      <button onClick={onLogin} data-testid="tour-login-button" className="inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium hover:bg-surface">Giriş yap<ArrowRight className="h-4 w-4" /></button>
    </div>
  </div>
);

export const LiveTour = ({ onLogin }) => {
  const [c, setC] = useState(CASES[0]);
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [used, setUsed] = useState(() => Number(sessionStorage.getItem(KEY) || 0));
  const timers = useRef([]);
  const { set } = useStore();
  const scrollRef = useRef(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { sessionStorage.setItem(KEY, String(used)); }, [used]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages.length, busy]);

  const left = LIMIT - used;
  const send = ({ kind, text }) => {
    if (busy || left <= 0) return;
    const k = kind || detectKind(text);
    setMessages((m) => [...m, { id: uid(), role: "user", kind: k, text, createdAt: new Date().toISOString() }]);
    setBusy(true); setStep(0);
    timers.current = [setTimeout(() => setStep(1), 500), setTimeout(() => setStep(2), 1000), setTimeout(() => {
      const reply = buildAssistant(k, c, text);
      setMessages((m) => [...m, reply]);
      if (reply.type === "answer") setUsed((u) => u + 1);
      setBusy(false);
    }, 1500)];
  };
  const carry = () => { set({ pendingTour: { c, messages } }); onLogin(); };
  const pick = (next) => { if (busy) return; setC(next); setMessages([]); };

  return (
    <section id="dene" className="mx-auto max-w-[1240px] scroll-mt-20 px-5 py-24 sm:px-8" data-testid="landing-live-tour">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl"><div className="eyebrow mb-3 flex items-center gap-1.5"><PlayCircle className="h-3 w-3" />Canlı ürün turu</div><h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Giriş yapmadan deneyin.</h2><p className="mt-4 text-muted-foreground md:text-lg">Bir örnek vaka seçin, klinik sorunuzu yazın veya hızlı eylemlerden birini kullanın. Yanıtlar demo amaçlı simüle edilir.</p></div>
        <span className="font-mono text-[12px] text-muted-foreground" data-testid="tour-remaining">Kalan deneme: {Math.max(left, 0)}/{LIMIT}</span>
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <CasePicker active={c} onPick={pick} />
        <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-[0_30px_80px_-40px_rgba(11,25,44,.35)]">
          <div className="flex items-center gap-2 border-b bg-surface/70 px-4 py-2.5 text-[12px]">
            <span className="truncate font-medium" data-testid="tour-active-case">{c.complaint}</span>
            <span className="hidden text-muted-foreground sm:inline">· {c.age} yaş · {c.sex}</span>
            {messages.length > 0 && !busy && (
              <div className="ml-auto flex items-center gap-3">
                <button onClick={carry} data-testid="tour-carry-button" className="inline-flex items-center gap-1 font-medium text-brand-fg hover:underline"><FolderInput className="h-3.5 w-3.5" />Hesabıma aktar</button>
                <button onClick={() => setMessages([])} data-testid="tour-reset-button" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><RotateCcw className="h-3 w-3" />Temizle</button>
              </div>
            )}
          </div>
          <div ref={scrollRef} className="h-[420px] space-y-4 overflow-y-auto p-4 scrollbar-thin sm:p-5" data-testid="tour-messages">
            {!messages.length && !busy && <div className="grid h-full place-items-center text-center text-[13px] text-muted-foreground" data-testid="tour-empty">Aşağıdan bir soru yazın veya hızlı eylem seçin.</div>}
            {messages.map((m) => m.role === "user" ? <UserMessage key={m.id} m={m} /> : <AssistantMessage key={m.id} m={m} onFollow={(t) => send({ text: t })} onRetry={() => send({ kind: "genel", text: "Lütfen yanıtı yeniden oluştur" })} />)}
            {busy && <ThinkingMessage step={step} />}
          </div>
          <div className="border-t p-3 sm:p-4">
            {left <= 0 && !busy ? <LimitCard onLogin={onLogin} onCarry={carry} /> : <Composer onSend={send} busy={busy} hideDrugLink />}
          </div>
        </div>
      </div>
    </section>
  );
};
