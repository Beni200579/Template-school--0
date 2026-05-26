/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ActiveTab, Candidate, Student, Invoice, ReceiptValidation, BankAccount, FeeSettings, StudentSection } from "./types";
import { 
  INITIAL_CANDIDATES, 
  INITIAL_STUDENTS, 
  INITIAL_INVOICES, 
  INITIAL_RECEIPTS, 
  INITIAL_BANKS, 
  INITIAL_FEE_SETTINGS 
} from "./mockData";

// Views
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import MatriculasView from "./components/MatriculasView";
import FinanceiroView from "./components/FinanceiroView";
import ConfiguracoesView from "./components/ConfiguracoesView";
import ProfileView from "./components/ProfileView";
import ServicosView from "./components/ServicosView";
import kitandaLogo from "./Logo/logo_geral (1).png";

import { 
  Menu, 
  Bell, 
  CalendarDays,
  LogOut,
  MapPin
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.DASHBOARD);
  const [studentSection, setStudentSection] = useState<StudentSection>("confirmacao");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileStudentsOpen, setMobileStudentsOpen] = useState(false);

  // Global React States
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [receipts, setReceipts] = useState<ReceiptValidation[]>(INITIAL_RECEIPTS);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANKS);
  const [feeSettings, setFeeSettings] = useState<FeeSettings>(INITIAL_FEE_SETTINGS);

  // 1. Add Candidate to Funnel
  const handleAddCandidate = (newCand: Omit<Candidate, "id">) => {
    const candidate: Candidate = {
      ...newCand,
      id: `cand-${Date.now()}`
    };
    setCandidates((prev) => [candidate, ...prev]);
  };

  // 2. Move Candidate Stages
  const handleUpdateCandidateStatus = (id: string, newStatus: Candidate["status"]) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  // 3. Trigger Enrollment Invoice for Admitidos
  const handleTriggerInvoicing = (candidate: Candidate) => {
    // Generate an invoice for this candidate
    const exist = invoices.some(i => i.studentName === candidate.name && i.reference.includes("INSCRIC"));
    if (exist) return; // avoid duplicates

    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      studentName: candidate.name,
      studentClass: candidate.className,
      reference: `INSCRIC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      amount: feeSettings.tuitionFee, // Standard fee
      status: "PENDENTE"
    };

    setInvoices((prev) => [invoice, ...prev]);
  };

  // 4. Update Student Journal Records
  const handleUpdateStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
  };

  // 5. Submit simulated upload bank transfer receipt
  const handleSubmitNewReceipt = (newRec: Omit<ReceiptValidation, "id" | "status">) => {
    const recEntry: ReceiptValidation = {
      ...newRec,
      id: `val-${Date.now()}`,
      status: "PENDEN_VALIDACAO"
    };
    
    // Add verification queue
    setReceipts((prev) => [recEntry, ...prev]);
    
    // Set invoice to "EM_ANALISE"
    setInvoices((prev) =>
      prev.map(inv => {
        if (inv.id === newRec.invoiceId) {
          return { ...inv, status: "EM_ANALISE", paymentMethod: newRec.paymentMethod };
        }
        return inv;
      })
    );
  };

  // 6. Validate Receipt from Queue (Approve / Reject)
  const handleValidateReceipt = (id: string, approve: boolean, reason?: string) => {
    setReceipts((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: approve ? "CONFIRMADO" : "REJEITADO",
            rejectionReason: reason
          };
        }
        return r;
      })
    );

    // Find the receipt details
    const targetReceipt = receipts.find((r) => r.id === id);
    if (!targetReceipt) return;

    // Update associated Invoice status
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === targetReceipt.invoiceId) {
          return { 
            ...inv, 
            status: approve ? "PAGO" : "PENDENTE",
            paymentMethod: approve ? targetReceipt.paymentMethod : undefined 
          };
        }
        return inv;
      })
    );

    // If approved, clear any matched candidate payment pending warning
    if (approve) {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.name === targetReceipt.studentName) {
            return { ...c, paymentPending: false };
          }
          return c;
        })
      );
    }
  };

  // 7. Simulates instantaneous Multicaixa Express clearance
  const handleSimulateExpressPayment = (invoiceId: string, phone: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: "PAGO",
            paymentMethod: "Multicaixa Express",
            receiptDetails: `Express Tel: ${phone}, Operação liquidada eletronicamente`
          };
        }
        return inv;
      })
    );

    // Clear matched candidate warning
    const targetInvoice = invoices.find(i => i.id === invoiceId);
    if (targetInvoice) {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.name === targetInvoice.studentName) {
            return { ...c, paymentPending: false };
          }
          return c;
        })
      );
    }
  };

  // 8. Settings and Accounts
  const handleUpdateFees = (fees: FeeSettings) => {
    setFeeSettings(fees);
  };

  const handleUpdateBankAccounts = (accounts: BankAccount[]) => {
    setBankAccounts(accounts);
  };

  const handleLogout = () => {
    alert("Sessão terminada. Retornando ao ecrã de login do EduManager.");
  };

  return (
    <div id="school-root" className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* Targetable Administrative Sidebar */}
      <Sidebar
        activeTab={activeTab}
        studentSection={studentSection}
        setStudentSection={setStudentSection}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setMobileMenuOpen(false);
        }}
      />

      {/* Main Administrative Screen Area */}
      <main id="app-main-viewport" className="flex-1 flex flex-col min-w-0 bg-slate-100 h-screen overflow-hidden relative">
        
        {/* Institutional TopAppBar */}
        <header id="app-top-bar" className="flex justify-between items-center h-14 px-5 w-full bg-white border-b border-slate-200 flex-shrink-0 z-30 sticky top-0">
          
          <div id="topbar-left" className="flex items-center gap-3">
            {/* Mobile Hamburguer Toggle */}
            <button 
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Title display on mobile */}
            <div id="topbar-logo-mobile" className="flex items-center gap-2 md:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1 ring-1 ring-slate-200">
                <img src={kitandaLogo} alt="Kitanda" className="h-full w-full object-contain" />
              </div>
              <h1 className="font-sans text-sm font-semibold text-slate-800">
                Kitanda
              </h1>
            </div>

            {/* School location display indicator */}
            <div
              id="school-location-pill"
              className="hidden items-center gap-2 border-l border-slate-200 pl-4 text-sm md:flex"
            >
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span className="font-medium text-slate-800">Instituição não configurada</span>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-slate-500">Localização não definida</span>
            </div>
          </div>

          <div id="topbar-right" className="flex items-center gap-4">
            {/* Quick school bells */}
            <div id="topbar-icons" className="flex items-center gap-1 text-slate-400">
              <button className="p-2 hover:bg-slate-50 rounded-full transition-colors relative cursor-pointer" title="Lembretes">
                <Bell className="w-4 h-4 text-slate-500" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
              </button>
              <button className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer" title="Calendário do MED">
                <CalendarDays className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="w-px h-6 bg-slate-100 hidden sm:block" />

            {/* Logout trigger directly available */}
            <button 
              id="topbar-logout-btn"
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 hover:bg-red-50 hover:text-red-700 py-1.5 px-3 transition-all cursor-pointer border border-slate-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </header>

        {/* Mobile slide-in Navigation menu drawer */}
        {mobileMenuOpen && (
          <div id="mobile-drawer-overlay" className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div id="mobile-drawer-panel" className="bg-slate-900 w-64 h-full p-5 flex flex-col cursor-default" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
                <h3 className="font-sans font-bold text-white text-base">Kitanda</h3>
                <button onClick={() => setMobileMenuOpen(false)} className="text-white text-sm font-bold font-mono">✕</button>
              </div>
              <nav className="flex-1 space-y-2">
                <button onClick={() => { setActiveTab(ActiveTab.DASHBOARD); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === ActiveTab.DASHBOARD ? "bg-emerald-600 text-white" : "text-slate-400"}`}>Visão Geral</button>
                <div>
                  <button
                    onClick={() => setMobileStudentsOpen((open) => !open)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === ActiveTab.MATRICULAS ? "bg-emerald-600 text-white" : "text-slate-400"}`}
                  >
                    Alunos
                  </button>
                  {mobileStudentsOpen && (
                    <div className="mt-1 space-y-1 pl-4">
                      {[
                        { label: "Confirmação", section: "confirmacao" as StudentSection },
                        { label: "Matrícula", section: "matricula" as StudentSection },
                        { label: "Inscrição", section: "inscricao" as StudentSection },
                      ].map((option) => (
                        <button
                          key={option.section}
                          onClick={() => { setStudentSection(option.section); setActiveTab(ActiveTab.MATRICULAS); setMobileMenuOpen(false); }}
                          className="w-full rounded-lg px-4 py-2 text-left text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => { setActiveTab(ActiveTab.FINANCEIRO); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === ActiveTab.FINANCEIRO ? "bg-emerald-600 text-white" : "text-slate-400"}`}>Gestão Financeira</button>
                <button onClick={() => { setActiveTab(ActiveTab.CONFIGURACOES); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold ${activeTab === ActiveTab.CONFIGURACOES ? "bg-emerald-600 text-white" : "text-slate-400"}`}>Configurações</button>
              </nav>
            </div>
          </div>
        )}

        {/* Scrollable Canvas for views */}
          <div id="app-canvas" className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === ActiveTab.DASHBOARD && (
              <DashboardView
                candidates={candidates}
                students={students}
                invoices={invoices}
                receipts={receipts}
                feeSettings={feeSettings}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === ActiveTab.MATRICULAS && (
              <MatriculasView
                section={studentSection}
                candidates={candidates}
                onAddCandidate={handleAddCandidate}
                onUpdateCandidateStatus={handleUpdateCandidateStatus}
                onTriggerInvoicing={handleTriggerInvoicing}
              />
            )}

            {activeTab === ActiveTab.SERVICOS && <ServicosView />}

            {activeTab === ActiveTab.FINANCEIRO && (
              <FinanceiroView
                invoices={invoices}
                receipts={receipts}
                bankAccounts={bankAccounts}
                feeSettings={feeSettings}
                candidates={candidates}
                onValidateReceipt={handleValidateReceipt}
                onSubmitNewReceipt={handleSubmitNewReceipt}
                onSimulateExpressPayment={handleSimulateExpressPayment}
                onUpdateFees={handleUpdateFees}
              />
            )}

            {activeTab === ActiveTab.CONFIGURACOES && (
              <ConfiguracoesView
                bankAccounts={bankAccounts}
                onUpdateBankAccounts={handleUpdateBankAccounts}
              />
            )}

            {activeTab === ActiveTab.PERFIL && <ProfileView />}
          </div>
        </div>
      </main>
    </div>
  );
}
