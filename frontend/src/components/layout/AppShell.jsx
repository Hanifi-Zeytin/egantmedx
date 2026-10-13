import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function AppShell() {
  const { state } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { pathname } = useLocation();
  const fullBleed = /^\/arastirma\/.+/.test(pathname);

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    const fn = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen((o) => !o); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  if (!state.entered) return <Navigate to="/tanitim" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className={cn("hidden lg:flex shrink-0 border-r bg-surface transition-[width] duration-300", state.collapsed ? "w-[68px]" : "w-[248px]")}>
        <Sidebar collapsed={state.collapsed} />
      </aside>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[272px] p-0 bg-surface">
          <SheetTitle className="sr-only">Gezinme</SheetTitle>
          <Sidebar collapsed={false} mobile />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} onSearch={() => setPaletteOpen(true)} />
        <main data-testid="main-content" className={cn("min-h-0 flex-1", fullBleed ? "overflow-hidden" : "overflow-y-auto scrollbar-thin")}>
          {fullBleed ? <Outlet /> : (
            <div className="mx-auto w-full max-w-[1280px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12"><Outlet /></div>
          )}
        </main>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
