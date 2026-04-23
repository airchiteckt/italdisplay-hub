export type DealStage = "nuovo" | "qualificato" | "trattativa" | "chiuso_vinto" | "chiuso_perso";

export const STAGE_LABELS: Record<DealStage, string> = {
  nuovo: "Nuovo",
  qualificato: "Qualificato",
  trattativa: "Trattativa",
  chiuso_vinto: "Chiuso / Vinto",
  chiuso_perso: "Chiuso / Perso",
};

export interface Deal {
  id: string;
  title: string;
  customer: string;
  value: number;
  stage: DealStage;
  owner: string;
  ownerInitials: string;
  probability: number;
  nextAction: string;
  lastActivity: string;
  daysInStage: number;
  aiPriority: "alta" | "media" | "bassa";
  aiReason: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
}

export const DEALS: Deal[] = [
  {
    id: "D-1042",
    title: "Totem digitali - Catena retail nord",
    customer: "Coop Lombardia",
    value: 48500,
    stage: "trattativa",
    owner: "Giulia Bianchi",
    ownerInitials: "GB",
    probability: 70,
    nextAction: "Inviare preventivo revisionato",
    lastActivity: "Chiamata 2 ore fa",
    daysInStage: 4,
    aiPriority: "alta",
    aiReason: "Cliente caldo, sentito 3 volte questa settimana. Richiede preventivo entro 48h.",
    contact: "Andrea Conti",
    phone: "+39 02 1234567",
    email: "a.conti@coop.it",
    city: "Milano",
  },
  {
    id: "D-1041",
    title: "Insegne luminose nuovo punto vendita",
    customer: "Esselunga",
    value: 22300,
    stage: "qualificato",
    owner: "Giulia Bianchi",
    ownerInitials: "GB",
    probability: 45,
    nextAction: "Sopralluogo tecnico",
    lastActivity: "Email ieri",
    daysInStage: 6,
    aiPriority: "alta",
    aiReason: "Decisione attesa entro fine mese. Concorrente attivo.",
    contact: "Marta Galli",
    phone: "+39 02 9988776",
    email: "m.galli@esselunga.it",
    city: "Milano",
  },
  {
    id: "D-1040",
    title: "Display LED stadio",
    customer: "FC Verona",
    value: 125000,
    stage: "trattativa",
    owner: "Luca Verdi",
    ownerInitials: "LV",
    probability: 60,
    nextAction: "Riunione tecnica giovedì",
    lastActivity: "Riunione 1 giorno fa",
    daysInStage: 12,
    aiPriority: "alta",
    aiReason: "Affare di valore alto in stallo da 12 giorni. Servirebbe sblocco operativo.",
    contact: "Roberto Mazza",
    phone: "+39 045 778899",
    email: "r.mazza@fcverona.it",
    city: "Verona",
  },
  {
    id: "D-1039",
    title: "Tabelle informative aeroporto",
    customer: "SEA Aeroporti",
    value: 67800,
    stage: "qualificato",
    owner: "Luca Verdi",
    ownerInitials: "LV",
    probability: 40,
    nextAction: "Approfondire requisiti tecnici",
    lastActivity: "Email 3 giorni fa",
    daysInStage: 9,
    aiPriority: "media",
    aiReason: "Buon potenziale ma timing incerto. Da rilanciare.",
    contact: "Elena Ferri",
    phone: "+39 02 74852000",
    email: "e.ferri@seamilano.eu",
    city: "Milano",
  },
  {
    id: "D-1038",
    title: "Insegne franchising 12 sedi",
    customer: "Caffè Vergnano",
    value: 38400,
    stage: "nuovo",
    owner: "Giulia Bianchi",
    ownerInitials: "GB",
    probability: 20,
    nextAction: "Prima call discovery",
    lastActivity: "Lead arrivato oggi",
    daysInStage: 0,
    aiPriority: "media",
    aiReason: "Nuovo lead inbound, contattare entro 24h per massimizzare conversione.",
    contact: "Paolo Rinaldi",
    phone: "+39 011 5566778",
    email: "p.rinaldi@vergnano.it",
    city: "Torino",
  },
  {
    id: "D-1037",
    title: "Display showroom auto",
    customer: "BMW Roma",
    value: 19200,
    stage: "chiuso_vinto",
    owner: "Luca Verdi",
    ownerInitials: "LV",
    probability: 100,
    nextAction: "Avviare commessa",
    lastActivity: "Contratto firmato",
    daysInStage: 1,
    aiPriority: "bassa",
    aiReason: "Vinto. Procedere con onboarding produzione.",
    contact: "Stefano Riva",
    phone: "+39 06 5544332",
    email: "s.riva@bmwroma.it",
    city: "Roma",
  },
  {
    id: "D-1036",
    title: "Totem outdoor centro commerciale",
    customer: "Centro Sarca",
    value: 54000,
    stage: "nuovo",
    owner: "Giulia Bianchi",
    ownerInitials: "GB",
    probability: 15,
    nextAction: "Qualificare budget",
    lastActivity: "Form sito 2 giorni fa",
    daysInStage: 2,
    aiPriority: "media",
    aiReason: "Lead da form, ancora freddo. Email di nurturing programmata.",
    contact: "Chiara Bossi",
    phone: "+39 02 6611002",
    email: "c.bossi@centrosarca.it",
    city: "Sesto S.G.",
  },
  {
    id: "D-1035",
    title: "Insegne farmacia comunale",
    customer: "ASL Bergamo",
    value: 8900,
    stage: "chiuso_perso",
    owner: "Luca Verdi",
    ownerInitials: "LV",
    probability: 0,
    nextAction: "Archiviato",
    lastActivity: "Perso 5 giorni fa",
    daysInStage: 5,
    aiPriority: "bassa",
    aiReason: "Perso per prezzo. Ripianificare tra 6 mesi.",
    contact: "Davide Locatelli",
    phone: "+39 035 112233",
    email: "d.locatelli@asl-bg.it",
    city: "Bergamo",
  },
];

