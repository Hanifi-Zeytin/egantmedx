import { Sparkles, BookOpenText, UserRound, Lock, EyeOff, BadgeCheck, Scale, Check, Clock, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/layout/Sidebar";

const LAYERS = [
  { icon: UserRound, label: "Hekim girdisi", text: "Sizin girdiğiniz vaka bilgileri ve sorular — nötr yüzeyde, “Hekim sorusu” etiketiyle.", cls: "border bg-surface" },
  { icon: Sparkles, label: "Yapay zekâ yorumu", text: "Asistan çıktıları turkuaz kenar çizgisi ve “Yapay zekâ” etiketiyle; asla kanıt gibi sunulmaz.", cls: "border border-l-[3px] border-l-brand bg-card" },
  { icon: BookOpenText, label: "Bilimsel kaynak", text: "Yayın ve kılavuz bağlantıları indigo, akademik künye düzeninde; orijinal kaynağa yönlendirir.", cls: "border border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30" },
];

export const Transparency = () => (
  <section id="seffaflik" className="mx-auto max-w-[1240px] scroll-mt-20 px-5 py-24 sm:px-8" data-testid="landing-transparency">
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <div className="eyebrow mb-3">Şeffaflık ilkesi</div>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Neyin yapay zekâ, neyin kanıt olduğunu her zaman bilirsiniz.</h2>
        <p className="mt-4 text-muted-foreground md:text-lg">MedAssistix bir karar destek ve araştırma ortamıdır; otonom tanı koymaz, reçete yazmaz. Her bilgi katmanı görsel olarak ayrıştırılır.</p>
        <ul className="mt-8 space-y-3 text-[14px]">
          {["Yayın, PMID, kanıt düzeyi veya sonuç uydurulmaz", "Mevcut olmayan klinik veri açıkça “Veri mevcut değil” olarak işaretlenir", "Klinik karar her zaman hekime aittir"].map((t) => <li key={t} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{t}</li>)}
        </ul>
      </div>
      <div className="space-y-3">
        {LAYERS.map((l, i) => (
          <div key={l.label} className={`rounded-2xl p-5 fade-up ${l.cls}`} style={{ animationDelay: `${i * 90}ms`, marginLeft: `${i * 24}px` }} data-testid={`layer-${i}`}>
            <div className="flex items-center gap-2"><l.icon className="h-4 w-4" /><span className="font-display text-[15px] font-bold">{l.label}</span></div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{l.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TRUST = [
  { icon: EyeOff, title: "Anonim vaka yapısı", text: "Ad, T.C. kimlik no, telefon gibi bilgiler istenmez; metinde algılanırsa uyarı gösterilir." },
  { icon: BadgeCheck, title: "Hekim doğrulaması", text: "Klinik sorgular yalnızca doğrulanmış hekim hesaplarıyla yapılabilir." },
  { icon: Scale, title: "Ayrık yetkiler", text: "Platform yöneticisi yetkisi, hekim onayı anlamına gelmez; iki bağlam ayrı tutulur." },
  { icon: Lock, title: "Kontrollü kapsam", text: "Bağlı olmayan entegrasyonlar bağlıymış gibi gösterilmez; sınırlar açıkça belirtilir." },
];

export const Trust = () => (
  <section className="bg-navy text-white" data-testid="landing-trust">
    <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8">
      <div className="max-w-2xl"><div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-teal-300">Güven ve güvenlik</div><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Klinik ciddiyetle tasarlandı.</h2></div>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((t) => (
          <div key={t.title} className="bg-navy p-6"><t.icon className="h-5 w-5 text-teal-300" /><h3 className="mt-5 text-[16px] font-bold">{t.title}</h3><p className="mt-2 text-[13.5px] leading-relaxed text-white/65">{t.text}</p></div>
        ))}
      </div>
    </div>
  </section>
);

const PLANS = [
  { name: "Ücretsiz Deneme", price: "₺0", note: "Hekim doğrulamasından sonra", items: ["5 klinik sorgu", "Kanıt Ara ve İlaç kataloğu", "İlaç Güvenlik Kontrolü"], active: true },
  { name: "Professional", price: "Yakında", note: "Bireysel hekimler için", items: ["Genişletilmiş sorgu hakkı", "Gelişmiş filtreler", "Vaka dışa aktarma"] },
  { name: "Klinik / Kurum", price: "Yakında", note: "ASM, poliklinik ve kurumlar", items: ["Ekip çalışma alanları", "Yönetici paneli", "Kurumsal hesap yönetimi"] },
];

export const PricingPreview = ({ onSignup }) => (
  <section id="paketler" className="mx-auto max-w-[1240px] scroll-mt-20 px-5 py-24 sm:px-8" data-testid="landing-pricing">
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div><div className="eyebrow mb-3">Paketler</div><h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ücretsiz başlayın.</h2></div>
      <p className="max-w-md text-[13.5px] text-muted-foreground">Ücretli paketler ve ödeme altyapısı henüz aktif değildir. Şu anda satın alma yapılamaz.</p>
    </div>
    <div className="mt-10 grid gap-4 md:grid-cols-3">
      {PLANS.map((p) => (
        <div key={p.name} className={`flex flex-col rounded-2xl border bg-card p-6 ${p.active ? "border-brand/60 shadow-[0_0_0_4px_hsl(var(--brand)/0.08)]" : ""}`} data-testid={`landing-plan-${p.active ? "trial" : p.name.split(" ")[0].toLowerCase()}`}>
          <div className="flex items-center justify-between"><h3 className="text-lg font-bold">{p.name}</h3>{!p.active && <span className="inline-flex items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" />Yakında</span>}</div>
          <div className={`mt-3 font-display text-3xl font-extrabold ${p.active ? "" : "text-muted-foreground"}`}>{p.price}</div>
          <div className="text-[12.5px] text-muted-foreground">{p.note}</div>
          <ul className="mt-5 flex-1 space-y-2">{p.items.map((i) => <li key={i} className="flex gap-2 text-[13.5px]"><Check className="mt-0.5 h-3.5 w-3.5 text-brand" />{i}</li>)}</ul>
          {p.active ? <button onClick={onSignup} data-testid="landing-plan-trial-cta" className="mt-6 h-10 rounded-lg bg-navy text-sm font-medium text-white hover:bg-brand dark:bg-brand">Denemeye başla</button> : <div className="mt-6 h-10 rounded-lg border border-dashed text-center text-sm leading-10 text-muted-foreground">Yakında</div>}
        </div>
      ))}
    </div>
  </section>
);

const FAQ = [
  ["MedAssistix tanı koyar veya tedavi önerir mi?", "Hayır. MedAssistix bir klinik araştırma ve karar destek ortamıdır. Yapılandırılmış değerlendirme çerçeveleri ve kaynak bağlantıları sunar; klinik karar her zaman hekime aittir."],
  ["Hasta verileri nasıl korunuyor?", "Vaka oluştururken ad, kimlik numarası, telefon gibi doğrudan kimliklendirici bilgiler istenmez. Sistem bu tür ifadeleri algıladığında sizi uyarır."],
  ["Hangi kaynaklarda arama yapabilirim?", "Kanıt Ara modülü TR Dizin, Europe PMC, uluslararası yayınlar ve erişilebilir klinik kılavuzlar üzerinden keşif için tasarlanmıştır. Tam metinler çoğaltılmaz; orijinal kaynağa yönlendirilirsiniz."],
  ["İlaç etkileşimlerini kontrol edebilir miyim?", "İlaç Güvenlik Kontrolü şu anda etken madde–alerji ad eşleşmesi ve tekrarlayan etken madde kontrolü yapar. Etkileşim veritabanı entegrasyonu bağlı değildir ve bu açıkça belirtilir."],
  ["Ücretsiz deneme neleri kapsıyor?", "Hekim doğrulamanız tamamlandıktan sonra 5 klinik sorgu hakkı tanımlanır. Ücretli paketler henüz kullanıma açılmamıştır."],
];

export const Faq = () => (
  <section id="sss" className="scroll-mt-20 border-t bg-surface/50" data-testid="landing-faq">
    <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[360px_1fr]">
      <div><div className="eyebrow mb-3">SSS</div><h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Sık sorulan sorular</h2></div>
      <Accordion type="single" collapsible className="rounded-2xl border bg-card px-5">
        {FAQ.map(([q, a], i) => (
          <AccordionItem key={q} value={`f${i}`} className={i === FAQ.length - 1 ? "border-b-0" : ""}>
            <AccordionTrigger data-testid={`faq-trigger-${i}`} className="text-left text-[15px] font-semibold hover:no-underline">{q}</AccordionTrigger>
            <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export const FinalCta = ({ onSignup }) => (
  <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8" data-testid="landing-final-cta">
    <div className="relative overflow-hidden rounded-3xl border bg-card p-10 sm:p-14">
      <div className="absolute inset-0 grid-bg opacity-60 [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
      <div className="relative max-w-2xl">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Güven. Kesinlik. Klinik netlik.</h2>
        <p className="mt-4 text-muted-foreground md:text-lg">İlk klinik araştırmanızı birkaç dakika içinde başlatın.</p>
        <button onClick={onSignup} data-testid="final-cta-button" className="group mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-navy px-5 text-sm font-semibold text-white hover:bg-brand dark:bg-brand">Ücretsiz başla<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>
      </div>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="border-t" data-testid="landing-footer">
    <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-start md:justify-between">
      <div className="max-w-sm"><Logo /><p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">Hekimin klinik araştırma, bilimsel kanıt ve ilaç bilgisine tek platformdan ulaşması.</p></div>
      <p className="max-w-md text-[11.5px] leading-relaxed text-muted-foreground">Bu sayfa ve uygulama bir prototiptir. Gösterilen tüm veriler örnektir; yapay zekâ yanıtları simüle edilmiştir ve klinik tavsiye niteliği taşımaz. © {new Date().getFullYear()} MedAssistix</p>
    </div>
  </footer>
);
