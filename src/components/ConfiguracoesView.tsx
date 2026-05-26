import { useState, FormEvent } from "react";
import { BankAccount } from "../types";
import { 
  Building2, 
  MapPin, 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Notebook
} from "lucide-react";

interface ConfiguracoesViewProps {
  bankAccounts: BankAccount[];
  onUpdateBankAccounts: (accounts: BankAccount[]) => void;
}

export default function ConfiguracoesView({
  bankAccounts,
  onUpdateBankAccounts
}: ConfiguracoesViewProps) {
  
  // School parameters
  const [shName, setShName] = useState("");
  const [shNif, setShNif] = useState("");
  const [shProvince, setShProvince] = useState("");
  const [shMunicipality, setShMunicipality] = useState("");
  const [shEmail, setShEmail] = useState("");
  const [shPhone, setShPhone] = useState("");

  // Bank Form State
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBankName, setNewBankName] = useState("Banco de Poupança e Crédito (BPC)");
  const [newAccNum, setNewAccNum] = useState("");
  const [newIban, setNewIban] = useState("");

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddBankAccount = (e: FormEvent) => {
    e.preventDefault();
    if (!newAccNum || !newIban) return;

    const newAcc: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: newBankName,
      accountNumber: newAccNum,
      iban: newIban,
      ownerName: shName || "Instituição não configurada"
    };

    onUpdateBankAccounts([...bankAccounts, newAcc]);
    setNewAccNum("");
    setNewIban("");
    setShowAddBank(false);
    alert("Conta Bancária institucional integrada no sistema com sucesso!");
  };

  const handleDeleteBank = (id: string) => {
    if (confirm("Deseja realmente remover esta conta bancária de recebimento?")) {
      const filtered = bankAccounts.filter(b => b.id !== id);
      onUpdateBankAccounts(filtered);
    }
  };

  const handleSaveSchoolInfo = (e: FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div id="settings-panel" className="space-y-8">
      <div id="settings-heading">
        <h2 id="settings-title" className="font-sans font-bold text-xl text-slate-800">
          Configurações de Sistema 
        </h2>
        <p id="settings-desc" className="text-xs text-slate-500">
          Gerencie a identidade fiscal da escola, provincia/municipio, e coordene as contas para liquidação de propinas.
        </p>
      </div>

      <div id="settings-grid" className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left column: School Identity */}
        <div className="space-y-7 rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-sans font-bold text-slate-800 text-base">Identidade e Dados de Facturação</h3>
          </div>

          <form onSubmit={handleSaveSchoolInfo} className="space-y-5 text-xs text-slate-700">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">Denominação Institucional</label>
                <input
                  type="text"
                  required
                  value={shName}
                  onChange={(e) => setShName(e.target.value)}
                  className="w-full p-2.5 bg-white border rounded-xl outline-none text-slate-800 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">NIF Escolar (Angola)</label>
                <input
                  type="text"
                  required
                  value={shNif}
                  onChange={(e) => setShNif(e.target.value)}
                  className="w-full p-2.5 bg-white border rounded-xl outline-none font-mono font-bold text-slate-800 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">Província</label>
                <select 
                  value={shProvince}
                  onChange={(e) => setShProvince(e.target.value)}
                  className="w-full p-2.5 bg-white border rounded-xl outline-none"
                >
                  <option value="Bengo">Bengo</option>
                  <option value="Luanda">Luanda</option>
                  <option value="Benguela">Benguela</option>
                  <option value="Huambo">Huambo</option>
                  <option value="Cabinda">Cabinda</option>
                  <option value="Huíla">Huíla</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">Município</label>
                <input
                  type="text"
                  required
                  value={shMunicipality}
                  onChange={(e) => setShMunicipality(e.target.value)}
                  className="w-full p-2.5 bg-white border rounded-xl outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">WhatsApp de Contacto da Secretaria</label>
                <input
                  type="text"
                  value={shPhone}
                  onChange={(e) => setShPhone(e.target.value)}
                  className="w-full p-2.5 bg-white border rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">E-mail Comercial</label>
                <input
                  type="email"
                  value={shEmail}
                  onChange={(e) => setShEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border rounded-xl outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 items-center">
              {saveSuccess && (
                <span className="text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1">
                  ✓ Ficha fiscal escolar guardada em memória!
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Atualizar Identidade
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Bank accounts details */}
        <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-sans font-bold text-slate-800 text-base">Contas Escolares</h3>
            </div>
            
            <button
              onClick={() => setShowAddBank(!showAddBank)}
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova</span>
            </button>
          </div>

          {/* Inline Form to Add Bank */}
          {showAddBank && (
            <form onSubmit={handleAddBankAccount} className="bg-slate-50 border p-4 rounded-xl space-y-3 text-xs leading-normal">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">Banco Oficial</label>
                <select
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="w-full p-2 bg-white border rounded-lg text-xs"
                >
                  <option value="Banco Angolano de Investimentos (BAI)">BAI</option>
                  <option value="Banco de Fomento Angola (BFA)">BFA</option>
                  <option value="Banco BIC">Banco BIC</option>
                  <option value="Banco de Poupança e Crédito (BPC)">BPC</option>
                  <option value="Banco SOL">Banco SOL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block">Nº Conta Escolar</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 5129381-10"
                  value={newAccNum}
                  onChange={(e) => setNewAccNum(e.target.value)}
                  className="w-full p-2 bg-white border rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block text-slate-700">Iban Escolar Completo</label>
                <input
                  type="text"
                  required
                  value={newIban}
                  onChange={(e) => setNewIban(e.target.value)}
                  className="w-full p-2 bg-white border rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBank(false)}
                  className="px-3 py-1 bg-slate-200 text-slate-600 font-semibold rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-emerald-600 text-white font-bold rounded-lg"
                >
                  Integrar
                </button>
              </div>
            </form>
          )}

          {/* Active bank accounts cards list */}
          <div id="school-banks-list" className="space-y-4">
            {bankAccounts.map((b) => (
              <div 
                key={b.id} 
                id={`school-bank-item-${b.id}`}
                className="group relative rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <button
                  id={`btn-del-bank-${b.id}`}
                  onClick={() => handleDeleteBank(b.id)}
                  className="absolute top-3 right-3 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar Conta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <h4 className="font-sans font-bold text-slate-900 text-xs">
                  {b.bankName}
                </h4>
                <div className="text-[11px] text-slate-500 font-mono mt-1 space-y-0.5 leading-snug">
                  <p><b>Nº Conta:</b> {b.accountNumber}</p>
                  <p className="font-semibold text-slate-700"><b>IBAN:</b> {b.iban}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ministry instructions warnings block */}
          <div id="ministry-footer-block" className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 text-[11px] text-slate-500 flex gap-2">
            <Notebook className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p>Os dados bancários cadastrados acima são injetados automaticamente nas faturas e são legíveis pelo simulador de pagamentos integrados de Angola.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
