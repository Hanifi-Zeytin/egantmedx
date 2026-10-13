import { Link } from "react-router-dom";
import { ExternalLink, BookOpenText, AlertTriangle, HelpCircle, RotateCcw, SearchX, CornerDownRight, Check } from "lucide-react";
import { MockBadge } from "@/components/common";
import { KIND_LABEL } from "@/data/mock";
import { Button } from "@/components/ui/button";

const AssistantHead = ({ m }) => (
  <div className="mb-3 flex flex-wrap items-center gap-2">
    <div className="grid h-6 w-6 place-items-center rounded-md bg-navy text-[10px] font-bold text-white dark:bg-brand">AI</div>
    <span className="text-[13px] font-semibold">MedAssistix Asistanı</span>
    <span className="text-[11px] text-muted-foreground">· {KIND_LABEL[m.kind]}</span>
    <MockBadge className="ml-auto" />
  </div>
);

export const UserMessage = ({ m }) => (
  <div className="flex justify-end fade-up" data-testid="message-user">
    <div className="max-w-[85%] rounded-2xl rounded-br-md border bg-surface px-4 py-2.5">
      <div className="mb-0.5 text-[10.5px] font-medium text-muted-foreground">Hekim sorusu{m.kind !== "genel" && ` · ${KIND_LABEL[m.kind]}`}</div>
      <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{m.text}</p>
    </div>
  </div>
);

const Sources = ({ sources }) => sources.length ? (
  <div className="mt-4 rounded-xl border bg-surface/70 p-3" data-testid="message-sources">
    <div className="mb-2 flex items-center gap-1.5"><BookOpenText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /><span className="eyebrow !text-indigo-700 dark:!text-indigo-300">Kanıt bağlantıları</span><span className="text-[11px] text-muted-foreground">· doğrulanmış atıf değildir, kaynak araması açar</span></div>
    <div className="grid gap-1.5">
      {sources.map((s) => (
        <a key={s.id} href={s.url} target="_blank" rel="noreferrer" data-testid="source-link" className="group flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-[13px] transition-colors hover:border-indigo-300">
          <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{s.source}</span>
          <span className="flex-1 truncate">{s.label}</span>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-indigo-600" />
        </a>
      ))}
    </div>
  </div>
) : (
  <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-dashed p-3" data-testid="message-no-evidence">
    <SearchX className="mt-0.5 h-4 w-4 text-muted-foreground" />
    <div className="flex-1 text-[12.5px] text-muted-foreground">Bu yanıt için ilişkilendirilmiş kanıt bulunamadı. Bilimsel literatürü ayrıca taramanız önerilir.</div>
    <Link to="/kanit" className="text-[12.5px] font-medium text-brand-fg hover:underline" data-testid="no-evidence-search-link">Kanıt Ara →</Link>
  </div>
);

export const AssistantMessage = ({ m, onFollow, onRetry }) => {
  if (m.type === "error") return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 fade-up dark:border-rose-900 dark:bg-rose-950/30" data-testid="message-error">
      <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-4 w-4 text-rose-600" />
        <div className="flex-1"><div className="text-sm font-semibold text-rose-800 dark:text-rose-300">Yanıt oluşturulamadı</div>
          <p className="mt-1 text-[13px] text-rose-700/90 dark:text-rose-300/80">Model servisine geçici olarak ulaşılamadı (simüle edilmiş hata). Sorgu hakkınızdan düşülmedi.</p></div>
        <Button size="sm" variant="outline" onClick={onRetry} data-testid="message-retry-button"><RotateCcw className="mr-1.5 h-3.5 w-3.5" />Tekrar dene</Button>
      </div>
    </div>
  );
  if (m.type === "clarification") return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 fade-up dark:border-amber-900 dark:bg-amber-950/20" data-testid="message-clarification">
      <AssistantHead m={m} />
      <div className="flex gap-2.5"><HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><p className="text-[14px] leading-relaxed">{m.question}</p></div>
      <div className="mt-3 flex flex-wrap gap-1.5 pl-6">{m.options.map((o) => <button key={o} onClick={() => onFollow(o)} data-testid="clarification-option" className="rounded-full border bg-card px-3 py-1 text-[12.5px] hover:border-amber-400">{o}</button>)}</div>
    </div>
  );
  return (
    <div className="relative rounded-2xl border border-l-[3px] border-l-brand bg-card p-4 sm:p-5 fade-up" data-testid="message-assistant">
      <AssistantHead m={m} />
      <p className="text-[14px] leading-relaxed text-foreground/90">{m.intro}</p>
      <div className="mt-3 space-y-3">
        {m.sections.map((s) => (
          <div key={s.title}>
            <div className="mb-1.5 font-display text-[13.5px] font-semibold">{s.title}</div>
            <ul className="space-y-1">{s.items.map((it) => <li key={it} className="flex gap-2 text-[13.5px] leading-relaxed text-foreground/85"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-brand" />{it}</li>)}</ul>
          </div>
        ))}
      </div>
      <Sources sources={m.sources} />
      <p className="mt-3 text-[11px] text-muted-foreground">Bu içerik prototip amaçlı simüle edilmiştir; tanı veya tedavi önerisi değildir. Klinik karar hekime aittir.</p>
      {m.followups?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t pt-3">
          {m.followups.map((f) => <button key={f} onClick={() => onFollow(f)} data-testid="followup-option" className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[12.5px] text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"><CornerDownRight className="h-3 w-3" />{f}</button>)}
        </div>
      )}
    </div>
  );
};

const STEPS = ["Vaka bağlamı okunuyor", "Kaynak indeksleri taranıyor", "Yanıt yapılandırılıyor"];

export const ThinkingMessage = ({ step }) => (
  <div className="rounded-2xl border border-dashed bg-card p-4 fade-up" data-testid="message-loading">
    <div className="mb-3 flex items-center gap-2"><div className="grid h-6 w-6 place-items-center rounded-md bg-navy text-[10px] font-bold text-white dark:bg-brand">AI</div><span className="text-[13px] font-semibold">Araştırılıyor…</span></div>
    <div className="space-y-1.5">{STEPS.map((s, i) => (
      <div key={s} className="flex items-center gap-2 text-[12.5px]">
        <span className={i < step ? "h-1.5 w-1.5 rounded-full bg-brand" : i === step ? "h-1.5 w-1.5 rounded-full bg-brand dot-pulse" : "h-1.5 w-1.5 rounded-full bg-border"} />
        <span className={i <= step ? "text-foreground" : "text-muted-foreground"}>{s}</span>
      </div>))}
    </div>
    <div className="mt-3 h-2 w-2/3 animate-pulse rounded bg-surface" /><div className="mt-1.5 h-2 w-1/2 animate-pulse rounded bg-surface" />
  </div>
);
