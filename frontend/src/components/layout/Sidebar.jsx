import { NavLink, useNavigate } from "react-router-dom";
import { Home, Microscope, BookOpenText, Pill, History, Package, UserRound, ShieldCheck, ChevronsUpDown, Check, PanelLeftClose, PanelLeftOpen, Moon, Sun, Building2, User, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useStore, usePhysician, FREE_QUOTA } from "@/lib/store";
import { WORKSPACES } from "@/data/demo";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { to: "/", label: "Ana Sayfa", icon: Home, id: "home", end: true },
  { to: "/arastirma", label: "Klinik Araştırma", icon: Microscope, id: "research" },
  { to: "/kanit", label: "Kanıt Ara", icon: BookOpenText, id: "evidence" },
  { to: "/ilaclar", label: "İlaçlar", icon: Pill, id: "medications" },
  { to: "/gecmis", label: "Geçmiş", icon: History, id: "history" },
];
const ACCOUNT_NAV = [
  { to: "/paketler", label: "Paketler", icon: Package, id: "packages" },
  { to: "/profil", label: "Profil", icon: UserRound, id: "profile" },
];
const ADMIN_NAV = [{ to: "/yonetim", label: "Yönetim", icon: ShieldCheck, id: "admin" }];

export const Logo = ({ collapsed }) => (
  <div className="flex items-center gap-2.5">
    <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy text-white shadow-sm ring-1 ring-white/10">
      <svg viewBox="0 0 24 24" className="h-4 w-4"><path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-teal-400 ring-2 ring-surface" />
    </div>
    {!collapsed && <div className="font-display text-[15px] font-semibold tracking-tight">MedAssist<span className="text-brand">ix</span></div>}
  </div>
);

