import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ShieldAlert, Archive, ArchiveRestore, Pencil, Plus, Info } from "lucide-react";
import { StatusBadge, caseStatus } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Field = ({ label, children }) => (
  <div><div className="eyebrow mb-1">{label}</div><div className="text-[13.5px]">{children}</div></div>
);

export const CasePanel = ({ c }) => {
  const [open, setOpen] = useState(true);
  const { updateCase } = useStore();
  const navigate = useNavigate();
  const archived = c.status === "arsiv";
  const toggleArchive = () => {
    updateCase(c.id, () => ({ status: archived ? "hazir" : "arsiv" }));
    toast.success(archived ? "Vaka arşivden çıkarıldı" : "Vaka arşivlendi");
  };
  return (
    <div className="space-y-4" data-testid="case-panel">
      <section className="rounded-xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between"><span className="eyebrow">Vaka özeti</span><StatusBadge status={caseStatus(c)} testId="case-panel-status" /></div>
        <Field label="Ana şikâyet / Klinik soru"><p className="leading-relaxed" data-testid="case-panel-complaint">{c.complaint}</p></Field>
        <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-surface p-3">
          <Field label="Yaş"><span className="font-mono">{c.age ?? "—"}</span></Field>
          <Field label="Cinsiyet">{c.sex || "—"}</Field>
          <Field label="Süre">{c.duration || "—"}</Field>
        </div>
        <div className="mt-4"><Field label="Bilinen alerjiler">
          {c.allergies?.length ? <div className="flex flex-wrap gap-1">{c.allergies.map((a) => <span key={a} className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{a}</span>)}</div> : <span className="text-muted-foreground">Bildirilmedi</span>}
        </Field></div>
        <button onClick={() => setOpen(!open)} data-testid="case-details-toggle" className="mt-4 flex w-full items-center justify-between border-t pt-3 text-[13px] font-medium">
          Ek klinik bilgiler<ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
        {open && <p data-testid="case-details-content" className="mt-2 text-[13px] leading-relaxed text-muted-foreground fade-up">{c.context || "Ek klinik bilgi girilmedi."}</p>}
      </section>

      <section className="rounded-xl border border-indigo-200/80 bg-indigo-50/40 p-4 dark:border-indigo-900 dark:bg-indigo-950/20">
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><ShieldAlert className="h-4 w-4" /></div>
          <div className="min-w-0"><div className="font-display text-sm font-semibold">İlaç Güvenlik Kontrolü</div>
            <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">Ayrı bir iş akışı: vakadaki alerjilerle seçtiğiniz ürünleri karşılaştırır.</p></div>
        </div>
        <Button asChild size="sm" variant="outline" className="mt-3 w-full" data-testid="case-safety-check-button"><Link to={`/ilaclar/guvenlik?vaka=${c.id}`}>Kontrolü başlat</Link></Button>
      </section>

      <section className="rounded-xl border bg-card p-4">
        <div className="eyebrow mb-3">Vaka yönetimi</div>
        <div className="grid gap-2">
          {c.status === "taslak" && <Button size="sm" variant="outline" onClick={() => navigate(`/arastirma?taslak=${c.id}`)} data-testid="case-edit-button"><Pencil className="mr-2 h-3.5 w-3.5" />Taslağı düzenle</Button>}
          <Button size="sm" variant="outline" onClick={toggleArchive} data-testid="case-archive-button">{archived ? <><ArchiveRestore className="mr-2 h-3.5 w-3.5" />Arşivden çıkar</> : <><Archive className="mr-2 h-3.5 w-3.5" />Vakayı arşivle</>}</Button>
          <Button size="sm" variant="ghost" onClick={() => navigate("/arastirma")} data-testid="case-new-button"><Plus className="mr-2 h-3.5 w-3.5" />Yeni araştırma</Button>
        </div>
        <p className="mt-3 flex gap-1.5 text-[11px] leading-relaxed text-muted-foreground"><Info className="mt-0.5 h-3 w-3 shrink-0" />Vaka anonimdir; kimliklendirici bilgi saklanmaz.</p>
      </section>
    </div>
  );
};
