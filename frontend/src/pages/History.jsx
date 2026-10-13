import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Archive, ArchiveRestore, MessageSquare, ArrowRight, Inbox, Plus } from "lucide-react";
import { useStore, useWorkspaceCases, caseTitle } from "@/lib/store";
import { PageHeader, StatusBadge, caseStatus, EmptyState } from "@/components/common";
import { matches, timeAgo, dayGroup } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FILTERS = [["tumu", "Tümü"], ["taslak", "Taslak"], ["hazir", "Araştırmaya hazır"], ["suruyor", "Süren"], ["arsiv", "Arşiv"]];
const GROUPS = ["Bugün", "Bu hafta", "Bu ay", "Daha eski"];

const CaseItem = ({ c }) => {
  const { updateCase } = useStore();
  const st = caseStatus(c);
  const href = c.status === "taslak" ? `/arastirma?taslak=${c.id}` : `/arastirma/${c.id}`;
  const lastQ = [...c.messages].reverse().find((m) => m.role === "user");
  const archive = (e) => { e.preventDefault(); updateCase(c.id, () => ({ status: c.status === "arsiv" ? (c.complaint && c.age != null && c.sex ? "hazir" : "taslak") : "arsiv" })); toast.success(c.status === "arsiv" ? "Arşivden çıkarıldı" : "Arşivlendi"); };
  return (
    <Link to={href} data-testid={`history-case-${c.id}`} className={cn("group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-[border-color,transform] hover:-translate-y-px hover:border-foreground/20 sm:flex-row sm:items-center", c.status === "taslak" && "border-dashed", c.status === "arsiv" && "opacity-75")}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2"><span className="truncate font-display text-[14.5px] font-semibold">{caseTitle(c)}</span><StatusBadge status={st} /></div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
          <span>{c.age != null ? `${c.age} yaş` : "Yaş —"} · {c.sex || "—"}{c.duration && ` · ${c.duration}`}</span>
          <span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" />{c.messages.length}</span>
          <span title={new Date(c.updatedAt).toLocaleString("tr-TR")}>Güncellendi {timeAgo(c.updatedAt)}</span>
        </div>
        {lastQ && <p className="mt-1.5 truncate text-[12.5px] text-foreground/70">Son soru: “{lastQ.text}”</p>}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={archive} data-testid={`history-archive-${c.id}`} className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[12px] text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
          {c.status === "arsiv" ? <><ArchiveRestore className="h-3.5 w-3.5" />Geri al</> : <><Archive className="h-3.5 w-3.5" />Arşivle</>}
        </button>
        <span className="inline-flex h-8 items-center gap-1 rounded-md bg-surface px-3 text-[12.5px] font-medium">{c.status === "taslak" ? "Tamamla" : c.status === "arsiv" ? "Görüntüle" : c.messages.length ? "Devam et" : "Başlat"}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
      </div>
    </Link>
  );
};

export default function History() {
  const [params, setParams] = useSearchParams();
  const filter = params.get("durum") || "tumu";
  const [q, setQ] = useState("");
  const cases = useWorkspaceCases();

  const list = useMemo(() => cases
    .filter((c) => (filter === "tumu" ? c.status !== "arsiv" : caseStatus(c) === filter || (filter === "hazir" && false)))
    .filter((c) => matches(`${c.complaint} ${c.context} ${c.messages.map((m) => m.text || "").join(" ")}`, q))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [cases, filter, q]);
  const count = (k) => cases.filter((c) => (k === "tumu" ? c.status !== "arsiv" : caseStatus(c) === k)).length;

  return (
    <div className="space-y-8" data-testid="history-page">
      <PageHeader eyebrow="Arşiv ve oturumlar" title="Geçmiş" description="Önceki araştırmalarınıza dönün, taslakları tamamlayın veya vakaları arşivleyin."
        actions={<Link to="/arastirma" data-testid="history-new-button" className="inline-flex h-9 items-center gap-2 rounded-lg bg-navy px-4 text-sm font-medium text-white dark:bg-brand"><Plus className="h-4 w-4" />Yeni araştırma</Link>} />
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input data-testid="history-search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Şikâyet, bağlam veya soru içinde ara…" className="h-10 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-lg border bg-card p-1 scrollbar-thin">
          {FILTERS.map(([k, l]) => <button key={k} onClick={() => setParams(k === "tumu" ? {} : { durum: k })} data-testid={`history-filter-${k}`} className={cn("whitespace-nowrap rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors", filter === k ? "bg-navy text-white dark:bg-brand" : "text-muted-foreground hover:text-foreground")}>{l} <span className="ml-0.5 font-mono text-[10.5px] opacity-70">{count(k)}</span></button>)}
        </div>
      </div>
      {list.length ? (
        <div className="space-y-6">
          {GROUPS.map((g) => { const items = list.filter((c) => dayGroup(c.updatedAt) === g); return items.length ? (
            <div key={g}><div className="eyebrow mb-2">{g}</div><div className="space-y-2">{items.map((c) => <CaseItem key={c.id} c={c} />)}</div></div>
          ) : null; })}
        </div>
      ) : <EmptyState testId="history-empty" icon={Inbox} title={q ? "Aramanızla eşleşen vaka yok" : "Bu filtrede vaka bulunmuyor"} text="Farklı bir filtre deneyin veya yeni bir klinik araştırma başlatın." />}
    </div>
  );
}