export interface Call {
  id: string;
  dealId: string;
  customer: string;
  agent: string;
  date: string;
  duration: string;
  outcome: "positiva" | "neutra" | "negativa";
  summary: string;
  transcript: { speaker: "Cliente" | "Agente"; text: string; t: string }[];
  nextSteps: string[];
}

export const CALLS: Call[] = [
  {
    id: "C-2210",
    dealId: "D-1042",
    customer: "Coop Lombardia",
    agent: "Giulia Bianchi",
    date: "Oggi 11:24",
    duration: "14:32",
    outcome: "positiva",
    summary:
      "Il cliente ha confermato interesse su 24 totem outdoor 55\" antivandalo. Budget approvato fino a 50k. Richiede preventivo dettagliato con tempi di installazione entro venerdì. Decisione finale entro due settimane.",
    transcript: [
      { speaker: "Agente", t: "00:00", text: "Buongiorno Andrea, come stai? Ti chiamo per il follow-up sul progetto totem." },
      { speaker: "Cliente", t: "00:05", text: "Ciao Giulia, tutto bene. Sì, abbiamo discusso internamente: il progetto va avanti." },
      { speaker: "Agente", t: "00:18", text: "Ottimo. Mi confermi le 24 unità o aggiorniamo i numeri?" },
      { speaker: "Cliente", t: "00:24", text: "Confermo 24, ma servono outdoor antivandalo certificati IP65." },
      { speaker: "Agente", t: "00:38", text: "Perfetto, gestiamo la modifica. Il budget rimane sui 50k?" },
      { speaker: "Cliente", t: "00:45", text: "Sì, abbiamo l'approvazione. Mi mandi un preventivo definitivo entro venerdì?" },
      { speaker: "Agente", t: "00:58", text: "Assolutamente. Ti includo anche la timeline di installazione su 8 settimane." },
    ],
    nextSteps: [
      "Inviare preventivo aggiornato con specifiche IP65 entro venerdì",
      "Allegare timeline di installazione su 8 settimane",
      "Programmare call di review martedì prossimo",
    ],
  },
  {
    id: "C-2209",
    dealId: "D-1040",
    customer: "FC Verona",
    agent: "Luca Verdi",
    date: "Ieri 16:45",
    duration: "22:08",
    outcome: "neutra",
    summary:
      "Discussione tecnica su luminosità del display LED per stadio. Il cliente è preoccupato per visibilità in pieno sole. Richiesta demo on-site la prossima settimana.",
    transcript: [
      { speaker: "Cliente", t: "00:00", text: "Luca, abbiamo un dubbio sulla luminosità del modello che hai proposto." },
      { speaker: "Agente", t: "00:08", text: "Dimmi pure, di che modello stiamo parlando esattamente?" },
      { speaker: "Cliente", t: "00:15", text: "Quello da 6500 nit. Riusciamo a leggere bene anche con sole pieno?" },
    ],
    nextSteps: [
      "Organizzare demo on-site giovedì",
      "Preparare scheda tecnica con confronto luminosità competitor",
    ],
  },
  {
    id: "C-2208",
    dealId: "D-1041",
    customer: "Esselunga",
    agent: "Giulia Bianchi",
    date: "Ieri 10:12",
    duration: "08:55",
    outcome: "positiva",
    summary:
      "Sopralluogo confermato per martedì. Il cliente ha mostrato interesse anche per pacchetto manutenzione triennale.",
    transcript: [],
    nextSteps: ["Confermare sopralluogo", "Preparare offerta manutenzione triennale"],
  },
  {
    id: "C-2207",
    dealId: "D-1039",
    customer: "SEA Aeroporti",
    agent: "Luca Verdi",
    date: "2 giorni fa",
    duration: "11:20",
    outcome: "negativa",
    summary: "Il cliente ha rinviato la decisione di un mese per riorganizzazione interna.",
    transcript: [],
    nextSteps: ["Reminder a 4 settimane"],
  },
];

