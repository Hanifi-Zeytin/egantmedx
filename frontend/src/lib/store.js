import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seedCases, seedPhysicians, PHYSICIAN } from "@/data/demo";
import { uid } from "@/lib/format";

const KEY = "medassistix-prototype-v1";
export const FREE_QUOTA = 5;

const initial = () => ({
  theme: "light", workspace: "personal", collapsed: false, entered: false,
  cases: seedCases(), evidenceHistory: ["kronik öksürük", "hipertansiyon"], recentMeds: ["p6", "p10"],
  verification: "Doğrulandı", queriesUsed: 1, physicians: seedPhysicians(),
  audit: [{ id: "l0", text: "Demo çalışma alanı oluşturuldu", at: new Date().toISOString() }],
  profile: null, pendingTour: null, orgRequests: [],
});

const load = () => {
  try { const s = JSON.parse(localStorage.getItem(KEY)); return s ? { ...initial(), ...s } : initial(); } catch { return initial(); }
};

const Ctx = createContext(null);

export const StoreProvider = ({ children }) => {
  const [state, setState] = useState(load);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(state)); }, [state]);
  useEffect(() => { document.documentElement.classList.toggle("dark", state.theme === "dark"); }, [state.theme]);

  const set = useCallback((patch) => setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) })), []);

  const actions = useMemo(() => ({
    set,
    toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
    upsertCase: (c) => {
      const id = c.id || uid();
      const now = new Date().toISOString();
      set((s) => {
        const exists = s.cases.find((x) => x.id === id);
        const cases = exists
          ? s.cases.map((x) => (x.id === id ? { ...x, ...c, updatedAt: now } : x))
          : [{ messages: [], ws: s.workspace, createdAt: now, ...c, id, updatedAt: now }, ...s.cases];
        return { cases };
      });
      return id;
    },
    updateCase: (id, fn) => set((s) => ({ cases: s.cases.map((x) => (x.id === id ? { ...x, ...fn(x), updatedAt: new Date().toISOString() } : x)) })),
    consumeQuery: () => set((s) => ({ queriesUsed: s.queriesUsed + 1 })),
    addEvidenceSearch: (q) => set((s) => ({ evidenceHistory: [q, ...s.evidenceHistory.filter((x) => x !== q)].slice(0, 8) })),
    clearEvidenceHistory: () => set({ evidenceHistory: [] }),
    visitMed: (id) => set((s) => ({ recentMeds: [id, ...s.recentMeds.filter((x) => x !== id)].slice(0, 6) })),
    log: (text) => set((s) => ({ audit: [{ id: uid(), text, at: new Date().toISOString() }, ...s.audit].slice(0, 30) })),
    importTour: () => {
      const id = uid();
      const now = new Date().toISOString();
      set((s) => {
        if (!s.pendingTour) return {};
        const { c, messages } = s.pendingTour;
        const imported = { id, ws: "personal", complaint: c.complaint, age: c.age, sex: c.sex, duration: c.duration, allergies: c.allergies, context: "Tanıtım sayfasındaki canlı turdan aktarıldı.", status: "hazir", messages, createdAt: now, updatedAt: now };
        return { cases: [imported, ...s.cases], pendingTour: null, workspace: "personal" };
      });
      return id;
    },
    submitSignup: (profile) => set((s) => ({
      profile, entered: true, workspace: "personal", verification: "İnceleniyor", queriesUsed: 0,
      cases: s.cases.filter((c) => c.ws !== "personal"), evidenceHistory: [], recentMeds: [],
      physicians: [{ id: "me", name: profile.name, title: profile.title, city: profile.city, status: "İnceleniyor", submitted: new Date().toISOString(), doc: profile.docs.map((d) => d.name).join(", ") }, ...s.physicians.filter((p) => p.id !== "me")],
      audit: [{ id: uid(), text: `Yeni hekim başvurusu: ${profile.name}`, at: new Date().toISOString() }, ...s.audit],
    })),
    setPhysicianStatus: (pid, status, reason) => set((s) => ({
      physicians: s.physicians.map((p) => (p.id === pid ? { ...p, status, reason: reason || undefined } : p)),
      ...(pid === "me" ? { verification: status } : {}),
    })),
    resetDemo: () => setState({ ...initial(), theme: state.theme, entered: true }),
    emptyDemo: () => setState({ ...initial(), theme: state.theme, entered: true, cases: [], evidenceHistory: [], recentMeds: [], queriesUsed: 0 }),
  }), [set, state.theme]);

  return createElement(Ctx.Provider, { value: { state, ...actions } }, children);
};

export const useStore = () => useContext(Ctx);

export const usePhysician = () => {
  const { state } = useStore();
  return state.profile || PHYSICIAN;
};

export const useWorkspaceCases = () => {
  const { state } = useStore();
  return state.cases.filter((c) => c.ws === state.workspace);
};

export const caseTitle = (c) => {
  const t = (c.complaint || "Adsız vaka").split(/[.,;]/)[0];
  return t.length > 60 ? t.slice(0, 57) + "…" : t;
};
