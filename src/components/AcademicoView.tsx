import { useState } from "react";
import { Student } from "../types";
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  GraduationCap, 
  Save, 
  AlertCircle,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

interface AcademicoViewProps {
  students: Student[];
  onUpdateStudents: (updatedStudents: Student[]) => void;
}

export default function AcademicoView({ students, onUpdateStudents }: AcademicoViewProps) {
  const [localStudents, setLocalStudents] = useState<Student[]>(students);
  const [academicMode, setAcademicMode] = useState<"assiduidade" | "notas">("assiduidade");
  const [selectedDate, setSelectedDate] = useState<string>("2026-05-25");
  const [selectedClass, setSelectedClass] = useState<string>("10ª Classe - Ciências Físicas");
  const [selectedSubject, setSelectedSubject] = useState<string>("Matemática");
  const [showError, setShowError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAttendanceChange = (studentId: string, status: "P" | "F" | "FJ") => {
    const updated = localStudents.map(st => {
      if (st.id === studentId) {
        return {
          ...st,
          attendance: {
            ...st.attendance,
            [selectedDate]: status
          }
        };
      }
      return st;
    });
    setLocalStudents(updated);
    setSaveSuccess(false);
  };

  const handleGradeChange = (studentId: string, field: "prova1" | "prova2" | "mac", val: string) => {
    const numVal = parseFloat(val);
    
    // Allow empty string to let user delete values easily
    if (val === "") {
      const updated = localStudents.map(st => {
        if (st.id === studentId) {
          const newGrades = { ...st.grades, [field]: 0 };
          const media = parseFloat(((newGrades.prova1 + newGrades.prova2 + newGrades.mac) / 3).toFixed(1));
          return { ...st, grades: { ...newGrades, media } };
        }
        return st;
      });
      setLocalStudents(updated);
      return;
    }

    if (isNaN(numVal) || numVal < 0 || numVal > 20) {
      setShowError("As notas em Angola devem estar rigorosamente no intervalo de 0 a 20 valores.");
      setTimeout(() => setShowError(null), 4000);
      return;
    }

    const updated = localStudents.map(st => {
      if (st.id === studentId) {
        const newGrades = { ...st.grades, [field]: numVal };
        const media = parseFloat(((newGrades.prova1 + newGrades.prova2 + newGrades.mac) / 3).toFixed(1));
        return { ...st, grades: { ...newGrades, media } };
      }
      return st;
    });
    setLocalStudents(updated);
    setSaveSuccess(false);
  };

  const handleObservationChange = (studentId: string, text: string) => {
    const updated = localStudents.map(st => {
      if (st.id === studentId) {
        return { ...st, observations: text };
      }
      return st;
    });
    setLocalStudents(updated);
    setSaveSuccess(false);
  };

  const handleSaveAll = () => {
    onUpdateStudents(localStudents);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Stats Counters
  const totalStudentsCount = localStudents.length;
  const presentCount = localStudents.filter(s => s.attendance[selectedDate] === "P").length;
  const absentCount = localStudents.filter(s => s.attendance[selectedDate] === "F").length;
  const justifiedCount = localStudents.filter(s => s.attendance[selectedDate] === "FJ").length;

  return (
    <div id="school-journal-panel" className="space-y-6">
      {/* Top Header Selector Area */}
      <div id="journal-heading-row" className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 id="journal-title" className="font-sans font-bold text-xl text-slate-800">
            Diário de Classe Digital
          </h2>
          <p id="journal-desc" className="text-xs text-slate-500">
            Registe assiduidade (presenças) e lance qualificações do 1º ao 2º Semestre letivo.
          </p>
        </div>

        {/* Filters */}
        <div id="journal-filters" className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">Turma / Sala</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-slate-700 py-1.5 px-3 rounded-xl outline-none focus:border-slate-300 cursor-pointer"
            >
              <option value="10ª Classe - Ciências Físicas">10ª Classe - CFB</option>
              <option value="11ª Classe - Informática de Gestão">11ª Classe - Info</option>
              <option value="9ª Classe - Turma B">9ª Classe - Sala B</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">Disciplina</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-slate-700 py-1.5 px-3 rounded-xl outline-none focus:border-slate-300 cursor-pointer"
            >
              <option value="Matemática">Matemática</option>
              <option value="Física e Química">Física e Química</option>
              <option value="Língua Portuguesa">Língua Portuguesa</option>
              <option value="Educação Física">Educação Física</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div id="journal-main-card" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Underline Tabs Selector */}
        <div id="journal-tabs" className="flex border-b border-slate-100 px-6 pt-4 gap-6 bg-slate-50/50">
          <button
            id="tab-btn-assiduidade"
            onClick={() => setAcademicMode("assiduidade")}
            className={`pb-3 font-semibold text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              academicMode === "assiduidade"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Controlo de Assiduidade</span>
          </button>
          
          <button
            id="tab-btn-notas"
            onClick={() => setAcademicMode("notas")}
            className={`pb-3 font-semibold text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              academicMode === "notas"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Lançamento de Notas (0 - 20)</span>
          </button>
        </div>

        {/* Inner Panel Header with Date / Metadata */}
        <div id="journal-sub-header" className="px-6 py-4 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white">
          <div className="flex items-center gap-3">
            {academicMode === "assiduidade" ? (
              <>
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  id="attendance-date-picker"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white border border-slate-200 text-xs text-slate-700 py-1 px-2.5 rounded-lg outline-none"
                />
                <span className="text-[11px] text-slate-500 font-mono">Aula ordinária do dia</span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-700">Pauta de Aproveitamento Periódico</span>
              </div>
            )}
          </div>

          {/* Toast Actions Info */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 font-serif">Pauta provisória</span>
            {saveSuccess && (
              <div id="save-success-indicator" className="text-emerald-600 font-semibold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Salvo em memória!</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Tab Content lists */}
        <div id="journal-tab-content" className="p-6">
          {/* Out of scale error alert if active */}
          {showError && (
            <div id="academic-error-banner" className="mb-4 bg-red-50 border border-red-100 p-3 rounded-xl flex gap-1.5 text-red-800 text-xs items-center">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{showError}</span>
            </div>
          )}

          {academicMode === "assiduidade" ? (
            /* Assiduidade Subview */
            <div id="assiduidade-subview" className="space-y-4">
              {/* Daily Statistics Banner */}
              <div id="attendance-stats-row" className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 p-4 border border-slate-100 rounded-xl text-center">
                <div>
                  <span className="text-[11px] text-slate-400 block uppercase font-bold">Total Alunos</span>
                  <span className="text-lg font-bold text-slate-800 font-mono">{totalStudentsCount}</span>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-600 block uppercase font-bold">Presentes</span>
                  <span className="text-lg font-bold text-emerald-600 font-mono">{presentCount}</span>
                </div>
                <div>
                  <span className="text-[11px] text-red-500 block uppercase font-bold">Faltou</span>
                  <span className="text-lg font-bold text-red-500 font-mono">{absentCount}</span>
                </div>
                <div>
                  <span className="text-[11px] text-amber-500 block uppercase font-bold">F. Justificada</span>
                  <span className="text-lg font-bold text-amber-500 font-mono">{justifiedCount}</span>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                      <th className="py-2.5 px-4 w-16">Nº ID</th>
                      <th className="py-2.5 px-4">Nome do Aluno</th>
                      <th className="py-2.5 px-4 text-center w-64">Registo de Presença</th>
                      <th className="py-2.5 px-4 max-w-xs">Comentários / Ocorrências</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {localStudents.map((st) => {
                      const currentStatus = st.attendance[selectedDate] || "P";
                      return (
                        <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-400">{st.rollNo}</td>
                          <td className="py-3 px-4 font-semibold text-slate-900">{st.name}</td>
                          <td className="py-3 px-4">
                            {/* Simple segment switcher */}
                            <div className="flex items-center justify-center bg-slate-100 p-1 rounded-xl border border-slate-200/50 max-w-[220px] mx-auto">
                              <button
                                onClick={() => handleAttendanceChange(st.id, "P")}
                                className={`flex-1 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  currentStatus === "P"
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                P (Presença)
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(st.id, "F")}
                                className={`flex-1 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  currentStatus === "F"
                                    ? "bg-red-500 text-white shadow-xs"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                F (Falta)
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(st.id, "FJ")}
                                className={`flex-1 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  currentStatus === "FJ"
                                    ? "bg-amber-500 text-white shadow-xs"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                FJ (Justif.)
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={st.observations}
                              placeholder="Ocorrência habitual..."
                              onChange={(e) => handleObservationChange(st.id, e.target.value)}
                              className="w-full bg-transparent border-b border-transparent focus:border-slate-200 outline-none text-xs text-slate-600 p-1"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Lançamento de Notas Subview (0-20 scale) */
            <div id="notas-subview" className="space-y-4">
              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex gap-1.5 text-emerald-800 text-xs items-center mb-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>
                  Sistema configurado com o calendário do Ministério da Educação: Média Final = <b>(Prova 1 + Prova 2 + MAC) / 3</b>. A transição é positiva a partir de <b>10 valores</b>.
                </span>
              </div>

              {/* Grades Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-center">
                      <th className="py-2.5 px-4 w-16 text-left">Nº ID</th>
                      <th className="py-2.5 px-4 text-left">Nome do Aluno</th>
                      <th className="py-2.5 px-4 w-28">Prova 1 (P1)</th>
                      <th className="py-2.5 px-4 w-28">Prova 2 (P2)</th>
                      <th className="py-2.5 px-4 w-28">Ava. Contínua (MAC)</th>
                      <th className="py-2.5 px-4 w-28 bg-slate-55">Média Final</th>
                      <th className="py-2.5 px-4 w-32">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700 text-center">
                    {localStudents.map((st) => {
                      const isPassing = st.grades.media >= 10;
                      return (
                        <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-400 text-left">{st.rollNo}</td>
                          <td className="py-3 px-4 font-semibold text-slate-900 text-left">{st.name}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={st.grades.prova1 || ""}
                              onChange={(e) => handleGradeChange(st.id, "prova1", e.target.value)}
                              className="w-16 p-1.5 border border-slate-200 rounded text-center text-slate-800 font-semibold font-mono bg-white inline-block outline-none focus:border-emerald-500"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={st.grades.prova2 || ""}
                              onChange={(e) => handleGradeChange(st.id, "prova2", e.target.value)}
                              className="w-16 p-1.5 border border-slate-200 rounded text-center text-slate-800 font-semibold font-mono bg-white inline-block outline-none focus:border-emerald-500"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={st.grades.mac || ""}
                              onChange={(e) => handleGradeChange(st.id, "mac", e.target.value)}
                              className="w-16 p-1.5 border border-slate-200 rounded text-center text-slate-800 font-semibold font-mono bg-white inline-block outline-none focus:border-emerald-500"
                            />
                          </td>
                          <td className="py-3 px-3 bg-slate-50/40 font-mono font-bold text-slate-900 text-sm">
                            {st.grades.media.toFixed(1)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isPassing ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }`}>
                              {isPassing ? "APROVADO" : "REPROVADO"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div id="journal-footer-actions" className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              id="btn-journal-cancel"
              onClick={() => setLocalStudents(students)} // reset
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-medium transition-colors"
            >
              Restaurar Dados
            </button>
            
            <button
              id="btn-journal-submit"
              onClick={handleSaveAll}
              className="px-5 py-2 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Gravar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
