import { cn } from "@/lib/utils";
import { Sparkles, FlaskConical } from "lucide-react";

const STATUS = {
  taslak: { label: "Taslak", cls: "border-amber-300/70 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800", dot: "bg-amber-500", dashed: true },
  hazir: { label: "Araştırmaya hazır", cls: "border-teal-300/70 bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800", dot: "bg-teal-500" },
  suruyor: { label: "Araştırma sürüyor", cls: "border-indigo-300/70 bg-indigo-50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800", dot: "bg-indigo-500" },
  arsiv: { label: "Arşivlendi", cls: "border-slate-300 bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700", dot: "bg-slate-400" },
};

export const caseStatus = (c) => (c.status === "hazir" && c.messages?.length ? "suruyor" : c.status);

export const StatusBadge = ({ status, className, testId }) => {
  const s = STATUS[status] || STATUS.taslak;
  return (
    <span data-testid={testId} className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap", s.dashed && "border-dashed", s.cls, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
};

export const MockBadge = ({ className, children = "DEMO YANIT · KLİNİK TAVSİYE DEĞİLDİR" }) => (
  <span className={cn("inline-flex items-center gap-1 rounded-full border border-teal-300/70 bg-teal-50 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-teal-800 dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-300", className)}>
    <Sparkles className="h-3 w-3" />{children}
  </span>
);

export const SampleBadge = ({ className, children = "ÖRNEK KAYIT" }) => (
  <span className={cn("inline-flex items-center gap-1 rounded border border-dashed border-slate-300 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-slate-500 dark:border-slate-600 dark:text-slate-400", className)}>
    <FlaskConical className="h-3 w-3" />{children}
  </span>
);

export const UnavailableValue = ({ children = "Veri mevcut değil" }) => (
  <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-slate-300 bg-slate-50 px-2 py-0.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">{children}</span>
);

export const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between fade-up">
    <div className="min-w-0">
      {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export const Panel = ({ className, children, ...rest }) => (
  <div className={cn("rounded-xl border bg-card", className)} {...rest}>{children}</div>
);

export const EmptyState = ({ icon: Icon, title, text, action, testId }) => (
  <div data-testid={testId} className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center">
    <div className="grid h-11 w-11 place-items-center rounded-xl border bg-surface"><Icon className="h-5 w-5 text-muted-foreground" /></div>
    <div className="mt-4 font-display text-sm font-semibold">{title}</div>
    {text && <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">{text}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const Kbd = ({ children }) => (
  <kbd className="rounded border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{children}</kbd>
);
