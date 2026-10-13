import { Link, useLocation } from "react-router-dom";
import { Menu, BadgeCheck, Clock3, XCircle, Moon, Sun, FlaskConical, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { WORKSPACES } from "@/data/demo";
import { Logo } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

const TITLES = [
  [/^\/$/, "Ana Sayfa"], [/^\/arastirma\/.+/, "Klinik Araştırma · Çalışma Alanı"], [/^\/arastirma/, "Klinik Araştırma"],
  [/^\/kanit/, "Kanıt Ara"], [/^\/ilaclar\/guvenlik/, "İlaçlar · Güvenlik Kontrolü"], [/^\/ilaclar\/.+/, "İlaçlar · Ürün Detayı"], [/^\/ilaclar/, "İlaçlar"],
  [/^\/gecmis/, "Geçmiş"], [/^\/paketler/, "Paketler"], [/^\/profil/, "Profil"], [/^\/yonetim/, "Yönetim"],
];

export const VERIF = {
  "Doğrulandı": { icon: BadgeCheck, cls: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-900" },
  "İnceleniyor": { icon: Clock3, cls: "text-amber-800 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/50 dark:border-amber-900" },
  "Reddedildi": { icon: XCircle, cls: "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-950/50 dark:border-rose-900" },
};

export const VerificationPill = ({ status, testId = "verification-pill" }) => {
  const v = VERIF[status];
  return <span data-testid={testId} className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", v.cls)}><v.icon className="h-3.5 w-3.5" />Hekim: {status}</span>;
};

export const Topbar = ({ onMenu, onSearch }) => {
  const { state, toggleTheme } = useStore();
  const { pathname } = useLocation();
  const title = TITLES.find(([r]) => r.test(pathname))?.[1] || "";
  const ws = WORKSPACES.find((w) => w.id === state.workspace);
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md sm:px-8">
      <button data-testid="mobile-menu-button" onClick={onMenu} aria-label="Menüyü aç" className="grid h-9 w-9 place-items-center rounded-md border lg:hidden"><Menu className="h-4 w-4" /></button>
      <div className="lg:hidden"><Logo collapsed /></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="hidden truncate text-muted-foreground sm:inline">{ws.name}</span>
          <span className="hidden text-muted-foreground/50 sm:inline">/</span>
          <span data-testid="topbar-title" className="truncate font-medium">{title}</span>
        </div>
      </div>
      <button onClick={onSearch} data-testid="topbar-search-button" aria-label="Hızlı arama" className="flex h-9 items-center gap-2 rounded-lg border bg-card px-3 text-[13px] text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground">
        <Search className="h-4 w-4" /><span className="hidden lg:inline">Hızlı ara…</span><kbd className="hidden rounded border bg-surface px-1.5 font-mono text-[10px] lg:inline">Ctrl K</kbd>
      </button>
      <span data-testid="prototype-pill" title="Bu uygulama bir prototiptir; tüm veriler örnektir ve yapay zekâ yanıtları simüle edilmiştir." className="hidden items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 font-mono text-[10.5px] tracking-wide text-muted-foreground xl:inline-flex"><FlaskConical className="h-3 w-3" />PROTOTİP · DEMO VERİ</span>
      {state.workspace !== "admin" && <Link to="/profil" className="hidden sm:block"><VerificationPill status={state.verification} /></Link>}
      <button data-testid="topbar-theme-toggle" onClick={toggleTheme} aria-label="Temayı değiştir" className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden">{state.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
    </header>
  );
};
