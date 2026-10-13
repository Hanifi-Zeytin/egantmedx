import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Microscope, BookOpenText, Pill, ArrowRight, ArrowUp, FileClock, PlayCircle, Clock, Inbox, Building2, Sparkles } from "lucide-react";
import { useStore, useWorkspaceCases, usePhysician, caseTitle, FREE_QUOTA } from "@/lib/store";
import { StatusBadge, caseStatus, Panel, EmptyState } from "@/components/common";
import { VerificationPill } from "@/components/layout/Topbar";
import { PRODUCTS, WORKSPACES } from "@/data/demo";
import { greeting, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { to: "/arastirma", icon: Microscope, title: "Yeni Klinik Araştırma", text: "Anonim vaka oluşturun, asistanla birlikte araştırın", id: "new-research", tone: "bg-navy text-white dark:bg-brand" },
  { to: "/kanit", icon: BookOpenText, title: "Kanıt Ara", text: "TR Dizin, Europe PMC ve kılavuzlarda yayın keşfi", id: "evidence", tone: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
  { to: "/ilaclar", icon: Pill, title: "İlaç Sorgula", text: "Ürün adı veya etken maddeye göre katalog araması", id: "drug", tone: "bg-brand-soft text-brand-fg" },
];

const QuickStart = () => {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const go = () => q.trim() && navigate(`/arastirma?soru=${encodeURIComponent(q.trim())}`);
  return (
    <div className="flex items-center gap-2 rounded-2xl border bg-card p-2 pl-4 shadow-[0_8px_30px_-16px_rgba(15,23,42,.25)] transition-shadow focus-within:shadow-[0_0_0_4px_hsl(var(--brand)/0.12)]">
      <Sparkles className="h-4 w-4 shrink-0 text-brand" />
      <input data-testid="dashboard-quick-question-input" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()}
        placeholder="Yeni bir klinik soruyla başlayın… (ör. 45 yaş kadın, 6 haftalık kuru öksürük)" className="h-10 min-w-0 flex-1 bg-transparent text-[14.5px] outline-none placeholder:text-muted-foreground/70" />
      <button data-testid="dashboard-quick-question-submit" onClick={go} disabled={!q.trim()} aria-label="Vaka oluştur" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-white transition-[transform,background-color] hover:scale-105 hover:bg-brand disabled:bg-muted-foreground/30 dark:bg-brand"><ArrowUp className="h-4 w-4" /></button>
    </div>
  );
};

const VerificationBanner = ({ status }) => (
  <div data-testid="dashboard-verification-banner" className={cn("flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center", status === "Reddedildi" ? "border-rose-200 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/20" : "border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/20")}>
    <div className="flex-1">
      <div className="font-display text-[15px] font-bold">{status === "Reddedildi" ? "Doğrulama başvurunuz reddedildi" : "Hekim doğrulamanız inceleniyor"}</div>
      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{status === "Reddedildi" ? "Güncel belgelerinizi Profil sayfasından yeniden yükleyebilirsiniz." : "Onaylandığında 5 ücretsiz klinik sorgu tanımlanır. Bu sırada Kanıt Ara ve İlaçlar modüllerini kullanabilirsiniz."}</p>
    </div>
    <Link to="/profil" data-testid="dashboard-verification-link" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border bg-card px-3.5 text-sm font-medium hover:bg-surface">Durumu görüntüle<ArrowRight className="h-3.5 w-3.5" /></Link>
  </div>
);

const CaseRow = ({ c, testId }) => (
  <Link to={c.status === "taslak" ? `/arastirma?taslak=${c.id}` : `/arastirma/${c.id}`} data-testid={testId}
    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-surface">
    <div className="min-w-0 flex-1">
      <div className="truncate text-[13.5px] font-medium">{caseTitle(c)}</div>
      <div className="mt-0.5 text-[11.5px] text-muted-foreground">{c.age ? `${c.age} yaş` : "Yaş —"} · {c.sex || "—"} · {timeAgo(c.updatedAt)}</div>
    </div>
    <StatusBadge status={caseStatus(c)} />
    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
  </Link>
);

