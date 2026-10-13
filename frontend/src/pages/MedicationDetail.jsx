import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pill, ShieldAlert, Database, CheckCircle2, CircleDashed, Unplug } from "lucide-react";
import { useStore } from "@/lib/store";
import { Panel, SampleBadge, UnavailableValue } from "@/components/common";
import { PRODUCTS } from "@/data/demo";

const Row = ({ label, children, verified }) => (
  <div className="grid grid-cols-[140px_1fr] items-center gap-3 border-b py-3 last:border-0 sm:grid-cols-[180px_1fr_auto]">
    <span className="text-[12.5px] text-muted-foreground">{label}</span>
    <span className="text-[14px] font-medium">{children}</span>
    {verified !== undefined && <span className="hidden sm:inline-flex">{verified ? <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="h-3.5 w-3.5" />Katalog verisi</span> : <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><CircleDashed className="h-3.5 w-3.5" />Doğrulanmadı</span>}</span>}
  </div>
);

export default function MedicationDetail() {
  const { id } = useParams();
  const { visitMed } = useStore();
  const p = PRODUCTS.find((x) => x.id === id);
  useEffect(() => { if (p) visitMed(p.id); }, [p?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!p) return <div className="py-20 text-center" data-testid="med-not-found"><h2 className="text-lg font-bold">Ürün bulunamadı</h2><Link to="/ilaclar" className="mt-3 inline-block text-sm underline">İlaçlara dön</Link></div>;
  const siblings = PRODUCTS.filter((x) => x.ingredient === p.ingredient && x.id !== p.id);

  return (
    <div className="space-y-6" data-testid="med-detail-page">
      <Link to="/ilaclar" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground" data-testid="med-detail-back"><ArrowLeft className="h-4 w-4" />İlaç araması</Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center fade-up">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand-fg"><Pill className="h-6 w-6" /></div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" data-testid="med-detail-name">{p.name}</h1><span className="font-mono text-lg text-muted-foreground">{p.strength}</span><SampleBadge>ÖRNEK ÜRÜN</SampleBadge></div>
          <p className="mt-1 text-sm text-muted-foreground">{p.ingredient} · {p.form}</p>
        </div>
        <Link to={`/ilaclar/guvenlik?ilac=${p.id}`} data-testid="med-detail-safety-button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-indigo-300 bg-indigo-50 px-3.5 text-sm font-medium text-indigo-800 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200"><ShieldAlert className="h-4 w-4" />Güvenlik kontrolüne ekle</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6 min-w-0">
          <Panel className="px-5 py-2">
            <div className="eyebrow pb-1 pt-3">Ürün bilgileri</div>
            <Row label="Ürün adı" verified>{p.name}</Row>
            <Row label="Etken madde" verified>{p.ingredient}</Row>
            <Row label="Güç / Doz" verified><span className="font-mono">{p.strength}</span></Row>
            <Row label="Farmasötik form" verified>{p.form}</Row>
            <Row label="Ambalaj" verified>{p.pack}</Row>
            <Row label="Ruhsat sahibi" verified>{p.firm}</Row>
          </Panel>
          <Panel className="px-5 py-2" data-testid="med-clinical-info">
            <div className="flex items-center justify-between pb-1 pt-3"><span className="eyebrow">Klinik bilgiler</span><span className="text-[11px] text-muted-foreground">Doğrulanmış kaynak bağlı değil</span></div>
            <Row label="Endikasyonlar" verified={false}><UnavailableValue /></Row>
            <Row label="Kontrendikasyonlar" verified={false}><UnavailableValue /></Row>
            <Row label="Dozaj" verified={false}><UnavailableValue>Bu prototipte dozaj önerisi sunulmaz</UnavailableValue></Row>
            <Row label="İlaç etkileşimleri" verified={false}><span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground"><Unplug className="h-3.5 w-3.5" />Etkileşim entegrasyonu bağlı değil</span></Row>
          </Panel>
        </div>
        <div className="space-y-4">
          <Panel className="p-4" data-testid="med-provenance">
            <div className="eyebrow mb-3 flex items-center gap-1.5"><Database className="h-3 w-3" />Veri kaynağı</div>
            <div className="space-y-2 text-[12.5px] leading-relaxed">
              <div className="flex justify-between"><span className="text-muted-foreground">Kaynak</span><span>Geliştirme veri seti</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Kayıt türü</span><span>Örnek (kurgusal)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Lisans durumu</span><span>Kamuya açık değil</span></div>
            </div>
            <p className="mt-3 border-t pt-3 text-[11.5px] text-muted-foreground">Ürün adı ve firma prototip için oluşturulmuştur; gerçek bir ruhsatlı ürünü temsil etmez.</p>
          </Panel>
          <Panel className="p-4">
            <div className="eyebrow mb-2">Aynı etken madde · {siblings.length}</div>
            {siblings.length ? siblings.map((s) => <Link key={s.id} to={`/ilaclar/${s.id}`} data-testid={`med-sibling-${s.id}`} className="flex items-center justify-between rounded px-1.5 py-2 text-[13px] hover:bg-surface"><span>{s.name} <span className="font-mono text-muted-foreground">{s.strength}</span></span><span className="text-[11px] text-muted-foreground">{s.form}</span></Link>) : <p className="text-[12px] text-muted-foreground">Başka ürün yok.</p>}
          </Panel>
        </div>
      </div>
    </div>
  );
}