export interface Customer {
  id: string;
  name: string;
  city: string;
  contact: string;
  phone: string;
  email: string;
  totalRevenue: number;
  openDeals: number;
  status: "attivo" | "prospect" | "dormiente";
}

export const CUSTOMERS: Customer[] = [
  { id: "CL-001", name: "Coop Lombardia", city: "Milano", contact: "Andrea Conti", phone: "+39 02 1234567", email: "a.conti@coop.it", totalRevenue: 184500, openDeals: 1, status: "attivo" },
  { id: "CL-002", name: "Esselunga", city: "Milano", contact: "Marta Galli", phone: "+39 02 9988776", email: "m.galli@esselunga.it", totalRevenue: 96000, openDeals: 1, status: "attivo" },
  { id: "CL-003", name: "FC Verona", city: "Verona", contact: "Roberto Mazza", phone: "+39 045 778899", email: "r.mazza@fcverona.it", totalRevenue: 0, openDeals: 1, status: "prospect" },
  { id: "CL-004", name: "SEA Aeroporti", city: "Milano", contact: "Elena Ferri", phone: "+39 02 74852000", email: "e.ferri@seamilano.eu", totalRevenue: 220000, openDeals: 1, status: "attivo" },
  { id: "CL-005", name: "Caffè Vergnano", city: "Torino", contact: "Paolo Rinaldi", phone: "+39 011 5566778", email: "p.rinaldi@vergnano.it", totalRevenue: 0, openDeals: 1, status: "prospect" },
  { id: "CL-006", name: "BMW Roma", city: "Roma", contact: "Stefano Riva", phone: "+39 06 5544332", email: "s.riva@bmwroma.it", totalRevenue: 19200, openDeals: 0, status: "attivo" },
  { id: "CL-007", name: "Centro Sarca", city: "Sesto S.G.", contact: "Chiara Bossi", phone: "+39 02 6611002", email: "c.bossi@centrosarca.it", totalRevenue: 12000, openDeals: 1, status: "dormiente" },
];

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unitPrice: number;
}

export const PRODUCTS: Product[] = [
  { id: "P1", code: "TOT-OUT-55", name: "Totem outdoor 55\" antivandalo IP65", category: "Totem", unitPrice: 2950 },
  { id: "P2", code: "TOT-IN-43", name: "Totem indoor 43\" touch", category: "Totem", unitPrice: 1480 },
  { id: "P3", code: "INS-LED-FRONT", name: "Insegna LED frontale (al m²)", category: "Insegne", unitPrice: 480 },
  { id: "P4", code: "INS-LED-LAT", name: "Insegna LED scatolata laterale", category: "Insegne", unitPrice: 720 },
  { id: "P5", code: "DSP-LED-P3", name: "Display LED P3 (al m²)", category: "Display", unitPrice: 1850 },
  { id: "P6", code: "TAB-PVC-A0", name: "Tabella PVC stampata A0", category: "Tabelle", unitPrice: 95 },
  { id: "P7", code: "INST-STD", name: "Installazione standard (giornata)", category: "Servizi", unitPrice: 650 },
  { id: "P8", code: "MAN-Y", name: "Contratto manutenzione annuale", category: "Servizi", unitPrice: 1200 },
];

