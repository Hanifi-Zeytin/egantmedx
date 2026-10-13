# MedAssistix — PRD

## Original Problem
Turkish-language, AI-assisted clinical research, evidence discovery and medication information platform prototype for physicians in Türkiye (full brief in conversation). Working, navigable frontend prototype; all UI text Turkish.

## User Choices
- AI responses: labeled demo (MOCK), no real AI
- Storage: browser localStorage (no backend)
- Theme: both light & dark with toggle

## Architecture
React (CRA + craco), Tailwind, shadcn/ui, lucide-react. State: `src/lib/store.js` (Context + localStorage `medassistix-prototype-v1`, `entered` flag gates app). Data: `src/data/demo.js`, `src/data/mock.js`. No backend usage.

## Implemented
- 2026-06: Full app (Ana Sayfa, Klinik Araştırma, Kanıt Ara, İlaçlar + Güvenlik Kontrolü, Geçmiş, Paketler, Profil, Yönetim), workspace switcher, themes
- 2026-06: Pre-login landing page `/tanitim` (hero w/ rotating product preview, sources strip, 4-module bento, how-it-works, AI-vs-evidence transparency, trust, pricing preview, FAQ, CTA, footer); demo login dialog (Hekim / Yönetici); sidebar logout
- 2026-06: Landing live product tour (#dene): 3 sample cases, composer + quick actions, simulated answers, 3 tries per session then login CTA
- 2026-06: Hekim kayıt akışı (/kayit, 4 adım, belge adı kaydı, İnceleniyor→admin onay/ret→yeniden yükleme, profil zaman çizelgesi), turdan vakaya aktarım, Kurum başvuru formu (+ Yönetim sekmesi), Ctrl+K komut paleti, daha ferah arayüz (boşluk, kenarlık, tipografi)

## Backlog
- P1: Case export/print summary, inline case editing
- P2: Real LLM, real auth, backend persistence, real medication/evidence APIs
