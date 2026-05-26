import { FormEvent, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AngolanSchoolLevel, Candidate, StudentSection } from "../types";
import { 
  CheckCircle2, 
  ClipboardCheck, 
  FileText, 
  Search, 
  UserPlus, 
  XCircle, 
  Clock, 
  Info,
  Calendar,
  User,
  Edit,
  Trash2
} from "lucide-react";

interface MatriculasViewProps {
  section: StudentSection;
  candidates: Candidate[];
  onAddCandidate: (candidate: Omit<Candidate, "id">) => void;
  onUpdateCandidateStatus: (id: string, newStatus: Candidate["status"]) => void;
  onTriggerInvoicing: (candidate: Candidate) => void;
}

const sectionCopy = {
  inscricao: {
    eyebrow: "Alunos / Inscrição",
    title: "Inscrição de candidatos",
    description: "Registe novos candidatos e acompanhe as fichas que ainda estão em entrada administrativa.",
  },
  confirmacao: {
    eyebrow: "Alunos / Confirmação",
    title: "Confirmação de documentos",
    description: "Valide processos, documentos entregues e dados escolares antes da admissão.",
  },
  matricula: {
    eyebrow: "Alunos / Matrícula",
    title: "Matrícula final",
    description: "Finalize a matrícula dos candidatos admitidos e acompanhe os alunos já matriculados.",
  },
};

