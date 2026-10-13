import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ExternalLink, History as HistoryIcon, X, BookOpenText, SearchX, Info, Library } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Panel, SampleBadge, EmptyState } from "@/components/common";
import { EVIDENCE, SUGGESTED_TOPICS } from "@/data/demo";
import { europePmc, trDizin } from "@/data/mock";
import { matches } from "@/lib/format";
import { cn } from "@/lib/utils";

const SOURCES = ["TR Dizin", "Europe PMC", "Kılavuz"];
const LANGS = [["TR", "Türkçe"], ["EN", "İngilizce"]];
const TYPES = ["Araştırma Makalesi", "Derleme", "Kılavuz"];

const Chip = ({ active, onClick, children, testId }) => (
  <button onClick={onClick} data-testid={testId} aria-pressed={active} className={cn("rounded-full border px-3 py-1 text-[12.5px] transition-colors", active ? "border-indigo-400 bg-indigo-50 text-indigo-800 dark:border-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200" : "text-muted-foreground hover:border-foreground/20 hover:text-foreground")}>{children}</button>
);

const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

const ResultCard = ({ e, i }) => (
  <article className="group fade-up rounded-xl border bg-card p-4 transition-[border-color] hover:border-indigo-300 dark:hover:border-indigo-800" style={{ animationDelay: `${i * 40}ms` }} data-testid={`evidence-result-${e.id}`}>
    <div className="flex flex-wrap items-center gap-2 text-[11.5px]">
      <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10.5px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{e.source}</span>
      <span className="rounded border px-1.5 py-0.5 font-mono text-[10.5px]" title={e.lang === "TR" ? "Türkçe" : "İngilizce"}>{e.lang}</span>
      <span className="text-muted-foreground">{e.type}</span>
      <SampleBadge className="ml-auto" />
    </div>
    <h3 className="mt-2.5 font-display text-[15.5px] font-semibold leading-snug">{e.title}</h3>
    <div className="mt-1.5 text-[12.5px] text-muted-foreground">{e.publisher} · <span className="font-mono">{e.year}</span></div>
    <div className="mt-3 flex items-center justify-between border-t pt-3">
      <span className="text-[11px] text-muted-foreground">Prototip örneği — gerçek bir yayını temsil etmez.</span>
      <a href={e.url} target="_blank" rel="noreferrer" data-testid={`evidence-open-${e.id}`} className="inline-flex items-center gap-1 text-[12.5px] font-medium text-indigo-700 hover:underline dark:text-indigo-300">{e.source === "Kılavuz" ? "Europe PMC" : e.source}'de ara<ExternalLink className="h-3.5 w-3.5" /></a>
    </div>
  </article>
);

const ExternalSearch = ({ q }) => (
  <div className="grid gap-2 sm:grid-cols-2">
    {[["TR Dizin", trDizin(q)], ["Europe PMC", europePmc(q)]].map(([n, u]) => (
      <a key={n} href={u} target="_blank" rel="noreferrer" data-testid={`external-search-${n.replace(" ", "-")}`} className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-indigo-300">
        <Library className="h-4 w-4 text-indigo-600" /><div className="min-w-0 flex-1"><div className="text-[13px] font-medium">{n}'de canlı arama</div><div className="truncate text-[11.5px] text-muted-foreground">“{q}” — orijinal kaynakta açılır</div></div><ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
      </a>
    ))}
  </div>
);