const NavItem = ({ item, collapsed }) => (
  <NavLink to={item.to} end={item.end} data-testid={`nav-${item.id}`} title={collapsed ? item.label : undefined}
    className={({ isActive }) => cn(
      "group relative flex h-10 items-center gap-3 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors",
      isActive ? "bg-card text-foreground shadow-sm ring-1 ring-border" : "text-muted-foreground hover:bg-accent hover:text-foreground",
      collapsed && "justify-center px-0")}>
    {({ isActive }) => (<>
      {isActive && <span className="absolute -left-3 top-2 bottom-2 w-[3px] rounded-r bg-brand" />}
      <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-brand")} strokeWidth={1.8} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </>)}
  </NavLink>
);

const WorkspaceSwitcher = ({ collapsed }) => {
  const { state, set, log } = useStore();
  const me = usePhysician();
  const navigate = useNavigate();
  const ws = WORKSPACES.find((w) => w.id === state.workspace);
  const sub = (w) => (w.id === "personal" ? me.name : w.sub);
  const choose = (w) => {
    set({ workspace: w.id });
    log(`Çalışma alanı değiştirildi: ${w.name}`);
    navigate(w.type === "admin" ? "/yonetim" : "/");
  };
  const Icon = (w) => (w.type === "admin" ? ShieldCheck : w.id === "clinic" ? Building2 : User);
  const I = Icon(ws);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button data-testid="workspace-switcher" className={cn("flex w-full items-center gap-2.5 rounded-lg border bg-card p-2 text-left transition-colors hover:border-foreground/20", collapsed && "justify-center")}>
          <div className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-md", ws.type === "admin" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "bg-brand-soft text-brand-fg")}><I className="h-3.5 w-3.5" /></div>
          {!collapsed && (<>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold" data-testid="current-workspace-name">{ws.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">{sub(ws)}</div>
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          </>)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="eyebrow">Hekim çalışma alanları</DropdownMenuLabel>
        {WORKSPACES.filter((w) => w.type === "hekim").map((w) => <WsItem key={w.id} w={{ ...w, sub: sub(w) }} active={w.id === state.workspace} onSelect={() => choose(w)} Icon={Icon(w)} />)}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="eyebrow">Yönetici</DropdownMenuLabel>
        {WORKSPACES.filter((w) => w.type === "admin").map((w) => <WsItem key={w.id} w={{ ...w, sub: sub(w) }} active={w.id === state.workspace} onSelect={() => choose(w)} Icon={Icon(w)} />)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const WsItem = ({ w, active, onSelect, Icon }) => (
  <DropdownMenuItem data-testid={`workspace-option-${w.id}`} onSelect={onSelect} className="gap-2.5 py-2">
    <Icon className="h-4 w-4 text-muted-foreground" />
    <div className="flex-1"><div className="text-sm font-medium">{w.name}</div><div className="text-xs text-muted-foreground">{w.sub}</div></div>
    {active && <Check className="h-4 w-4 text-brand" />}
  </DropdownMenuItem>
);

const QuotaMeter = () => {
  const { state } = useStore();
  const left = Math.max(FREE_QUOTA - state.queriesUsed, 0);
  return (
    <NavLink to="/paketler" data-testid="sidebar-quota" className="block rounded-lg border bg-card p-3 transition-colors hover:border-foreground/20">
      <div className="flex items-center justify-between text-[11.5px]"><span className="font-medium">Ücretsiz Deneme</span><span className="font-mono text-muted-foreground">{left}/{FREE_QUOTA}</span></div>
      <div className="mt-2 flex gap-1">{Array.from({ length: FREE_QUOTA }).map((_, i) => <span key={i} className={cn("h-1 flex-1 rounded-full", i < left ? "bg-brand" : "bg-border")} />)}</div>
      <div className="mt-1.5 text-[11px] text-muted-foreground">kalan klinik sorgu hakkı</div>
    </NavLink>
  );
};

const SidebarNav = ({ collapsed, isAdmin }) => (
  <nav className="flex flex-col gap-0.5 pl-0">
    {isAdmin ? (<>
      {!collapsed && <div className="eyebrow px-2.5 pb-1.5 pt-1">Yönetim</div>}
      {ADMIN_NAV.map((i) => <NavItem key={i.id} item={i} collapsed={collapsed} />)}
      {!collapsed && <p className="mt-3 rounded-lg border border-dashed border-amber-300/70 bg-amber-50/60 p-2.5 text-[11.5px] leading-relaxed text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">Yönetici bağlamındasınız. Klinik modüller için bir hekim çalışma alanına geçin.</p>}
    </>) : (<>
      {!collapsed && <div className="eyebrow px-2.5 pb-1.5 pt-1">Çalışma</div>}
      {MAIN_NAV.map((i) => <NavItem key={i.id} item={i} collapsed={collapsed} />)}
      {collapsed ? <div className="my-2 h-px bg-border" /> : <div className="eyebrow px-2.5 pb-1.5 pt-4">Hesap</div>}
      {ACCOUNT_NAV.map((i) => <NavItem key={i.id} item={i} collapsed={collapsed} />)}
    </>)}
  </nav>
);

const UserChip = ({ isAdmin }) => {
  const me = usePhysician();
  const u = isAdmin ? { initials: "CÖ", name: "Can Öztürk", title: "Platform yöneticisi" } : me;
  return (
    <NavLink to="/profil" className="flex min-w-0 items-center gap-2" data-testid="sidebar-user">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy font-display text-[11px] font-bold text-white">{u.initials}</div>
      <div className="min-w-0"><div className="truncate text-[12.5px] font-semibold">{u.name}</div><div className="truncate text-[11px] text-muted-foreground">{u.title}</div></div>
    </NavLink>
  );
};

const SidebarActions = ({ collapsed, mobile }) => {
  const { state, set, toggleTheme } = useStore();
  const navigate = useNavigate();
  const dark = state.theme === "dark";
  return (
    <div className={cn("flex gap-1", collapsed && "flex-col")}>
      <IconBtn testId="sidebar-theme-toggle" label={dark ? "Açık tema" : "Koyu tema"} onClick={toggleTheme}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</IconBtn>
      <IconBtn testId="sidebar-logout-button" label="Çıkış yap" onClick={() => { set({ entered: false }); navigate("/tanitim"); }}><LogOut className="h-4 w-4" /></IconBtn>
      {!mobile && <IconBtn testId="sidebar-collapse-toggle" label={collapsed ? "Genişlet" : "Daralt"} onClick={() => set({ collapsed: !collapsed })}>{collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}</IconBtn>}
    </div>
  );
};

export const Sidebar = ({ collapsed, mobile }) => {
  const { state } = useStore();
  const isAdmin = state.workspace === "admin";
  return (
    <div className="flex h-full w-full flex-col gap-4 p-3" data-testid="sidebar">
      <div className={cn("flex h-9 items-center px-1", collapsed ? "justify-center" : "justify-between")}><Logo collapsed={collapsed} /></div>
      <WorkspaceSwitcher collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} isAdmin={isAdmin} />
      <div className="mt-auto flex flex-col gap-2">
        {!collapsed && !isAdmin && <QuotaMeter />}
        <div className={cn("flex items-center gap-2 rounded-lg p-1.5", collapsed ? "flex-col" : "justify-between")}>
          {!collapsed && <UserChip isAdmin={isAdmin} />}
          <SidebarActions collapsed={collapsed} mobile={mobile} />
        </div>
      </div>
    </div>
  );
};

const IconBtn = ({ children, label, onClick, testId }) => (
  <button data-testid={testId} title={label} aria-label={label} onClick={onClick} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">{children}</button>
);