export interface Quote {
  id: string;
  number: string;
  customer: string;
  dealId: string | null;
  date: string;
  validUntil: string;
  status: "bozza" | "inviato" | "accettato" | "rifiutato";
  total: number;
  owner: string;
}

export const QUOTES: Quote[] = [
  { id: "Q1", number: "OFF-2025-0142", customer: "Coop Lombardia", dealId: "D-1042", date: "20/04/2025", validUntil: "20/05/2025", status: "bozza", total: 48500, owner: "Giulia Bianchi" },
  { id: "Q2", number: "OFF-2025-0141", customer: "Esselunga", dealId: "D-1041", date: "18/04/2025", validUntil: "18/05/2025", status: "inviato", total: 22300, owner: "Giulia Bianchi" },
  { id: "Q3", number: "OFF-2025-0140", customer: "FC Verona", dealId: "D-1040", date: "15/04/2025", validUntil: "15/05/2025", status: "inviato", total: 125000, owner: "Luca Verdi" },
  { id: "Q4", number: "OFF-2025-0139", customer: "BMW Roma", dealId: "D-1037", date: "10/04/2025", validUntil: "10/05/2025", status: "accettato", total: 19200, owner: "Luca Verdi" },
  { id: "Q5", number: "OFF-2025-0138", customer: "ASL Bergamo", dealId: "D-1035", date: "05/04/2025", validUntil: "05/05/2025", status: "rifiutato", total: 8900, owner: "Luca Verdi" },
];

export type JobStatus = "da_fare" | "in_corso" | "pronto" | "consegnato";
export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  da_fare: "Da fare",
  in_corso: "In corso",
  pronto: "Pronto",
  consegnato: "Consegnato",
};

export interface Job {
  id: string;
  code: string;
  customer: string;
  description: string;
  status: JobStatus;
  dueDate: string;
  assignee: string;
  progress: number;
  value: number;
}

export const JOBS: Job[] = [
  { id: "J1", code: "COM-2025-091", customer: "BMW Roma", description: "8 display showroom 43\"", status: "in_corso", dueDate: "30/04/2025", assignee: "Reparto produzione A", progress: 55, value: 19200 },
  { id: "J2", code: "COM-2025-090", customer: "Conad Nord", description: "12 insegne luminose", status: "pronto", dueDate: "28/04/2025", assignee: "Reparto produzione B", progress: 100, value: 34500 },
  { id: "J3", code: "COM-2025-089", customer: "Eni Stazioni", description: "Restyling tabelle 4 stazioni", status: "consegnato", dueDate: "20/04/2025", assignee: "Reparto produzione A", progress: 100, value: 28000 },
  { id: "J4", code: "COM-2025-088", customer: "Centro Sarca", description: "Totem outdoor 6 unità", status: "da_fare", dueDate: "12/05/2025", assignee: "Da assegnare", progress: 0, value: 17800 },
  { id: "J5", code: "COM-2025-087", customer: "Università Bocconi", description: "Display informativi atrio", status: "in_corso", dueDate: "05/05/2025", assignee: "Reparto produzione A", progress: 30, value: 22400 },
  { id: "J6", code: "COM-2025-086", customer: "Decathlon Italia", description: "Insegne nuovo store Modena", status: "pronto", dueDate: "26/04/2025", assignee: "Reparto produzione B", progress: 100, value: 41200 },
  { id: "J7", code: "COM-2025-085", customer: "Banca Sella", description: "Restyling 18 filiali - lotto 1", status: "in_corso", dueDate: "10/05/2025", assignee: "Reparto produzione B", progress: 70, value: 88000 },
  { id: "J8", code: "COM-2025-084", customer: "Carrefour Express", description: "Cartellonistica nuovo PV", status: "da_fare", dueDate: "15/05/2025", assignee: "Da assegnare", progress: 0, value: 9500 },
];

