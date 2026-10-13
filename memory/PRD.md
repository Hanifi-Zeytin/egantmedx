# MedAssistix — PRD

## Original Problem
Turkish-language, AI-assisted clinical research, evidence discovery and medication information platform prototype for physicians in Türkiye (full brief in conversation). Working, navigable frontend prototype; all UI text Turkish.

## User Choices
- AI responses: labeled demo (MOCK), no real AI
- Storage: browser localStorage (no backend)
- Theme: both light & dark with toggle

## Architecture
React (CRA + craco), Tailwind, shadcn/ui, lucide-react. State: `src/lib/store.js` (Context + localStorage `medassistix-prototype-v1`). Data: `src/data/demo.js` (sample cases, evidence, products, physicians), `src/data/mock.js` (mock assistant). No backend usage.

## Personas
Family physicians / GPs / specialists; platform administrators.

## Implemented (2026-06)
- App shell: collapsible sidebar, workspace switcher (Kişisel / Çankaya ASM Ekibi / Platform Yönetimi), theme toggle, mobile sheet nav, quota meter
- Ana Sayfa: quick question, 3 primary actions, continue card, recent/drafts/ready, account status, recent meds & evidence searches, empty state
- Klinik Araştırma: anonymized case form (PII warning, validation), Taslak Kaydet / Araştırmayı Başlat; 68/32 workspace, composer (auto-expand, Enter send, 4 quick actions + İlaç Sorgula), loading/answer/clarification/no-evidence/error states, case panel w/ collapsible details, safety check link, archive
- Kanıt Ara: search, source/lang/type filters, sample records labeled ÖRNEK, external TR Dizin/Europe PMC live-search links, history
- İlaçlar: brand/ingredient search, tabs, product detail w/ provenance & “Veri mevcut değil”; İlaç Güvenlik Kontrolü (name-level allergy match, duplicate ingredient, unavailable data)
- Geçmiş, Paketler (Yakında), Profil (verification states demo), Yönetim (queue approve/reject, accounts, workspaces, logs)

## Backlog
- P1: Command palette (Ctrl+K), case export/print summary
- P1: Edit case details inline from workspace
- P2: Real LLM integration, real auth, backend persistence, real medication/evidence APIs