export default function MatriculasView({
  section,
  candidates,
  onAddCandidate,
  onUpdateCandidateStatus,
  onTriggerInvoicing,
}: MatriculasViewProps) {
  const [showAddModal, setShowAddModal] = useState(section === "inscricao" && candidates.length === 0);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [newFormName, setNewFormName] = useState("");
  const [newFormLevel, setNewFormLevel] = useState<AngolanSchoolLevel>("I Ciclo (7.ª-9.ª Classe)");
  const [newFormClass, setNewFormClass] = useState("7.ª Classe - Turma A");
  const [newDocsCount, setNewDocsCount] = useState<number>(3);

  const filteredCandidates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return candidates.filter((candidate) => {
      const matchesSection =
        section === "inscricao"
          ? candidate.status === "registado"
          : section === "confirmacao"
            ? candidate.status === "registado" || candidate.status === "avaliacao"
            : candidate.status === "admitido" || candidate.status === "matriculado";

      if (!matchesSection) return false;
      if (!query) return true;

      return (
        candidate.name.toLowerCase().includes(query) ||
        candidate.className.toLowerCase().includes(query) ||
        candidate.level.toLowerCase().includes(query)
      );
    });
  }, [candidates, searchQuery, section]);

  const stats = [
    { label: "Inscrições", value: candidates.filter((candidate) => candidate.status === "registado").length },
    { label: "Em confirmação", value: candidates.filter((candidate) => candidate.status === "avaliacao").length },
    { label: "Admitidos", value: candidates.filter((candidate) => candidate.status === "admitido").length },
    { label: "Matriculados", value: candidates.filter((candidate) => candidate.status === "matriculado").length },
  ];

  const handleSubmitCandidate = (event: FormEvent) => {
    event.preventDefault();
    if (!newFormName.trim()) return;

    onAddCandidate({
      name: newFormName.trim(),
      level: newFormLevel,
      className: newFormClass,
      registrationDate: new Date().toISOString().split("T")[0],
      status: "registado",
      documentsCount: Number(newDocsCount),
      totalDocumentsNeeded: 4,
      paymentPending: newFormLevel !== "Ensino Primário",
      avatarInitials:
        newFormName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((name) => name[0])
          .join("")
          .toUpperCase() || "AL",
    });

    setNewFormName("");
    setNewDocsCount(3);
    setShowAddModal(false);
  };

  const confirmDocuments = (candidate: Candidate) => {
    onUpdateCandidateStatus(candidate.id, candidate.status === "registado" ? "avaliacao" : "admitido");
    if (candidate.status === "avaliacao") {
      onTriggerInvoicing(candidate);
    }
  };

  const finishEnrollment = (candidate: Candidate) => {
    onUpdateCandidateStatus(candidate.id, "matriculado");
  };

  return (
    <div id="students-panel" className="space-y-7">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-700">{sectionCopy[section].eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{sectionCopy[section].title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{sectionCopy[section].description}</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar aluno ou classe"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
              />
            </div>

            {section === "inscricao" && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <UserPlus className="h-4 w-4" />
                Nova inscrição
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase text-slate-500">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-base font-semibold text-slate-950">
            {section === "inscricao" && "Fichas de inscrição"}
            {section === "confirmacao" && "Processos para confirmação"}
            {section === "matricula" && "Processos de matrícula"}
          </h3>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredCandidates.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">Nenhum processo encontrado nesta página.</div>
          ) : (
              filteredCandidates.map((candidate) => (
              <div key={candidate.id}>
                <CandidateRow
                  candidate={candidate}
                  section={section}
                  onConfirmDocuments={confirmDocuments}
                  onFinishEnrollment={finishEnrollment}
                  onSelectCandidate={setSelectedCandidate}
                />
              </div>
            ))
          )}
        </div>
      </section>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Nova inscrição</h3>
                <p className="mt-1 text-sm text-slate-500">Preencha os dados básicos do candidato.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-md px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleSubmitCandidate} className="mt-6 space-y-4 text-sm">
              <Field label="Nome completo">
                <input
                  type="text"
                  required
                  value={newFormName}
                  onChange={(event) => setNewFormName(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nível de ensino">
                  <select
                    value={newFormLevel}
                    onChange={(event) => {
                      const level = event.target.value as AngolanSchoolLevel;
                      setNewFormLevel(level);
                      if (level === "Ensino Primário") setNewFormClass("4.ª Classe - Turma B");
                      else if (level === "I Ciclo (7.ª-9.ª Classe)") setNewFormClass("8.ª Classe - Turma A");
                      else if (level === "II Ciclo - PUNIV") setNewFormClass("10.ª Classe - PUNIV");
                      else setNewFormClass("11.ª Classe - Técnico de Informática");
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500"
                  >
                    <option value="Ensino Primário">Ensino Primário</option>
                    <option value="I Ciclo (7.ª-9.ª Classe)">I Ciclo (7.ª-9.ª Classe)</option>
                    <option value="II Ciclo - PUNIV">II Ciclo - PUNIV</option>
                    <option value="II Ciclo - Técnico-Profissional">II Ciclo - Técnico-Profissional</option>
                  </select>
                </Field>

                <Field label="Classe e turma">
                  <input
                    type="text"
                    required
                    value={newFormClass}
                    onChange={(event) => setNewFormClass(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500"
                  />
                </Field>
              </div>

              <Field label="Documentos entregues">
                <select
                  value={newDocsCount}
                  onChange={(event) => setNewDocsCount(Number(event.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500"
                >
                  <option value={1}>1 de 4 documentos</option>
                  <option value={2}>2 de 4 documentos</option>
                  <option value={3}>3 de 4 documentos</option>
                  <option value={4}>4 de 4 documentos</option>
                </select>
              </Field>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
                  Guardar inscrição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCandidate && (
        <CandidateDetailsModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onUpdateStatus={onUpdateCandidateStatus}
        />
      )}
    </div>
  );
}

function CandidateRow({
  candidate,
  section,
  onConfirmDocuments,
  onFinishEnrollment,
  onSelectCandidate,
}: {
  candidate: Candidate;
  section: StudentSection;
  onConfirmDocuments: (candidate: Candidate) => void;
  onFinishEnrollment: (candidate: Candidate) => void;
  onSelectCandidate: (candidate: Candidate) => void;
}) {
  return (
    <div 
      className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between cursor-pointer hover:bg-slate-50 transition"
      onClick={() => onSelectCandidate(candidate)}
    >
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
          {candidate.avatarInitials}
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-slate-950">{candidate.name}</h4>
          <p className="mt-1 text-xs text-slate-500">
            {candidate.className} · {candidate.level}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-slate-600">
              <FileText className="h-3.5 w-3.5" />
              {candidate.documentsCount}/{candidate.totalDocumentsNeeded} documentos
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">Registo: {candidate.registrationDate}</span>
            <StatusBadge status={candidate.status} />
          </div>
        </div>
      </div>

       <div className="flex shrink-0 justify-end gap-2">
         {section === "confirmacao" && candidate.status !== "admitido" && (
           <button
             type="button"
             onClick={() => onConfirmDocuments(candidate)}
             className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
           >
             <ClipboardCheck className="h-4 w-4" />
             {candidate.status === "registado" ? "Enviar para confirmação" : "Confirmar documentos"}
           </button>
         )}

         {section === "matricula" && candidate.status === "admitido" && (
           <button
             type="button"
             onClick={() => onFinishEnrollment(candidate)}
             className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
           >
             <CheckCircle2 className="h-4 w-4" />
             Matricular aluno
           </button>
         )}

         {/* Edit and Delete buttons for all sections */}
         <button
           type="button"
           onClick={() => {
             // Open the details modal for editing
             onSelectCandidate(candidate);
           }}
           className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
         >
           <Edit className="h-4 w-4" />
         </button>
         <button
           type="button"
           onClick={() => {
             // Delete the candidate
             onUpdateCandidateStatus(candidate.id, "rejeitado");
           }}
           className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
         >
           <Trash2 className="h-4 w-4" />
         </button>
       </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Candidate["status"] }) {
  const labels = {
    registado: "Inscrito",
    avaliacao: "Em confirmação",
    admitido: "Admitido",
    matriculado: "Matriculado",
    rejeitado: "Rejeitado",
  };

  const colors = {
    registado: "bg-slate-100 text-slate-700",
    avaliacao: "bg-amber-100 text-amber-700",
    admitido: "bg-blue-100 text-blue-700",
    matriculado: "bg-emerald-100 text-emerald-700",
    rejeitado: "bg-red-100 text-red-700",
  };

  return <span className={`rounded-md px-2 py-1 font-medium ${colors[status]}`}>{labels[status]}</span>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function CandidateDetailsModal({
  candidate,
  onClose,
  onUpdateStatus,
}: {
  candidate: Candidate;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Candidate["status"]) => void;
}) {
  const [observations, setObservations] = useState(candidate.observations || "");
  const [documents, setDocuments] = useState(candidate.documents || {
    certidaoNascimento: false,
    fotos: false,
    historicoEscolar: false,
    declaracao: false,
  });

  const toggleDocument = (key: keyof typeof documents) => {
    setDocuments(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-bold text-emerald-700 shadow-inner">
              {candidate.avatarInitials}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-950">{candidate.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={candidate.status} />
                <span className="text-sm text-slate-500">• {candidate.level}</span>
                <span className="text-sm text-slate-500">• {candidate.className}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto">
          
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider text-slate-500">Dados do Candidato</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Data de Inscrição</p>
                  <p className="font-medium text-slate-950">{candidate.registrationDate}</p>
                </div>
                <div>
                  <p className="text-slate-500">Turma Designada</p>
                  <p className="font-medium text-slate-950">{candidate.className}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-600" /> Observações Internas
              </h4>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                rows={4}
                placeholder="Adicionar observações sobre a candidatura..."
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" /> Documentação
            </h4>
            <div className="space-y-3">
              {[
                { key: 'certidaoNascimento', label: 'Certidão de Nascimento' },
                { key: 'fotos', label: 'Fotos (Tipo Passe)' },
                { key: 'historicoEscolar', label: 'Histórico Escolar' },
                { key: 'declaracao', label: 'Declaração' },
              ].map((doc) => (
                <label key={doc.key} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={documents[doc.key as keyof typeof documents]}
                    onChange={() => toggleDocument(doc.key as keyof typeof documents)}
                    className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition" 
                  />
                  <span className="group-hover:text-slate-950">{doc.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Cancelar
          </button>
          {candidate.status !== "rejeitado" && (
            <button
              onClick={() => onUpdateStatus(candidate.id, "rejeitado")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 transition"
            >
              Rejeitar Candidatura
            </button>
          )}
          {candidate.status === "registado" && (
            <button
              onClick={() => onUpdateStatus(candidate.id, "avaliacao")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition"
            >
              Enviar para Confirmação
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

