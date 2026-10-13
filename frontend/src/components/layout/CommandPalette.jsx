import { useNavigate } from "react-router-dom";
import { Home, Microscope, BookOpenText, Pill, History, Package, UserRound, ShieldAlert, Plus, Moon, FileText } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { useStore, useWorkspaceCases, caseTitle } from "@/lib/store";
import { PRODUCTS } from "@/data/demo";
import { useState } from "react";

const PAGES = [
  ["/", "Ana Sayfa", Home], ["/arastirma", "Klinik Araştırma", Microscope], ["/kanit", "Kanıt Ara", BookOpenText],
  ["/ilaclar", "İlaçlar", Pill], ["/gecmis", "Geçmiş", History], ["/paketler", "Paketler", Package], ["/profil", "Profil", UserRound],
];

export const CommandPalette = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { state, toggleTheme } = useStore();
  const cases = useWorkspaceCases();
  const [q, setQ] = useState("");
  const go = (to) => { onOpenChange(false); setQ(""); navigate(to); };
  const isAdmin = state.workspace === "admin";

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput data-testid="command-input" value={q} onValueChange={setQ} placeholder="Sayfa, vaka, ilaç veya kanıt ara…" />
      <CommandList className="max-h-[420px]" data-testid="command-list">
        <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
        {q.trim().length > 1 && !isAdmin && (
          <CommandGroup heading="Hızlı arama">
            <CommandItem value={`kanıt ${q}`} onSelect={() => go(`/kanit?q=${encodeURIComponent(q.trim())}`)} data-testid="command-evidence-search"><BookOpenText className="mr-2" />“{q.trim()}” için kanıt ara</CommandItem>
            <CommandItem value={`ilaç ${q}`} onSelect={() => go(`/ilaclar?q=${encodeURIComponent(q.trim())}`)} data-testid="command-med-search"><Pill className="mr-2" />“{q.trim()}” için ilaç sorgula</CommandItem>
          </CommandGroup>
        )}
        {!isAdmin && (
          <CommandGroup heading="İşlemler">
            <CommandItem onSelect={() => go("/arastirma")} data-testid="command-new-research"><Plus className="mr-2" />Yeni klinik araştırma</CommandItem>
            <CommandItem onSelect={() => go("/ilaclar/guvenlik")} data-testid="command-safety"><ShieldAlert className="mr-2" />İlaç Güvenlik Kontrolü</CommandItem>
            <CommandItem onSelect={() => { toggleTheme(); onOpenChange(false); }} data-testid="command-theme"><Moon className="mr-2" />Temayı değiştir</CommandItem>
          </CommandGroup>
        )}
        {!isAdmin && (<>
          <CommandSeparator />
          <CommandGroup heading="Sayfalar">
            {PAGES.map(([to, l, I]) => <CommandItem key={to} value={`sayfa ${l}`} onSelect={() => go(to)} data-testid={`command-page-${to.replace("/", "") || "home"}`}><I className="mr-2" />{l}</CommandItem>)}
          </CommandGroup>
          {cases.length > 0 && (
            <CommandGroup heading="Vakalar">
              {cases.slice(0, 6).map((c) => <CommandItem key={c.id} value={`vaka ${c.complaint} ${c.id}`} onSelect={() => go(c.status === "taslak" ? `/arastirma?taslak=${c.id}` : `/arastirma/${c.id}`)} data-testid={`command-case-${c.id}`}><FileText className="mr-2" /><span className="truncate">{caseTitle(c)}</span><CommandShortcut>{c.age ?? "—"} yaş</CommandShortcut></CommandItem>)}
            </CommandGroup>
          )}
          <CommandGroup heading="İlaçlar (örnek)">
            {PRODUCTS.slice(0, q ? 20 : 4).map((p) => <CommandItem key={p.id} value={`ilaç ${p.name} ${p.ingredient} ${p.strength} ${p.id}`} onSelect={() => go(`/ilaclar/${p.id}`)} data-testid={`command-med-${p.id}`}><Pill className="mr-2" />{p.name} {p.strength}<CommandShortcut>{p.ingredient}</CommandShortcut></CommandItem>)}
          </CommandGroup>
        </>)}
        {isAdmin && (
          <CommandGroup heading="Yönetim">
            <CommandItem onSelect={() => go("/yonetim")} data-testid="command-admin"><ShieldAlert className="mr-2" />Yönetim paneli</CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};
