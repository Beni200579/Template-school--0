import { Candidate, Student, Invoice, ReceiptValidation, BankAccount, FeeSettings } from "./types";

export const INITIAL_CANDIDATES: Candidate[] = [];

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_RECEIPTS: ReceiptValidation[] = [];

export const INITIAL_BANKS: BankAccount[] = [];

export const INITIAL_FEE_SETTINGS: FeeSettings = {
  tuitionFee: 0,
  transportFee: 0,
  mealFee: 0,
  lateFeePercentage: 0,
};

export const ANGOLAN_BANKS_LIST = [
  "Banco Angolano de Investimentos (BAI)",
  "Banco de Fomento Angola (BFA)",
  "Banco BIC",
  "Banco de Poupança e Crédito (BPC)",
  "Banco SOL",
  "Banco KEVE",
  "Banco de Negócios Internacional (BNI)",
  "Standard Bank Angola (SBA)",
  "Banco Caixa Geral Angola (BCGA)",
];
