import { useNavigate } from "react-router-dom";
import { Stethoscope, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";

const Option = ({ icon: Icon, title, text, onClick, testId, tone }) => (
  <button onClick={onClick} data-testid={testId} className="group flex w-full items-start gap-3 rounded-xl border bg-card p-4 text-left transition-[border-color,transform] hover:-translate-y-px hover:border-brand/50">
    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></div>
    <div className="flex-1"><div className="text-[14px] font-semibold">{title}</div><div className="mt-0.5 text-[12.5px] text-muted-foreground">{text}</div></div>
    <ArrowRight className="mt-2 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
  </button>
);

export const LoginDialog = ({ open, onOpenChange }) => {
  const { state, set, log, importTour } = useStore();
  const navigate = useNavigate();
  const enter = (workspace) => {
    set({ entered: true, workspace });
    log(workspace === "admin" ? "Yönetici olarak demo girişi yapıldı" : "Hekim olarak demo girişi yapıldı");
    if (workspace !== "admin" && state.pendingTour) { const id = importTour(); navigate(`/arastirma/${id}`); return; }
    navigate(workspace === "admin" ? "/yonetim" : "/");
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="login-dialog">
        <DialogHeader>
          <DialogTitle className="font-display">MedAssistix'e giriş</DialogTitle>
          <DialogDescription>Bu bir prototiptir; gerçek kimlik doğrulama yoktur. Keşfetmek istediğiniz bağlamı seçin.</DialogDescription>
        </DialogHeader>
        {state.pendingTour && <div className="flex items-center gap-2 rounded-xl border border-brand/40 bg-brand-soft/50 px-3 py-2.5 text-[12.5px]" data-testid="login-tour-notice"><Sparkles className="h-4 w-4 text-brand" />Canlı turdaki vakanız hekim hesabınıza aktarılacak.</div>}
        <div className="space-y-2">
          <Option testId="login-as-physician" icon={Stethoscope} tone="bg-brand-soft text-brand-fg" title="Hekim olarak devam et" text="Dr. Elif Yılmaz · doğrulanmış demo hesabı" onClick={() => enter("personal")} />
          <Option testId="login-as-admin" icon={ShieldCheck} tone="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" title="Platform yöneticisi olarak devam et" text="Doğrulama kuyruğu ve hesap yönetimi" onClick={() => enter("admin")} />
        </div>
        <div className="flex items-center justify-between border-t pt-4 text-[13px]">
          <span className="text-muted-foreground">Hesabınız yok mu?</span>
          <button onClick={() => { onOpenChange(false); navigate("/kayit"); }} data-testid="login-to-signup" className="font-semibold text-brand-fg hover:underline">Hekim hesabı oluştur →</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
