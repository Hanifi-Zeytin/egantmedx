import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Stethoscope, Pill, GitBranch, TestTubes, Search, Loader2, Lock } from "lucide-react";
import { QUICK_ACTIONS } from "@/data/mock";
import { cn } from "@/lib/utils";

const ICONS = { tedavi: Stethoscope, ilac: Pill, ayirici: GitBranch, tetkik: TestTubes };

export const Composer = ({ onSend, busy, disabledReason, autoFocus, hideDrugLink }) => {
  const [text, setText] = useState("");
  const ref = useRef(null);
  const disabled = !!disabledReason;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [text]);

  useEffect(() => { if (autoFocus && !disabled) ref.current?.focus(); }, [autoFocus, disabled]);

  const submit = (kind, prompt) => {
    if (busy || disabled) return;
    const value = prompt || text.trim();
    if (!value) return;
    onSend({ kind, text: value });
    setText("");
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); }
  };

  return (
    <div className="w-full" data-testid="clinical-composer">
      <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
        {QUICK_ACTIONS.map((a) => {
          const I = ICONS[a.kind];
          return (
            <button key={a.kind} data-testid={`quick-action-${a.kind}`} disabled={busy || disabled} onClick={() => submit(a.kind, text.trim() ? `${a.label}: ${text.trim()}` : a.prompt)}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border bg-card px-3 text-[12.5px] font-medium text-foreground/80 transition-[background-color,border-color,transform] hover:-translate-y-px hover:border-brand/50 hover:bg-brand-soft hover:text-brand-fg disabled:pointer-events-none disabled:opacity-50">
              <I className="h-3.5 w-3.5" strokeWidth={1.9} />{a.label}
            </button>
          );
        })}
        {!hideDrugLink && <span className="mx-1 hidden h-5 w-px bg-border sm:block" />}
        {!hideDrugLink && <Link to="/ilaclar" data-testid="composer-drug-lookup-link" title="İlaç veritabanında doğrudan arama yapın"
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-dashed border-indigo-300 px-3 text-[12.5px] font-medium text-indigo-700 transition-colors hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/40">
          <Search className="h-3.5 w-3.5" />İlaç Sorgula
        </Link>}
      </div>
      <div className={cn("relative rounded-2xl border bg-card shadow-[0_1px_2px_rgba(15,23,42,.04),0_8px_24px_-12px_rgba(15,23,42,.12)] transition-[border-color,box-shadow] focus-within:border-brand/60 focus-within:shadow-[0_0_0_4px_hsl(var(--brand)/0.12)]", disabled && "bg-surface")}>
        <textarea ref={ref} rows={1} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKey} disabled={disabled}
          data-testid="composer-input" aria-label="Klinik soru"
          placeholder={disabled ? disabledReason : "Klinik sorunuzu yazın… (ör. bu vakada kırmızı bayrak bulguları nelerdir?)"}
          className="block max-h-[220px] min-h-[52px] w-full resize-none bg-transparent px-4 pb-11 pt-3.5 text-[14.5px] leading-relaxed outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed" />
        <div className="pointer-events-none absolute inset-x-3 bottom-2.5 flex items-center justify-between">
          <span className="pl-1 text-[11px] text-muted-foreground">{disabled ? <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3" />Sorgu kapalı</span> : <><b className="font-medium">Enter</b> gönder · <b className="font-medium">Shift+Enter</b> yeni satır</>}</span>
          <button data-testid="composer-send-button" onClick={() => submit()} disabled={busy || disabled || !text.trim()} aria-label="Gönder"
            className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full bg-navy text-white transition-[transform,opacity,background-color] hover:scale-105 hover:bg-brand disabled:scale-100 disabled:bg-muted-foreground/30 dark:bg-brand">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" strokeWidth={2.4} />}
          </button>
        </div>
      </div>
    </div>
  );
};