export type ReportType = "installazione" | "assistenza";
export interface Report {
  id: string;
  number: string;
  type: ReportType;
  customer: string;
  jobCode: string | null;
  date: string;
  technician: string;
  hours: number;
  notes: string;
  status: "completato" | "in_lavorazione" | "da_fatturare";
}

export const REPORTS: Report[] = [
  { id: "R1", number: "RAP-2025-204", type: "installazione", customer: "Eni Stazioni", jobCode: "COM-2025-089", date: "21/04/2025", technician: "Marco Galli", hours: 16, notes: "Installazione completata. Cliente firma collaudo. Materiale confezionato per spedizione retro.", status: "completato" },
  { id: "R2", number: "RAP-2025-203", type: "assistenza", customer: "Coop Lombardia", jobCode: null, date: "20/04/2025", technician: "Davide Russo", hours: 4, notes: "Sostituzione modulo LED su totem PV Linate. In garanzia.", status: "completato" },
  { id: "R3", number: "RAP-2025-202", type: "installazione", customer: "Decathlon Italia", jobCode: "COM-2025-086", date: "23/04/2025", technician: "Marco Galli", hours: 12, notes: "Installazione in corso, 2 giornate previste.", status: "in_lavorazione" },
  { id: "R4", number: "RAP-2025-201", type: "assistenza", customer: "Esselunga", jobCode: null, date: "19/04/2025", technician: "Davide Russo", hours: 3, notes: "Manutenzione programmata insegne PV Famagosta.", status: "da_fatturare" },
  { id: "R5", number: "RAP-2025-200", type: "installazione", customer: "Banca Sella", jobCode: "COM-2025-085", date: "22/04/2025", technician: "Lorenzo Pini", hours: 20, notes: "Installazione filiali 1-3 di 18. Conformità OK.", status: "in_lavorazione" },
];

export type InvoiceStatus = "emessa" | "da_emettere";
export type PaymentStatus = "pagato" | "in_attesa" | "non_emesso";

export interface InvoiceLine {
  amount: number;
  date: string;
  paymentStatus: PaymentStatus;
  invoiceStatus: InvoiceStatus;
  invoiceNumber: string | null;
  invoiceDate: string | null;
}

export interface CompletedWork {
  id: string;
  jobCode: string;
  customer: string;
  description: string;
  total: number;
  acconto: InvoiceLine;
  saldo: InvoiceLine;
  paymentTerms: string;
  closedDate: string;
}

export const COMPLETED_WORKS: CompletedWork[] = [
  {
    id: "W1",
    jobCode: "COM-2025-089",
    customer: "Eni Stazioni",
    description: "Restyling tabelle 4 stazioni",
    total: 28000,
    acconto: {
      amount: 8400,
      date: "10/03/2025",
      paymentStatus: "pagato",
      invoiceStatus: "emessa",
      invoiceNumber: "FT-2025-0042",
      invoiceDate: "05/03/2025",
    },
    saldo: {
      amount: 19600,
      date: "30/04/2025",
      paymentStatus: "in_attesa",
      invoiceStatus: "emessa",
      invoiceNumber: "FT-2025-0118",
      invoiceDate: "22/04/2025",
    },
    paymentTerms: "30% acconto, 70% saldo a 30gg",
    closedDate: "21/04/2025",
  },
  {
    id: "W2",
    jobCode: "COM-2025-079",
    customer: "Mediaworld",
    description: "Insegne 4 store Triveneto",
    total: 56500,
    acconto: {
      amount: 16950,
      date: "01/02/2025",
      paymentStatus: "pagato",
      invoiceStatus: "emessa",
      invoiceNumber: "FT-2025-0019",
      invoiceDate: "28/01/2025",
    },
    saldo: {
      amount: 39550,
      date: "15/04/2025",
      paymentStatus: "pagato",
      invoiceStatus: "emessa",
      invoiceNumber: "FT-2025-0102",
      invoiceDate: "11/04/2025",
    },
    paymentTerms: "30% acconto, 70% saldo a 60gg",
    closedDate: "10/04/2025",
  },
  {
    id: "W3",
    jobCode: "COM-2025-082",
    customer: "Hera Comm",
    description: "Totem indoor 12 sportelli",
    total: 19800,
    acconto: {
      amount: 9900,
      date: "20/02/2025",
      paymentStatus: "pagato",
      invoiceStatus: "emessa",
      invoiceNumber: "FT-2025-0031",
      invoiceDate: "15/02/2025",
    },
    saldo: {
      amount: 9900,
      date: "20/04/2025",
      paymentStatus: "in_attesa",
      invoiceStatus: "da_emettere",
      invoiceNumber: null,
      invoiceDate: null,
    },
    paymentTerms: "50% acconto, 50% saldo a 30gg",
    closedDate: "15/04/2025",
  },
  {
    id: "W4",
    jobCode: "COM-2025-081",
    customer: "ATM Milano",
    description: "Display fermate sperimentali",
    total: 42000,
    acconto: {
      amount: 12600,
      date: "15/01/2025",
      paymentStatus: "pagato",
      invoiceStatus: "emessa",
      invoiceNumber: "FT-2025-0008",
      invoiceDate: "10/01/2025",
    },
    saldo: {
      amount: 29400,
      date: "—",
      paymentStatus: "non_emesso",
      invoiceStatus: "da_emettere",
      invoiceNumber: null,
      invoiceDate: null,
    },
    paymentTerms: "30% acconto, 70% saldo dopo collaudo finale",
    closedDate: "08/04/2025",
  },
];