const ContinueCard = ({ c }) => {
  const last = [...c.messages].reverse().find((m) => m.role === "user");
  return (
    <Link to={`/arastirma/${c.id}`} data-testid="dashboard-continue-card" className="group relative block overflow-hidden rounded-xl border bg-card p-5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-brand/50">
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:linear-gradient(to_left,black,transparent_60%)]" />
      <div className="relative">
        <div className="flex items-center gap-2"><PlayCircle className="h-4 w-4 text-brand" /><span className="eyebrow">Kaldığınız yerden devam edin</span></div>
        <div className="mt-3 font-display text-lg font-bold tracking-tight">{caseTitle(c)}</div>
        {last && <p className="mt-1.5 line-clamp-1 text-[13px] text-muted-foreground">Son soru: “{last.text}”</p>}
        <div className="mt-4 flex items-center gap-3 text-[12px] text-muted-foreground">
          <StatusBadge status={caseStatus(c)} /><span>{c.messages.length} mesaj</span><span>· {timeAgo(c.updatedAt)}</span>
          <span className="ml-auto inline-flex items-center gap-1 font-medium text-foreground">Devam et<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
        </div>
      </div>
    </Link>
  );
};

const AccountCard = () => {
  const { state } = useStore();
  const ws = WORKSPACES.find((w) => w.id === state.workspace);
  const left = Math.max(FREE_QUOTA - state.queriesUsed, 0);
  return (
    <Panel className="p-4" data-testid="dashboard-account-card">
      <div className="eyebrow mb-3">Hesap durumu</div>
      <VerificationPill status={state.verification} testId="dashboard-verification" />
      <div className="mt-4">
        <div className="flex items-baseline justify-between"><span className="text-[13px] font-medium">Klinik sorgu hakkı</span><span className="font-mono text-[13px]" data-testid="dashboard-quota">{left} / {FREE_QUOTA}</span></div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface"><div className="h-full rounded-full bg-brand transition-[width]" style={{ width: `${(left / FREE_QUOTA) * 100}%` }} /></div>
        <div className="mt-1.5 text-[11.5px] text-muted-foreground">Ücretsiz Deneme · <Link to="/paketler" className="underline-offset-2 hover:underline">Paketleri gör</Link></div>
      </div>
      <div className="mt-4 flex items-center gap-2.5 rounded-lg bg-surface p-2.5"><Building2 className="h-4 w-4 text-muted-foreground" /><div className="min-w-0"><div className="truncate text-[12.5px] font-medium">{ws.name}</div><div className="text-[11px] text-muted-foreground">Etkin çalışma alanı</div></div></div>
    </Panel>
  );
};

const RecentMeds = () => {
  const { state } = useStore();
  const meds = state.recentMeds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  return (
    <Panel className="p-4" data-testid="dashboard-recent-meds">
      <div className="mb-2 flex items-center justify-between"><span className="eyebrow">Son görüntülenen ilaçlar</span><Link to="/ilaclar" className="text-[12px] text-muted-foreground hover:text-foreground">Tümü</Link></div>
      {meds.length ? meds.slice(0, 4).map((m) => (
        <Link key={m.id} to={`/ilaclar/${m.id}`} className="flex items-center gap-2.5 rounded-md px-1.5 py-2 hover:bg-surface" data-testid={`recent-med-${m.id}`}>
          <Pill className="h-3.5 w-3.5 text-brand" /><span className="flex-1 truncate text-[13px]">{m.name} <span className="text-muted-foreground">{m.strength}</span></span><span className="text-[11px] text-muted-foreground">{m.ingredient}</span>
        </Link>
      )) : <p className="py-3 text-[12.5px] text-muted-foreground">Henüz ilaç görüntülenmedi.</p>}
    </Panel>
  );
};

