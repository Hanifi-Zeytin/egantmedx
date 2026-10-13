import { useState } from "react";
import { Building2, Send, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uid } from "@/lib/format";

const TYPES = ["Aile Sağlığı Merkezi", "Özel poliklinik", "Özel hastane", "Kamu hastanesi", "Üniversite / Eğitim kurumu", "Diğer"];
const SIZES = ["1–5", "6–20", "21–100", "100+"];
const empty = { org: "", type: "", city: "", contact: "", email: "", size: "", note: "" };

const F = ({ label, error, children }) => (
  <label className="block"><div className="mb-1.5 text-[13px] font-medium">{label}</div>{children}{error && <p className="mt-1 text-xs text-rose-600" data-testid="org-error">{error}</p>}</label>
);

export const OrgContact = () => {
  const { set, log } = useStore();
  const [f, setF] = useState(empty);
  const [err, setErr] = useState({});
  const [done, setDone] = useState(false);
  const up = (k) => (e) => setF({ ...f, [k]: e?.target ? e.target.value : e });

  const submit = (e) => {
    e.preventDefault();
    const x = {};
    if (!f.org.trim()) x.org = "Kurum adını girin.";
    if (!f.type) x.type = "Kurum türünü seçin.";
    if (!f.contact.trim()) x.contact = "Yetkili adını girin.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = "Geçerli bir e-posta girin.";
    setErr(x);
    if (Object.keys(x).length) return;
    set((s) => ({ orgRequests: [{ id: uid(), ...f, at: new Date().toISOString(), status: "Yeni" }, ...s.orgRequests] }));
    log(`Kurum başvurusu alındı: ${f.org}`);
    setDone(true);
  };

  return (
    <section id="kurum" className="scroll-mt-20 border-t" data-testid="landing-org">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="eyebrow mb-3 flex items-center gap-1.5"><Building2 className="h-3 w-3" />Kurumlar için</div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ekibiniz için erken erişim isteyin.</h2>
          <p className="mt-4 max-w-md text-muted-foreground md:text-lg">Aile sağlığı merkezleri, poliklinikler ve hastaneler için Klinik / Kurum paketi hazırlanıyor. Bilgilerinizi bırakın, kullanıma açıldığında sizinle iletişime geçelim.</p>
          <ul className="mt-8 space-y-3 text-[14px] text-foreground/80">
            {["Ekip çalışma alanları ve ortak vaka yönetimi", "Kurum yöneticisi paneli", "Hekim doğrulamalarının toplu takibi"].map((t) => <li key={t} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{t}</li>)}
          </ul>
          <p className="mt-8 text-[12px] text-muted-foreground">Prototip: başvurular yalnızca tarayıcınızda saklanır ve Yönetim panelinde görünür.</p>
        </div>
        <div className="rounded-3xl border bg-card p-6 sm:p-8">
          {done ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center fade-up" data-testid="org-success">
              <CheckCircle2 className="h-10 w-10 text-brand" />
              <div className="mt-4 font-display text-xl font-bold">Başvurunuz alındı</div>
              <p className="mt-2 max-w-sm text-[13.5px] text-muted-foreground">{f.org} için erken erişim talebiniz kaydedildi. Ödeme veya taahhüt gerekmez.</p>
              <button onClick={() => { setF(empty); setDone(false); }} data-testid="org-new-request" className="mt-6 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-surface">Yeni başvuru</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5" data-testid="org-form" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <F label="Kurum adı" error={err.org}><Input data-testid="org-name" value={f.org} onChange={up("org")} placeholder="ör. Örnek ASM" /></F>
                <F label="Kurum türü" error={err.type}><Select value={f.type} onValueChange={up("type")}><SelectTrigger data-testid="org-type"><SelectValue placeholder="Seçin" /></SelectTrigger><SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></F>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <F label="Yetkili ad soyad" error={err.contact}><Input data-testid="org-contact" value={f.contact} onChange={up("contact")} /></F>
                <F label="E-posta" error={err.email}><Input data-testid="org-email" type="email" value={f.email} onChange={up("email")} placeholder="ornek@kurum.tr" /></F>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <F label="Şehir"><Input data-testid="org-city" value={f.city} onChange={up("city")} /></F>
                <F label="Hekim sayısı"><Select value={f.size} onValueChange={up("size")}><SelectTrigger data-testid="org-size"><SelectValue placeholder="Seçin" /></SelectTrigger><SelectContent>{SIZES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></F>
              </div>
              <F label="Notunuz (opsiyonel)"><Textarea data-testid="org-note" value={f.note} onChange={up("note")} rows={3} className="resize-none" placeholder="İhtiyaçlarınızı kısaca yazın" /></F>
              <button type="submit" data-testid="org-submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy text-sm font-semibold text-white transition-colors hover:bg-brand dark:bg-brand"><Send className="h-4 w-4" />Erken erişim iste</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
