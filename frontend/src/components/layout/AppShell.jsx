import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function AppShell() {
  const { state } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const fullBleed = /^\/arastirma\/.+/.test(pathname);

  useEffect(() => setMobileOpen(false), [pathname]);

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
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main data-testid="main-content" className={cn("min-h-0 flex-1", fullBleed ? "overflow-hidden" : "overflow-y-auto scrollbar-thin")}>
          {fullBleed ? <Outlet /> : (
            <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10"><Outlet /></div>
          )}
        </main>
      </div>
    </div>
  );
}
