export type DocumentInfo = {
  id: string;
  fileName: string;
  fileType: "pdf" | "image";
  pageCount: number;
  uploadedAt: string;
  documentType: "insurance" | "legal" | "medical" | "government" | "financial" | "other";
  language: "ko" | "en" | "other";
};

export type Evidence = {
  page: number;
  quote: string;
  confidence: number;
};

export type RiskItem = {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  plainExplanation: string;
  whyItMatters: string;
  evidence: Evidence[];
};

export type MoneyItem = {
  id: string;
  amount: string;
  type: "you_pay" | "you_receive" | "conditional" | "unknown";
  description: string;
  evidence: Evidence[];
};

export type TimelineItem = {
  id: string;
  dateText: string;
  meaning: string;
  urgency: "high" | "medium" | "low";
  evidence: Evidence[];
};

export type ActionItem = {
  id: string;
  task: string;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  reason: string;
  evidence: Evidence[];
};

export type PersonaBrief = {
  child: string;
  senior: string;
  general: string;
  expert: string;
};

export type FinalAnalysisResult = {
  document: DocumentInfo;
  executiveSummary: string[];
  keyPoints: string[];
  risks: RiskItem[];
  moneyItems: MoneyItem[];
  timeline: TimelineItem[];
  actions: ActionItem[];
  personaBrief: PersonaBrief;
  disclaimer: string;
};
