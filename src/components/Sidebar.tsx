import { useState } from "react";
import type { ComponentType } from "react";
import { ActiveTab, StudentSection } from "../types";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Settings,
  UserPlus,
} from "lucide-react";
import kitandaLogo from "../Logo/logo_geral (1).png";

interface SidebarProps {
  activeTab: ActiveTab;
  studentSection: StudentSection;
  setActiveTab: (tab: ActiveTab) => void;
  setStudentSection: (section: StudentSection) => void;
}

const studentOptions: { label: string; section: StudentSection }[] = [
  { label: "Confirmação", section: "confirmacao" },
  { label: "Matrícula", section: "matricula" },
  { label: "Inscrição", section: "inscricao" },
];

export default function Sidebar({ activeTab, studentSection, setActiveTab, setStudentSection }: SidebarProps) {
  const [studentsOpen, setStudentsOpen] = useState(activeTab === ActiveTab.MATRICULAS);

  const openStudentSection = (section: StudentSection) => {
    setStudentSection(section);
    setActiveTab(ActiveTab.MATRICULAS);
    setStudentsOpen(true);
  };

  return (
    <aside
      id="app-sidebar"
      className="relative z-40 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 md:flex"
    >
      <div id="sidebar-header" className="border-b border-slate-800 px-5 py-5">
        <div id="sidebar-logo-group" className="flex items-center gap-3">
          <div id="sidebar-icon-container" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm">
            <img src={kitandaLogo} alt="Kitanda" className="h-full w-full object-contain" />
          </div>
          <h1 id="sidebar-title" className="text-xl font-semibold leading-none text-white">
            Kitanda
          </h1>
        </div>
      </div>

      <nav id="sidebar-nav" className="flex flex-1 flex-col gap-1 px-3 py-5">
        <NavButton
          id="nav-dash"
          active={activeTab === ActiveTab.DASHBOARD}
          icon={LayoutDashboard}
          label="Visão Geral"
          onClick={() => setActiveTab(ActiveTab.DASHBOARD)}
        />

        <div id="nav-students-group">
          <button
            id="nav-students"
            type="button"
            onClick={() => setStudentsOpen((open) => !open)}
            aria-expanded={studentsOpen}
            className={`relative flex w-full items-center gap-3 px-3.5 py-3 text-sm font-medium transition-all duration-150 ${
              activeTab === ActiveTab.MATRICULAS
                ? "border-l-2 border-emerald-500 bg-slate-900 text-white"
                : "text-slate-400 hover:bg-slate-900/70 hover:text-slate-200"
            }`}
          >
            <UserPlus
              className={`h-[18px] w-[18px] shrink-0 ${
                activeTab === ActiveTab.MATRICULAS ? "text-emerald-400" : "text-slate-500"
              }`}
            />
            <span>Alunos</span>
            <ChevronDown
              className={`ml-auto h-4 w-4 text-slate-500 transition-transform ${studentsOpen ? "rotate-180" : ""}`}
            />
          </button>

          {studentsOpen && (
            <div id="nav-students-options" className="mt-1 space-y-1 pl-9 pr-2">
              {studentOptions.map((option) => (
                <button
                  key={option.section}
                  type="button"
                  onClick={() => openStudentSection(option.section)}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-left text-xs font-medium transition ${
                    activeTab === ActiveTab.MATRICULAS && studentSection === option.section
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-900/70 hover:text-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <NavButton
          id="nav-serv"
          active={activeTab === ActiveTab.SERVICOS}
          icon={BriefcaseBusiness}
          label="Serviços"
          onClick={() => setActiveTab(ActiveTab.SERVICOS)}
        />
        <NavButton
          id="nav-fina"
          active={activeTab === ActiveTab.FINANCEIRO}
          icon={CreditCard}
          label="Finanças"
          onClick={() => setActiveTab(ActiveTab.FINANCEIRO)}
        />
        <NavButton
          id="nav-conf"
          active={activeTab === ActiveTab.CONFIGURACOES}
          icon={Settings}
          label="Configurações"
          onClick={() => setActiveTab(ActiveTab.CONFIGURACOES)}
        />
      </nav>

      <div id="sidebar-footer" className="mt-auto border-t border-slate-800 bg-slate-950 p-3">
        <button
          id="sidebar-footer-info"
          type="button"
          onClick={() => setActiveTab(ActiveTab.PERFIL)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
            activeTab === ActiveTab.PERFIL
              ? "bg-slate-900 text-white ring-1 ring-emerald-500/30"
              : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
          }`}
        >
          <div
            id="avatar-circle"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-semibold uppercase text-emerald-300 ring-1 ring-emerald-400/20"
          >
            UT
          </div>
          <div id="user-details" className="min-w-0 flex-1">
            <p id="user-display-name" className="truncate text-sm font-semibold leading-none">
              Utilizador
            </p>
            <p id="user-role" className="mt-1 truncate text-[11px] text-slate-400">
              Perfil não configurado
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
        </button>
      </div>
    </aside>
  );
}

function NavButton({
  id,
  active,
  icon: Icon,
  label,
  badge,
  onClick,
}: {
  id: string;
  active: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center gap-3 px-3.5 py-3 text-sm font-medium transition-all duration-150 ${
        active
          ? "border-l-2 border-emerald-500 bg-slate-900 text-white"
          : "text-slate-400 hover:bg-slate-900/70 hover:text-slate-200"
      }`}
    >
      <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-emerald-400" : "text-slate-500"}`} />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-300">
          {badge}
        </span>
      )}
    </button>
  );
}
