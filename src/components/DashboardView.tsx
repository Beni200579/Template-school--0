import { ActiveTab, Candidate, Student, Invoice, ReceiptValidation, FeeSettings } from "../types";
import {
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  ReceiptText,
  Users,
} from "lucide-react";

interface DashboardViewProps {
  candidates: Candidate[];
  students: Student[];
  invoices: Invoice[];
  receipts: ReceiptValidation[];
  feeSettings: FeeSettings;
  onNavigate: (tab: ActiveTab) => void;
}

const formatKwanza = (value: number) =>
  new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 2,
  })
    .format(value)
    .replace("Kz", "")
    .trim() + " Kz";

export default function DashboardView({
  candidates,
  students,
  invoices,
  receipts,
  feeSettings,
  onNavigate,
}: DashboardViewProps) {
  const matriculatedCandidates = candidates.filter((candidate) => candidate.status === "matriculado").length;
  const totalStudents = students.length + matriculatedCandidates;
  const pendingReceiptsCount = receipts.filter((receipt) => receipt.status === "PENDEN_VALIDACAO").length;
  const pendingInvoices = invoices.filter((invoice) => invoice.status === "PENDENTE").length;
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "ATRASADO").length;
  const admittedCandidates = candidates.filter((candidate) => candidate.status === "admitido").length;

  const totalCollected = invoices
    .filter((invoice) => invoice.status === "PAGO")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalOverdue = invoices
    .filter((invoice) => invoice.status === "ATRASADO")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const attendanceEntries = students.flatMap((student) => Object.values(student.attendance));
  const presentEntries = attendanceEntries.filter((entry) => entry === "P").length;
  const attendanceRate = attendanceEntries.length > 0 ? Math.round((presentEntries / attendanceEntries.length) * 1000) / 10 : 0;

  const collectionsData = ["Jan", "Fev", "Mar", "Abr", "Mai"].map((month) => ({
    month,
    collected: 0,
    target: 0,
  }));

  const maxChartValue = Math.max(...collectionsData.flatMap((item) => [item.collected, item.target]), 1);
  const paymentTotal = totalCollected + totalOverdue;
  const paymentProgress = paymentTotal > 0 ? Math.min(100, Math.round((totalCollected / paymentTotal) * 100)) : 0;

  const summaryCards = [
    {
      label: "Alunos ativos",
      value: totalStudents.toString(),
      detail: totalStudents > 0 ? "Registos ativos no sistema" : "Sem alunos registados",
      icon: Users,
      tone: "text-slate-900",
    },
    {
      label: "Presença semanal",
      value: `${attendanceRate}%`,
      detail: attendanceEntries.length > 0 ? "Média registada no complexo" : "Sem registos de presença",
      icon: ClipboardCheck,
      tone: "text-emerald-700",
    },
    {
      label: "Propinas recebidas",
      value: formatKwanza(totalCollected),
      detail: totalCollected > 0 ? "Pagamentos confirmados" : "Sem pagamentos confirmados",
      icon: Banknote,
      tone: "text-slate-900",
    },
    {
      label: "Validação pendente",
      value: pendingReceiptsCount.toString(),
      detail: pendingReceiptsCount > 0 ? "Comprovativos na fila financeira" : "Sem comprovativos pendentes",
      icon: ReceiptText,
      tone: pendingReceiptsCount > 0 ? "text-amber-600" : "text-slate-900",
    },
  ];

  return (
    <div id="dash-view-container" className="space-y-7">
      <section id="operations-header" className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="p-7 lg:p-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-100">
                Secretaria
              </span>
              <span className="font-medium text-slate-700">Instituição não configurada</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
              <span>Localização não definida</span>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-end">
              <div>
                <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-slate-950">
                  Quadro diário de gestão escolar
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  O painel começa limpo e passa a refletir apenas os dados registados no sistema.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                  <CalendarDays className="h-4 w-4 text-emerald-700" />
                  Ano letivo
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-950">Não definido</p>
                <p className="mt-1 text-xs text-slate-500">Configure os dados da escola</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-950 p-7 text-white lg:border-l lg:border-t-0 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Fecho financeiro do mês</p>
                <div className="mt-5 flex items-end gap-3">
                  <p className="text-4xl font-semibold tracking-tight">{paymentProgress}%</p>
                  <p className="pb-1 text-xs text-slate-400">liquidação confirmada</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(ActiveTab.FINANCEIRO)}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
              >
                Finanças
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-6">
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${paymentProgress}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500">Recebido</p>
                  <p className="mt-1 font-semibold text-slate-200">{formatKwanza(totalCollected)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Por regularizar</p>
                  <p className="mt-1 font-semibold text-slate-200">{formatKwanza(totalOverdue)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="dash-stats-grid" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="min-h-[142px] rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-bold uppercase text-slate-500">{card.label}</p>
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
              <p className={`mt-4 break-words text-2xl font-bold tracking-tight ${card.tone}`}>{card.value}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{card.detail}</p>
            </div>
          );
        })}
      </section>

      <section id="dash-details-grid" className="grid grid-cols-1 gap-7 xl:grid-cols-[1fr_360px]">
        <div id="dash-chart-panel" className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-950">Arrecadação mensal</h3>
              <p className="mt-1 text-xs text-slate-500">Aparece automaticamente quando houver pagamentos registados.</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 bg-slate-300" />
                Previsto
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 bg-emerald-700" />
                Confirmado
              </span>
            </div>
          </div>

          <div className="mt-5 grid min-h-[260px] grid-cols-[48px_1fr] gap-4">
            <div className="flex flex-col justify-between py-1 text-right text-[11px] text-slate-400">
              <span>16M</span>
              <span>12M</span>
              <span>8M</span>
              <span>4M</span>
              <span>0</span>
            </div>
            <div className="relative flex items-end justify-between gap-4 border-l border-b border-slate-200 px-3 pt-4">
              <div className="pointer-events-none absolute inset-x-3 top-4 h-px bg-slate-100" />
              <div className="pointer-events-none absolute inset-x-3 top-[31%] h-px bg-slate-100" />
              <div className="pointer-events-none absolute inset-x-3 top-[58%] h-px bg-slate-100" />
              {collectionsData.map((item) => {
                const targetHeight = Math.min(100, (item.target / maxChartValue) * 100);
                const collectedHeight = Math.min(100, (item.collected / maxChartValue) * 100);

                return (
                  <div key={item.month} className="group flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-52 w-full items-end justify-center gap-1.5">
                      <div className="w-3 bg-slate-300" style={{ height: `${targetHeight}%` }} />
                      <div className="relative w-5 bg-emerald-700 transition hover:bg-emerald-600" style={{ height: `${collectedHeight}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside id="dash-action-panel" className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
              <h3 className="text-base font-bold text-slate-950">Despachos de hoje</h3>
              <p className="mt-1 text-xs text-slate-500">Itens que precisam de decisão da secretaria.</p>
            </div>
            <div className="divide-y divide-slate-200">
              <button
                type="button"
                onClick={() => onNavigate(ActiveTab.FINANCEIRO)}
                className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-slate-50"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
                <span>
                  <span className="block text-sm font-bold text-slate-950">Validar comprovativos</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {pendingReceiptsCount} carregamento(s) aguardam confirmação bancária.
                  </span>
                </span>
              </button>
              <div className="flex items-start gap-3 p-4">
                <Clock3 className="mt-0.5 h-5 w-5 text-rose-600" />
                <div>
                  <p className="text-sm font-bold text-slate-950">Propinas vencidas</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {overdueInvoices} fatura(s) em atraso e {pendingInvoices} pendente(s) de pagamento.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
                <div>
                  <p className="text-sm font-bold text-slate-950">Matrículas prontas</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {admittedCandidates} candidato(s) admitido(s) podem seguir para matrícula.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 text-slate-500" />
              <div>
                <h4 className="text-sm font-bold text-slate-950">Nota administrativa</h4>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Configure os valores de propina, contas bancárias e dados fiscais antes de iniciar a operação.
                </p>
                <p className="mt-3 text-[11px] font-semibold text-slate-400">
                  Propina base: {formatKwanza(feeSettings.tuitionFee)}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