export default function Evidence() {
  const [params, setParams] = useSearchParams();
  const { state, addEvidenceSearch, clearEvidenceHistory } = useStore();
  const [input, setInput] = useState(params.get("q") || "");
  const q = params.get("q") || "";
  const [src, setSrc] = useState([]);
  const [lang, setLang] = useState([]);
  const [type, setType] = useState([]);

  useEffect(() => setInput(q), [q]);

  const run = (value) => {
    const v = (value ?? input).trim();
    if (!v) return;
    setParams({ q: v });
    addEvidenceSearch(v);
  };

  const results = useMemo(() => {
    if (!q) return [];
    return EVIDENCE.filter((e) => matches(`${e.title} ${e.topics.join(" ")} ${e.publisher}`, q))
      .filter((e) => (!src.length || src.includes(e.source)) && (!lang.length || lang.includes(e.lang)) && (!type.length || type.includes(e.type)))
      .sort((a, b) => (a.lang === "TR" ? -1 : 1) - (b.lang === "TR" ? -1 : 1));
  }, [q, src, lang, type]);

  return (
    <div className="space-y-8" data-testid="evidence-page">
      <PageHeader eyebrow="Bilimsel Kanıt" title="Kanıt Ara" description="Klinik konulara göre Türkçe ve uluslararası literatürde yayın keşfi. Yalnızca bibliyografik bilgi ve orijinal kaynağa bağlantı gösterilir; tam metin çoğaltılmaz." />

      <div className="rounded-2xl border bg-card p-2 shadow-[0_8px_30px_-16px_rgba(15,23,42,.25)] transition-shadow focus-within:shadow-[0_0_0_4px_rgba(99,102,241,.12)]">
        <div className="flex items-center gap-2 pl-3">
          <Search className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <input data-testid="evidence-search-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="Klinik konu, tanı veya anahtar kelime… (ör. kronik öksürük)" className="h-12 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/70" />
          {input && <button onClick={() => { setInput(""); setParams({}); }} aria-label="Temizle" data-testid="evidence-clear-button" className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-surface"><X className="h-4 w-4" /></button>}
          <button onClick={() => run()} data-testid="evidence-search-button" className="h-10 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-700">Ara</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div><div className="eyebrow mb-2">Kaynak</div><div className="flex flex-wrap gap-1.5">{SOURCES.map((s) => <Chip key={s} active={src.includes(s)} onClick={() => setSrc(toggle(src, s))} testId={`filter-source-${s.replace(" ", "-")}`}>{s}</Chip>)}</div></div>
          <div><div className="eyebrow mb-2">Dil</div><div className="flex flex-wrap gap-1.5">{LANGS.map(([k, l]) => <Chip key={k} active={lang.includes(k)} onClick={() => setLang(toggle(lang, k))} testId={`filter-lang-${k}`}>{l}</Chip>)}</div></div>
          <div><div className="eyebrow mb-2">Yayın türü</div><div className="flex flex-wrap gap-1.5">{TYPES.map((t) => <Chip key={t} active={type.includes(t)} onClick={() => setType(toggle(type, t))} testId={`filter-type-${t.split(" ")[0]}`}>{t}</Chip>)}</div></div>
          <Panel className="p-3">
            <div className="mb-2 flex items-center justify-between"><span className="eyebrow flex items-center gap-1.5"><HistoryIcon className="h-3 w-3" />Arama geçmişi</span>{state.evidenceHistory.length > 0 && <button onClick={clearEvidenceHistory} className="text-[11px] text-muted-foreground hover:text-foreground" data-testid="evidence-history-clear">Temizle</button>}</div>
            {state.evidenceHistory.length ? state.evidenceHistory.map((h) => <button key={h} onClick={() => run(h)} data-testid="evidence-history-item" className="block w-full truncate rounded px-2 py-1.5 text-left text-[13px] hover:bg-surface">{h}</button>) : <p className="text-[12px] text-muted-foreground">Henüz arama yok.</p>}
          </Panel>
          <div className="flex gap-2 rounded-lg border border-dashed p-3 text-[11.5px] leading-relaxed text-muted-foreground"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />Bu modül kanıt keşfi içindir; yapay zekâ yorumu içermez. Yorumlar Klinik Araştırma'da ayrıca işaretlenir.</div>
        </aside>

        <div className="min-w-0 space-y-4">
          {!q ? (
            <div className="space-y-4" data-testid="evidence-idle">
              <div className="eyebrow">Önerilen konular</div>
              <div className="flex flex-wrap gap-2">{SUGGESTED_TOPICS.map((t) => <button key={t} onClick={() => { setInput(t); run(t); }} data-testid="evidence-suggested-topic" className="rounded-xl border bg-card px-4 py-2.5 text-[13.5px] font-medium transition-[border-color,transform] hover:-translate-y-0.5 hover:border-indigo-300">{t}</button>)}</div>
              <EmptyState icon={BookOpenText} title="Bir klinik konu arayın" text="Sonuçlar örnek kayıtlardan oluşur. Her sonuçtan orijinal kaynakta canlı arama açabilirsiniz." />
            </div>
          ) : (<>
            <div className="flex items-center justify-between"><div className="text-[13px] text-muted-foreground" data-testid="evidence-result-count"><b className="text-foreground">{results.length}</b> örnek kayıt · “{q}”</div><span className="text-[11.5px] text-muted-foreground">Türkçe kaynaklar önce</span></div>
            {results.length ? results.map((e, i) => <ResultCard key={e.id} e={e} i={i} />) : <EmptyState testId="evidence-no-results" icon={SearchX} title="Örnek veri setinde eşleşme bulunamadı" text="Filtreleri gevşetmeyi deneyin veya aşağıdaki bağlantılarla orijinal kaynaklarda canlı arama yapın." />}
            <div className="pt-2"><div className="eyebrow mb-2">Orijinal kaynaklarda devam edin</div><ExternalSearch q={q} /></div>
          </>)}
        </div>
      </div>
    </div>
  );
}
