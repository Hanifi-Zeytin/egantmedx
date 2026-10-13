import { useEffect, useState } from "react";
import { ArrowRight, ArrowUp, Check, BookOpenText, Sparkles, Moon, Sun, Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Sidebar";
import { MockBadge } from "@/components/common";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const LINKS = [["ozellikler", "Özellikler"], ["dene", "Deneyin"], ["nasil", "Nasıl çalışır"], ["seffaflik", "Şeffaflık"], ["paketler", "Paketler"], ["kurum", "Kurumlar"], ["sss", "SSS"]];

export const LandingNav = ({ onLogin, onSignup }) => {
  const { state, toggleTheme } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = document.getElementById("landing-scroll");
    const fn = () => setScrolled(el.scrollTop > 12);
    el?.addEventListener("scroll", fn);
    return () => el?.removeEventListener("scroll", fn);
  }, []);
  return (
    <header className={cn("sticky top-0 z-40 transition-[background-color,border-color] duration-300", scrolled ? "border-b bg-background/85 backdrop-blur-md" : "border-b border-transparent")}>
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-5 sm:px-8">
        <Logo />
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {LINKS.map(([id, l]) => <a key={id} href={`#${id}`} data-testid={`landing-nav-${id}`} className="rounded-md px-3 py-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground">{l}</a>)}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button onClick={toggleTheme} aria-label="Temayı değiştir" data-testid="landing-theme-toggle" className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">{state.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
          <button onClick={onLogin} data-testid="landing-login-button" className="hidden h-9 rounded-lg px-3.5 text-sm font-medium hover:bg-accent sm:block">Giriş yap</button>
          <button onClick={onSignup} data-testid="landing-signup-button" className="h-9 whitespace-nowrap rounded-lg bg-navy px-3 text-sm font-medium text-white transition-colors hover:bg-brand sm:px-4 dark:bg-brand"><span className="sm:hidden">Başla</span><span className="hidden sm:inline">Ücretsiz başla</span></button>
          <button onClick={() => setOpen(!open)} aria-label="Menü" data-testid="landing-mobile-menu" className="grid h-9 w-9 place-items-center rounded-md border md:hidden">{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        </div>
      </div>
      {open && <nav className="border-t bg-background px-5 py-3 md:hidden">{LINKS.map(([id, l]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block py-2 text-sm">{l}</a>)}<button onClick={onLogin} className="mt-2 w-full rounded-lg border py-2 text-sm font-medium">Giriş yap</button></nav>}
    </header>
  );
};

const QUESTIONS = [
  { q: "58 yaş erkek, 1 aydır poliüri ve susama. Tetkik planında hangi kategorileri düşünmeliyim?", tag: "Tetkik önerileri", topic: "tip 2 diyabet" },
  { q: "45 yaş kadın, 6 haftalık kuru öksürük. Ayırıcı tanıda hangi başlıklar öne çıkar?", tag: "Ayırıcı tanı", topic: "kronik öksürük" },
  { q: "Penisilin alerjisi olan hastada ilaç seçeneklerini değerlendirirken nelere dikkat edilmeli?", tag: "İlaç seçenekleri", topic: "penisilin alerjisi" },
];

const ProductPreview = () => {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % QUESTIONS.length), 4800); return () => clearInterval(t); }, []);
  const cur = QUESTIONS[i];
  return (
    <div className="relative" data-testid="landing-hero-preview">
      <div className="absolute -inset-6 -z-10 rounded-[32px] grid-bg opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-[0_30px_80px_-30px_rgba(11,25,44,.35)]">
        <div className="flex items-center gap-2 border-b bg-surface/70 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" /><span className="h-2.5 w-2.5 rounded-full bg-border" /><span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="ml-3 text-[11.5px] text-muted-foreground">Klinik Araştırma · Vaka #A31F</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Hazır</span>
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          <div key={`q${i}`} className="ml-auto max-w-[88%] rounded-2xl rounded-br-md border bg-surface px-3.5 py-2.5 text-[13px] leading-relaxed fade-up">{cur.q}</div>
          <div key={`a${i}`} className="rounded-xl border border-l-[3px] border-l-brand p-3.5 fade-up" style={{ animationDelay: "250ms" }}>
            <div className="mb-2 flex flex-wrap items-center gap-2"><div className="grid h-5 w-5 place-items-center rounded bg-navy text-[9px] font-bold text-white dark:bg-brand">AI</div><span className="text-[12px] font-semibold">{cur.tag}</span><MockBadge className="ml-auto">ÖRNEK YANIT</MockBadge></div>
            {["Vaka bağlamı ile yapılandırılmış değerlendirme", "Kırmızı bayrak bulguları için kontrol listesi", "Kılavuz kontrolü ve hekim kararı vurgusu"].map((t) => <div key={t} className="flex items-center gap-2 py-0.5 text-[12.5px] text-foreground/80"><Check className="h-3 w-3 text-brand" />{t}</div>)}
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-surface px-2.5 py-2 text-[11.5px]"><BookOpenText className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" /><span className="text-muted-foreground">Kanıt bağlantısı:</span><span className="truncate">TR Dizin · “{cur.topic}”</span></div>
          </div>
        </div>
        <div className="border-t p-3">
          <div className="flex items-center gap-2 rounded-xl border px-3 py-2"><span className="flex-1 truncate text-[12.5px] text-muted-foreground">Takip sorusu yazın…</span><span className="grid h-7 w-7 place-items-center rounded-full bg-navy text-white dark:bg-brand"><ArrowUp className="h-3.5 w-3.5" /></span></div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-4 hidden rounded-xl border bg-card px-3.5 py-2.5 shadow-lg sm:block fade-up" style={{ animationDelay: "500ms" }}>
        <div className="eyebrow">İlaç kataloğu</div><div className="mt-0.5 font-mono text-[13px]"><b>14.566</b> ürün · <b>4.035</b> etken madde</div><div className="text-[10.5px] text-muted-foreground">geliştirme veri seti</div>
      </div>
    </div>
  );
};

export const Hero = ({ onSignup }) => (
  <section className="relative mx-auto grid max-w-[1240px] overflow-x-clip items-center gap-14 px-5 pb-24 pt-14 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-20" data-testid="landing-hero">
    <div className="fade-up">
      <a href="#seffaflik" className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"><Sparkles className="h-3.5 w-3.5 text-brand" />Türkiye'deki hekimler için tasarlandı<ArrowRight className="h-3 w-3" /></a>
      <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">Klinik sorudan<br />bilimsel kanıta,<br /><span className="text-brand">tek çalışma alanında.</span></h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">MedAssistix; anonim vaka araştırması, literatür keşfi ve ilaç bilgisini hekimin gün içindeki iş akışına uygun tek bir platformda birleştirir. Yapay zekâ yorumu ile doğrulanmış kanıt her zaman ayrı gösterilir.</p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button onClick={onSignup} data-testid="hero-cta-primary" className="group inline-flex h-11 items-center gap-2 rounded-xl bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-brand dark:bg-brand">Ücretsiz denemeye başla<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>
        <a href="#dene" data-testid="hero-cta-secondary" className="inline-flex h-11 items-center rounded-xl border px-5 text-sm font-medium transition-colors hover:bg-accent">Giriş yapmadan deneyin</a>
      </div>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-muted-foreground">
        {["Hekim doğrulamasından sonra 5 ücretsiz sorgu", "Kimliklendirici hasta bilgisi istenmez", "Kredi kartı gerekmez"].map((t) => <span key={t} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand" />{t}</span>)}
      </div>
    </div>
    <ProductPreview />
  </section>
);