export default function Dashboard() {
  const { state } = useStore();
  const PHYSICIAN = usePhysician();
  const cases = useWorkspaceCases();
  const active = cases.filter((c) => c.status !== "arsiv").sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const ongoing = active.find((c) => c.status === "hazir" && c.messages.length);
  const drafts = active.filter((c) => c.status === "taslak");
  const ready = active.filter((c) => c.status === "hazir" && !c.messages.length);
  const isNew = cases.length === 0;
  const today = new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-10" data-testid="dashboard-page">
      <div className="fade-up">
        <div className="eyebrow mb-2">{today}</div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{greeting()}, {PHYSICIAN.name.split(" ").slice(0, 2).join(" ")}.</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">{isNew ? "MedAssistix'e hoş geldiniz. İlk klinik araştırmanızla başlayın." : ongoing ? "Devam eden bir araştırmanız var — ya da yeni bir soruyla başlayın." : "Bugün nereden başlamak istersiniz?"}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6 min-w-0">
          {state.verification !== "Doğrulandı" && <VerificationBanner status={state.verification} />}
          <QuickStart />
          <div className="grid gap-3 sm:grid-cols-3">
            {ACTIONS.map((a, i) => (
              <Link key={a.id} to={a.to} data-testid={`dashboard-action-${a.id}`} style={{ animationDelay: `${i * 60}ms` }}
                className="group fade-up rounded-xl border bg-card p-4 transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
                <div className={cn("grid h-9 w-9 place-items-center rounded-lg", a.tone)}><a.icon className="h-[18px] w-[18px]" strokeWidth={1.9} /></div>
                <div className="mt-4 flex items-center justify-between font-display text-[15px] font-bold">{a.title}<ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-[opacity,transform] group-hover:translate-x-0 group-hover:opacity-100" /></div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{a.text}</p>
              </Link>
            ))}
          </div>

          {ongoing && <ContinueCard c={ongoing} />}

          {isNew ? (
            <EmptyState testId="dashboard-empty-state" icon={Inbox} title="Henüz klinik araştırmanız yok" text="Bir ana şikâyet ve temel bilgilerle anonim bir vaka oluşturun. Taslak olarak kaydedebilir ya da hemen araştırmaya başlayabilirsiniz."
              action={<Link to="/arastirma" className="inline-flex h-9 items-center gap-2 rounded-full bg-navy px-4 text-sm font-medium text-white dark:bg-brand" data-testid="empty-new-research-button"><Microscope className="h-4 w-4" />İlk araştırmayı oluştur</Link>} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Panel className="p-2" data-testid="dashboard-recent-sessions">
                <div className="flex items-center justify-between px-3 pb-1 pt-2"><span className="eyebrow flex items-center gap-1.5"><Clock className="h-3 w-3" />Son araştırmalar</span><Link to="/gecmis" className="text-[12px] text-muted-foreground hover:text-foreground" data-testid="dashboard-history-link">Geçmiş</Link></div>
                {active.slice(0, 4).map((c) => <CaseRow key={c.id} c={c} testId={`recent-case-${c.id}`} />)}
              </Panel>
              <div className="space-y-4">
                <Panel className="p-2" data-testid="dashboard-drafts">
                  <div className="px-3 pb-1 pt-2 eyebrow flex items-center gap-1.5"><FileClock className="h-3 w-3" />Taslak vakalar · {drafts.length}</div>
                  {drafts.length ? drafts.map((c) => <CaseRow key={c.id} c={c} testId={`draft-case-${c.id}`} />) : <p className="px-3 py-3 text-[12.5px] text-muted-foreground">Taslak vaka yok.</p>}
                </Panel>
                <Panel className="p-2" data-testid="dashboard-ready">
                  <div className="px-3 pb-1 pt-2 eyebrow flex items-center gap-1.5"><PlayCircle className="h-3 w-3" />Araştırmaya hazır · {ready.length}</div>
                  {ready.length ? ready.map((c) => <CaseRow key={c.id} c={c} testId={`ready-case-${c.id}`} />) : <p className="px-3 py-3 text-[12.5px] text-muted-foreground">Bekleyen vaka yok.</p>}
                </Panel>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <AccountCard />
          <RecentMeds />
          <Panel className="p-4">
            <div className="eyebrow mb-2">Son kanıt aramaları</div>
            {state.evidenceHistory.length ? <div className="flex flex-wrap gap-1.5">{state.evidenceHistory.slice(0, 5).map((q) => <Link key={q} to={`/kanit?q=${encodeURIComponent(q)}`} className="rounded-full border px-2.5 py-1 text-[12px] hover:border-indigo-300" data-testid="dashboard-evidence-history-item">{q}</Link>)}</div> : <p className="text-[12.5px] text-muted-foreground">Henüz arama yapılmadı.</p>}
          </Panel>
        </div>
      </div>
    </div>
  );
}
