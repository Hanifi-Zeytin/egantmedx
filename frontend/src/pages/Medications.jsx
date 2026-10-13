import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Pill, FlaskConical, ShieldAlert, ArrowRight, X, Database, SearchX } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader, Panel, SampleBadge, EmptyState } from "@/components/common";
import { PRODUCTS, INGREDIENTS } from "@/data/demo";
import { matches } from "@/lib/format";
import { cn } from "@/lib/utils";

const TABS = [["all", "Tümü"], ["product", "Ürünler"], ["ingredient", "Etken maddeler"]];

const ProductRow = ({ p }) => (
  <Link to={`/ilaclar/${p.id}`} data-testid={`med-product-${p.id}`} className="group flex items-center gap-3 rounded-xl border bg-card p-3 transition-[border-color,transform] hover:-translate-y-px hover:border-brand/50">
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-fg"><Pill className="h-4 w-4" /></div>
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline gap-2"><span className="truncate font-display text-[14.5px] font-semibold">{p.name}</span><span className="font-mono text-[12.5px] text-muted-foreground">{p.strength}</span></div>
      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11.5px]">
        <span className="text-muted-foreground">Etken madde:</span><span className="font-medium">{p.ingredient}</span>
        <span className="rounded border px-1.5 py-px text-[10.5px] text-muted-foreground">{p.form}</span>
      </div>
    </div>
    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
  </Link>
);

const IngredientRow = ({ name, count, onPick }) => (
  <button onClick={onPick} data-testid="med-ingredient-result" className="group flex w-full items-center gap-3 rounded-xl border border-dashed bg-card p-3 text-left transition-colors hover:border-indigo-300">
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><FlaskConical className="h-4 w-4" /></div>
    <div className="min-w-0 flex-1"><div className="font-display text-[14.5px] font-semibold">{name}</div><div className="text-[11.5px] text-muted-foreground">Etken madde · {count} ürün</div></div>
    <span className="text-[12px] text-muted-foreground group-hover:text-foreground">Ürünleri göster</span>
  </button>
);

export default function Medications() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [tab, setTab] = useState("all");
  const navigate = useNavigate();
  const { state } = useStore();
  const setQ = (v) => setParams(v ? { q: v } : {});

  const products = useMemo(() => PRODUCTS.filter((p) => matches(`${p.name} ${p.ingredient} ${p.form} ${p.strength}`, q)), [q]);
  const ingredients = useMemo(() => (q ? INGREDIENTS.filter((i) => matches(i, q)) : INGREDIENTS), [q]);
  const showIng = tab !== "product";
  const showProd = tab !== "ingredient";
  const recent = state.recentMeds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  return (
    <div className="space-y-8" data-testid="medications-page">
      <PageHeader eyebrow="İlaç Kataloğu" title="İlaçlar" description="Ürün adı veya etken maddeye göre arayın. Klinik içerik yalnızca doğrulanmış kaynak mevcutsa gösterilir."
        actions={<Link to="/ilaclar/guvenlik" data-testid="open-safety-check" className="inline-flex h-9 items-center gap-2 rounded-lg border border-indigo-300 bg-indigo-50 px-3.5 text-sm font-medium text-indigo-800 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200"><ShieldAlert className="h-4 w-4" />İlaç Güvenlik Kontrolü</Link>} />

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex items-center gap-2 rounded-2xl border bg-card p-2 pl-4 shadow-[0_8px_30px_-16px_rgba(15,23,42,.25)] focus-within:shadow-[0_0_0_4px_hsl(var(--brand)/0.12)]">
          <Search className="h-5 w-5 shrink-0 text-brand" />
          <input autoFocus data-testid="med-search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ürün adı veya etken madde… (ör. Amoksisilin, Termafen)" className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/70" />
          {q && <button onClick={() => setQ("")} aria-label="Temizle" data-testid="med-search-clear" className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-surface"><X className="h-4 w-4" /></button>}
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-dashed px-4 py-2 text-[11.5px] text-muted-foreground" data-testid="med-dataset-info">
          <Database className="h-4 w-4" /><div><div><b className="font-mono text-foreground">14.566</b> ürün · <b className="font-mono text-foreground">4.035</b> etken madde</div><div>geliştirme veri seti · prototipte {PRODUCTS.length} örnek</div></div>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b">
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} data-testid={`med-tab-${k}`} className={cn("-mb-px border-b-2 px-3 pb-2.5 text-[13.5px] font-medium transition-colors", tab === k ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {l} <span className="ml-1 font-mono text-[11px] text-muted-foreground">{k === "product" ? products.length : k === "ingredient" ? ingredients.length : products.length + ingredients.length}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          {!products.length && !ingredients.length ? (
            <EmptyState testId="med-no-results" icon={SearchX} title="Örnek veri setinde sonuç bulunamadı" text="Farklı bir ürün adı veya etken madde yazmayı deneyin. Türkçe karakterleri (ş, ğ, ı, ö, ü, ç) kontrol edin." />
          ) : (<>
            {showIng && ingredients.length > 0 && (
              <div><div className="eyebrow mb-2">Etken maddeler</div><div className="grid gap-2 sm:grid-cols-2">{ingredients.slice(0, q ? 6 : 4).map((i) => <IngredientRow key={i} name={i} count={PRODUCTS.filter((p) => p.ingredient === i).length} onPick={() => { setQ(i); setTab("product"); }} />)}</div></div>
            )}
            {showProd && products.length > 0 && (
              <div><div className="eyebrow mb-2 flex items-center gap-2">Ürünler <SampleBadge>ÖRNEK ÜRÜNLER</SampleBadge></div><div className="grid gap-2">{products.map((p) => <ProductRow key={p.id} p={p} />)}</div></div>
            )}
          </>)}
        </div>
        <div className="space-y-4">
          <Panel className="p-4">
            <div className="eyebrow mb-3">Üç ayrı işlev</div>
            <div className="space-y-3 text-[12.5px] leading-relaxed">
              <div><b>İlaç Sorgula</b> <span className="text-muted-foreground">— bu sayfa; katalogda doğrudan arama.</span></div>
              <div><b>İlaç seçenekleri</b> <span className="text-muted-foreground">— Klinik Araştırma'da vaka bağlamlı soru.</span></div>
              <div><b>İlaç Güvenlik Kontrolü</b> <span className="text-muted-foreground">— alerji ve tekrar eden etken madde kontrolü.</span></div>
            </div>
          </Panel>
          <Panel className="p-4" data-testid="med-recent">
            <div className="eyebrow mb-2">Son görüntülenenler</div>
            {recent.length ? recent.map((p) => <button key={p.id} onClick={() => navigate(`/ilaclar/${p.id}`)} className="flex w-full items-center gap-2 rounded px-1.5 py-1.5 text-left text-[13px] hover:bg-surface"><Pill className="h-3.5 w-3.5 text-brand" />{p.name} <span className="text-muted-foreground">{p.strength}</span></button>) : <p className="text-[12px] text-muted-foreground">Henüz yok.</p>}
          </Panel>
        </div>
      </div>
    </div>
  );
}
