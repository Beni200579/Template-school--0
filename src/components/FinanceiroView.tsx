import { ChangeEvent, DragEvent, FormEvent, ReactNode, useRef, useState } from "react";
import { BankAccount, Candidate, FeeSettings, Invoice, ReceiptValidation } from "../types";
import { ANGOLAN_BANKS_LIST } from "../mockData";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileText,
  ListFilter,
  ReceiptText,
  Send,
  Settings,
  ShieldCheck,
  Upload,
  XCircle,
  Download,
} from "lucide-react";

interface FinanceiroViewProps {
  invoices: Invoice[];
  receipts: ReceiptValidation[];
  bankAccounts: BankAccount[];
  feeSettings: FeeSettings;
  candidates: Candidate[];
  onValidateReceipt: (id: string, approve: boolean, reason?: string) => void;
  onSubmitNewReceipt: (receipt: Omit<ReceiptValidation, "id" | "status">) => void;
  onSimulateExpressPayment: (invoiceId: string, phone: string) => void;
  onUpdateFees: (fees: FeeSettings) => void;
}

type FinanceModule = "comprovativos" | "faturas" | "express" | "taxas";

const tabs: { id: FinanceModule; label: string }[] = [
  { id: "comprovativos", label: "Comprovativos" },
  { id: "faturas", label: "Faturas" },
  { id: "express", label: "Multicaixa" },
  { id: "taxas", label: "Taxas" },
];

const formatKwanza = (value: number) =>
  new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", minimumFractionDigits: 2 })
    .format(value).replace("Kz", "").trim() + " Kz";

export default function FinanceiroView({
  invoices, receipts, bankAccounts, feeSettings, candidates,
  onValidateReceipt, onSubmitNewReceipt, onSimulateExpressPayment, onUpdateFees,
}: FinanceiroViewProps) {
  const [module, setModule] = useState<FinanceModule>("comprovativos");
  const [invoiceFilter, setInvoiceFilter] = useState<string>("all");
  const [selectedReceiptInvoice, setSelectedReceiptInvoice] = useState("");
  const [receiptSender, setReceiptSender] = useState("");
  const [receiptIban, setReceiptIban] = useState("");
  const [receiptBank, setReceiptBank] = useState(ANGOLAN_BANKS_LIST[0] ?? "");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedExpressInvoice, setSelectedExpressInvoice] = useState("");
  const [expressPhone, setExpressPhone] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [localTuition, setLocalTuition] = useState(String(feeSettings.tuitionFee));
  const [localTransport, setLocalTransport] = useState(String(feeSettings.transportFee));
  const [localMeal, setLocalMeal] = useState(String(feeSettings.mealFee));
  const [localLatePct, setLocalLatePct] = useState(String(feeSettings.lateFeePercentage));
  const [feeSaveSuccess, setFeeSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pendingReceipts = receipts.filter((r) => r.status === "PENDEN_VALIDACAO");
  const filteredInvoices = invoices.filter((i) => invoiceFilter === "all" || i.status === invoiceFilter);
  const unpaidInvoices = invoices.filter((i) => i.status !== "PAGO");
  const totalPending = invoices.filter((i) => i.status === "PENDENTE" || i.status === "ATRASADO").reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter((i) => i.status === "PAGO").reduce((sum, i) => sum + i.amount, 0);

  const handleManualReceiptSubmit = (e: FormEvent) => {
    e.preventDefault();
    const invoice = invoices.find((i) => i.id === selectedReceiptInvoice);
    if (!invoice || !receiptSender.trim()) return;
    onSubmitNewReceipt({
      invoiceId: invoice.id,
      studentName: invoice.studentName,
      amount: invoice.amount,
      paymentMethod: "Transferência Bancária",
      senderName: receiptSender.trim(),
      ibanOrPhone: receiptIban,
      bankName: receiptBank,
      date: new Date().toISOString().split("T")[0],
      filePath: selectedFileName || "comprovativo.pdf",
    });
    setSelectedReceiptInvoice(""); setReceiptSender(""); setReceiptIban(""); setSelectedFileName("");
  };

  const handleGenerateReport = () => { alert("A gerar relatório financeiro..."); };

  return (
    <div id="finance-panel" className="space-y-7">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-700">Financeiro</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Caixa Escolar</h2>
          </div>
          <button onClick={handleGenerateReport} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            <Download className="h-4 w-4" /> Exportar Relatório
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mt-7">
          <Metric label="A receber" value={formatKwanza(totalPending)} />
          <Metric label="Recebido" value={formatKwanza(totalPaid)} />
          <Metric label="Comprovativos" value={pendingReceipts.length.toString()} />
          <Metric label="Candidatos" value={candidates.length.toString()} />
        </div>
      </section>

      <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setModule(tab.id)} className={`rounded-md px-4 py-2 text-sm font-semibold transition ${module === tab.id ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="p-6">
          {module === "faturas" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Aluno</th>
                    <th className="px-6 py-3 font-semibold">Referência</th>
                    <th className="px-6 py-3 font-semibold">Vencimento</th>
                    <th className="px-6 py-3 text-right font-semibold">Valor</th>
                    <th className="px-6 py-3 text-center font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="px-6 py-4 font-medium text-slate-950">{inv.studentName}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{inv.reference}</td>
                      <td className="px-6 py-4 text-slate-600">{inv.dueDate}</td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-950">{formatKwanza(inv.amount)}</td>
                      <td className="px-6 py-4 text-center"><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {module !== "faturas" && <p className="text-center text-slate-500">Módulo em desenvolvimento.</p>}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { PAGO: "bg-emerald-50 text-emerald-700", PENDENTE: "bg-blue-50 text-blue-700", ATRASADO: "bg-red-50 text-red-700" };
  return <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${styles[status] || "bg-slate-100"}`}>{status}</span>;
}
