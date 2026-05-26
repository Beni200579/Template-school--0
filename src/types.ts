export enum ActiveTab {
  DASHBOARD = "dashboard",
  MATRICULAS = "matriculas",
  SERVICOS = "servicos",
  FINANCEIRO = "financeiro",
  CONFIGURACOES = "configuracoes",
  PERFIL = "perfil",
}

export type StudentSection = "confirmacao" | "matricula" | "inscricao";

export type AngolanSchoolLevel =
  | "Ensino Primário"
  | "I Ciclo (7.ª-9.ª Classe)"
  | "II Ciclo - PUNIV"
  | "II Ciclo - Técnico-Profissional";

export interface Candidate {
  id: string;
  name: string;
  level: AngolanSchoolLevel;
  className: string;
  registrationDate: string;
  status: "registado" | "avaliacao" | "admitido" | "matriculado" | "rejeitado";
  documentsCount: number;
  totalDocumentsNeeded: number;
  paymentPending: boolean;
  avatarInitials: string;
  documents?: {
    certidaoNascimento: boolean;
    fotos: boolean;
    historicoEscolar: boolean;
    declaracao: boolean;
  };
  observations?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  attendance: { [date: string]: "P" | "F" | "FJ" };
  grades: {
    prova1: number;
    prova2: number;
    mac: number;
    media: number;
  };
  observations: string;
}

export interface Invoice {
  id: string;
  studentName: string;
  studentClass: string;
  reference: string;
  rupe?: string;
  dueDate: string;
  amount: number;
  status: "PAGO" | "PENDENTE" | "ATRASADO" | "EM_ANALISE";
  paymentMethod?: "Multicaixa Express" | "Transferência Bancária" | "RUPE" | "Depósito";
  receiptUploaded?: boolean;
  receiptDetails?: string;
  receiptFile?: string;
}

export interface ReceiptValidation {
  id: string;
  invoiceId: string;
  studentName: string;
  amount: number;
  paymentMethod: "Transferência Bancária" | "Multicaixa Express" | "RUPE";
  senderName: string;
  ibanOrPhone: string;
  bankName?: string;
  date: string;
  filePath: string;
  status: "PENDEN_VALIDACAO" | "CONFIRMADO" | "REJEITADO";
  rejectionReason?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  ownerName: string;
}

export interface FeeSettings {
  tuitionFee: number;
  transportFee: number;
  mealFee: number;
  lateFeePercentage: number;
}
