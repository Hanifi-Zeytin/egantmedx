import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { StoreProvider, useStore } from "@/lib/store";
import AppShell from "@/components/layout/AppShell";
import Dashboard from "@/pages/Dashboard";
import NewResearch from "@/pages/NewResearch";
import ResearchWorkspace from "@/pages/ResearchWorkspace";
import Evidence from "@/pages/Evidence";
import Medications from "@/pages/Medications";
import MedicationDetail from "@/pages/MedicationDetail";
import SafetyCheck from "@/pages/SafetyCheck";
import History from "@/pages/History";
import Packages from "@/pages/Packages";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";

const ThemedToaster = () => {
  const { state } = useStore();
  return <Toaster theme={state.theme} position="bottom-right" richColors closeButton />;
};

function App() {
  return (
    <div className="App">
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Dashboard />} />
              <Route path="arastirma" element={<NewResearch />} />
              <Route path="arastirma/:id" element={<ResearchWorkspace />} />
              <Route path="kanit" element={<Evidence />} />
              <Route path="ilaclar" element={<Medications />} />
              <Route path="ilaclar/guvenlik" element={<SafetyCheck />} />
              <Route path="ilaclar/:id" element={<MedicationDetail />} />
              <Route path="gecmis" element={<History />} />
              <Route path="paketler" element={<Packages />} />
              <Route path="profil" element={<Profile />} />
              <Route path="yonetim" element={<Admin />} />
              <Route path="*" element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <ThemedToaster />
      </StoreProvider>
    </div>
  );
}

export default App;