export type BillingStatus = "fatturato" | "parziale" | "da_fatturare";
export const getBillingStatus = (w: CompletedWork): BillingStatus => {
  const a = w.acconto.invoiceStatus === "emessa";
  const s = w.saldo.invoiceStatus === "emessa";
  if (a && s) return "fatturato";
  if (a || s) return "parziale";
  return "da_fatturare";
};

// Sales KPI per commerciale
export interface SalesKpi {
  agent: string;
  initials: string;
  callsPerDay: number;
  quotesPerDay: number;
  closeRate: number;
  pipeline: number;
  trend: { day: string; calls: number; quotes: number }[];
}

export const SALES_KPI: SalesKpi[] = [
  {
    agent: "Giulia Bianchi",
    initials: "GB",
    callsPerDay: 12.4,
    quotesPerDay: 2.1,
    closeRate: 38,
    pipeline: 163200,
    trend: [
      { day: "Lun", calls: 11, quotes: 2 },
      { day: "Mar", calls: 14, quotes: 3 },
      { day: "Mer", calls: 9, quotes: 1 },
      { day: "Gio", calls: 15, quotes: 3 },
      { day: "Ven", calls: 13, quotes: 2 },
    ],
  },
  {
    agent: "Luca Verdi",
    initials: "LV",
    callsPerDay: 9.6,
    quotesPerDay: 1.6,
    closeRate: 31,
    pipeline: 212000,
    trend: [
      { day: "Lun", calls: 8, quotes: 1 },
      { day: "Mar", calls: 10, quotes: 2 },
      { day: "Mer", calls: 11, quotes: 2 },
      { day: "Gio", calls: 9, quotes: 1 },
      { day: "Ven", calls: 10, quotes: 2 },
    ],
  },
];

export const AI_SUGGESTIONS = [
  {
    dealId: "D-1042",
    customer: "Coop Lombardia",
    action: "Chiama oggi",
    reason: "Cliente in fase trattativa attende preventivo entro 48h. Probabilità chiusura 70%.",
    priority: "alta" as const,
  },
  {
    dealId: "D-1040",
    customer: "FC Verona",
    action: "Sblocca trattativa",
    reason: "Affare da €125k fermo da 12 giorni. Programma demo on-site per spingere decisione.",
    priority: "alta" as const,
  },
  {
    dealId: "D-1038",
    customer: "Caffè Vergnano",
    action: "Prima call entro oggi",
    reason: "Lead inbound caldo. Conversione cala del 60% se non contattato entro 24h.",
    priority: "alta" as const,
  },
  {
    dealId: "D-1041",
    customer: "Esselunga",
    action: "Conferma sopralluogo",
    reason: "Sopralluogo programmato martedì, mancano dettagli logistici.",
    priority: "media" as const,
  },
];

export const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
