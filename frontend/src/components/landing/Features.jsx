import { Microscope, BookOpenText, Pill, ShieldAlert, Search, FlaskConical, Check, BadgeCheck, FilePlus2, MessagesSquare, Library } from "lucide-react";

const Tag = ({ children, cls }) => <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${cls}`}>{children}</span>;

export const SourceStrip = () => (
  <section className="border-y bg-surface/60" data-testid="landing-sources">
    <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-6 sm:px-8 md:flex-row md:items-center">
      <span className="eyebrow shrink-0">Keşif kaynakları</span>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 font-display text-[15px] font-bold text-foreground/70">
        <span>TR Dizin</span><span>Europe PMC</span><span>Uluslararası yayınlar</span><span>Klinik kılavuzlar</span><span>İlaç kataloğu</span>
      </div>
      <span className="text-[11.5px] text-muted-foreground md:ml-auto">Bağlantılar orijinal kaynaklara yönlendirir; iş birliği iddiası değildir.</span>
    </div>
  </section>
);

const ResearchMini = () => (
  <div className="space-y-2 rounded-xl border bg-background p-3">
    <div className="flex flex-wrap gap-1.5">{["Tedavi yaklaşımı", "İlaç seçenekleri", "Ayırıcı tanı", "Tetkik önerileri"].map((t) => <span key={t} className="rounded-full border bg-card px-2.5 py-1 text-[11px]">{t}</span>)}</div>
    <div className="rounded-lg border border-l-[3px] border-l-brand bg-card p-2.5 text-[11.5px]"><div className="mb-1 font-semibold">Ayırıcı tanı</div>{["Enfeksiyöz nedenler", "İnflamatuvar nedenler", "Kırmızı bayraklar"].map((t) => <div key={t} className="flex items-center gap-1.5 text-muted-foreground"><Check className="h-3 w-3 text-brand" />{t}</div>)}</div>
  </div>
);

const EvidenceMini = () => (
  <div className="space-y-1.5 rounded-xl border bg-background p-3">
    <div className="flex items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5 text-[11.5px] text-muted-foreground"><Search className="h-3 w-3" />kronik öksürük</div>
    {[["TR Dizin", "TR", "Birinci basamakta yaklaşım"], ["Europe PMC", "EN", "Diagnostic pathways"]].map(([s, l, t]) => (
      <div key={s} className="rounded-lg border bg-card p-2"><div className="flex gap-1.5"><Tag cls="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{s}</Tag><Tag cls="border">{l}</Tag></div><div className="mt-1 text-[11.5px] font-medium">{t}</div></div>
    ))}
  </div>
);

const DrugMini = () => (
  <div className="space-y-1.5 rounded-xl border bg-background p-3">
    <div className="flex items-center gap-2 rounded-lg border border-dashed bg-card p-2 text-[11.5px]"><FlaskConical className="h-3.5 w-3.5 text-indigo-600" /><b>Amoksisilin</b><span className="text-muted-foreground">· etken madde</span></div>
    <div className="flex items-center gap-2 rounded-lg border bg-card p-2 text-[11.5px]"><Pill className="h-3.5 w-3.5 text-brand" /><b>Ürün</b><span className="font-mono text-muted-foreground">500 mg · Kapsül</span></div>
    <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50/60 p-2 text-[11px] text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"><ShieldAlert className="h-3.5 w-3.5" />Kayıtlı alerjiyle ad eşleşmesi</div>
  </div>
);

const PILLARS = [
  { icon: Microscope, eyebrow: "01 · Klinik Araştırma", title: "Anonim vakayla bağlamlı araştırma", text: "Ana şikâyet, yaş, cinsiyet, süre ve alerjilerle vaka oluşturun. Asistan her soruyu bu bağlamla ele alır; taslak ve araştırmaya hazır vakalar ayrı izlenir.", mini: ResearchMini, span: "lg:col-span-7" },
  { icon: BookOpenText, eyebrow: "02 · Kanıt Ara", title: "Türkçe öncelikli literatür keşfi", text: "TR Dizin, Europe PMC ve kılavuzlarda yayın başlığı, kaynak, tarih ve dil bilgisiyle arama. Tam metin çoğaltılmaz; orijinal kaynağa gidersiniz.", mini: EvidenceMini, span: "lg:col-span-5" },
  { icon: Pill, eyebrow: "03 · İlaçlar", title: "Ürün ve etken madde araması", text: "Ürün adı veya etken maddeyle arayın; güç, farmasötik form ve veri kaynağı açıkça görünür. Mevcut olmayan klinik veri “Veri mevcut değil” olarak işaretlenir.", mini: DrugMini, span: "lg:col-span-5" },
];

export const Pillars = () => (
  <section id="ozellikler" className="mx-auto max-w-[1240px] scroll-mt-20 px-5 py-24 sm:px-8" data-testid="landing-features">
    <div className="max-w-2xl"><div className="eyebrow mb-3">Platform</div><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Hekimin günlük araştırma ihtiyacı için dört temel modül.</h2><p className="mt-4 text-base text-muted-foreground md:text-lg">Sohbet penceresinden fazlası: vakalar, kanıtlar ve ilaç bilgisi birbirine bağlı tek bir çalışma alanında.</p></div>
    <div className="mt-12 grid gap-4 lg:grid-cols-12">
      {PILLARS.map((p) => (
        <article key={p.title} className={`group rounded-2xl border bg-card p-6 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-foreground/20 ${p.span}`} data-testid={`feature-${p.eyebrow.slice(0, 2)}`}>
          <div className="flex items-center gap-2"><p.icon className="h-4 w-4 text-brand" /><span className="eyebrow">{p.eyebrow}</span></div>
          <h3 className="mt-4 text-xl font-bold tracking-tight">{p.title}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{p.text}</p>
          <div className="mt-6"><p.mini /></div>
        </article>
      ))}
      <article className="rounded-2xl border border-indigo-200/80 bg-indigo-50/40 p-6 lg:col-span-7 dark:border-indigo-900 dark:bg-indigo-950/20" data-testid="feature-safety">
        <div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /><span className="eyebrow">04 · İlaç Güvenlik Kontrolü</span></div>
        <h3 className="mt-4 text-xl font-bold tracking-tight">Ayrı, net sınırları olan bir güvenlik iş akışı.</h3>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">Seçilen ürünlerin etken maddelerini kayıtlı alerjilerle ve birbirleriyle karşılaştırır. Bağlı olmayan etkileşim veritabanları bağlıymış gibi gösterilmez.</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-3 text-[12px]">
          <div className="rounded-lg border bg-card p-3"><b>Alerji eşleşmesi</b><div className="mt-1 text-muted-foreground">ad düzeyinde</div></div>
          <div className="rounded-lg border bg-card p-3"><b>Tekrarlayan etken madde</b><div className="mt-1 text-muted-foreground">ürünler arası</div></div>
          <div className="rounded-lg border border-dashed bg-card p-3"><b>Etkileşimler</b><div className="mt-1 text-muted-foreground">entegrasyon bağlı değil</div></div>
        </div>
      </article>
    </div>
  </section>
);

const STEPS = [
  { icon: BadgeCheck, title: "Hekim doğrulaması", text: "Hesabınızı oluşturun; diploma veya uzmanlık belgeniz incelenir. Durumunuzu İnceleniyor / Doğrulandı olarak takip edersiniz." },
  { icon: FilePlus2, title: "Anonim vaka", text: "Kimliklendirici bilgi olmadan klinik bağlamı girin. İsterseniz taslak olarak kaydedip daha sonra tamamlayın." },
  { icon: MessagesSquare, title: "Araştırın", text: "Klinik soru yazın veya dört hızlı eylemden birini seçin. Yanıtlar yapılandırılmış ve açıkça etiketlidir." },
  { icon: Library, title: "Kanıta ulaşın", text: "İlgili literatüre ve ilaç bilgisine geçin; tüm oturumlarınız Geçmiş'te düzenli kalır." },
];

export const HowItWorks = () => (
  <section id="nasil" className="scroll-mt-20 border-y bg-surface/50" data-testid="landing-how">
    <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[360px_1fr]">
        <div><div className="eyebrow mb-3">Nasıl çalışır</div><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Birkaç saniyede başlayın.</h2><p className="mt-4 text-muted-foreground">Yoğun bir poliklinik gününde bile ilk sorudan kanıta en az tıklamayla ulaşacak şekilde tasarlandı.</p></div>
        <ol className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.title} className="bg-card p-6" data-testid={`how-step-${i + 1}`}>
              <div className="flex items-center justify-between"><s.icon className="h-5 w-5 text-brand" /><span className="font-mono text-[12px] text-muted-foreground">0{i + 1}</span></div>
              <h3 className="mt-5 text-[17px] font-bold">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
