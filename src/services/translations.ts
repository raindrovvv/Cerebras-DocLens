export type TranslationKeys = typeof ko;

const ko = {
  // Common
  appName: "Cerebras DocLens",
  gemmaBadge: "Gemma 4 31B (Cerebras)",
  footerPower: "© 2026 Cerebras DocLens. Powered by Cerebras Inference & Gemma-4-31B.",
  disclaimer: "Cerebras DocLens은 문서 이해를 돕는 AI 도구입니다. 법률, 의료, 보험, 금융에 대한 전문 자문을 대체하지 않습니다. 중요한 결정 전에는 반드시 전문가 또는 해당 기관에 확인하세요.",
  
  // Hero / Landing
  heroBadge: "Every document. Explained for everyone.",
  heroTitle1: "어려운 문서를",
  heroTitle2: "누구나 이해할 수 있게.",
  heroSubtitle: "법률 계약서, 보험 약관, 의료 문서처럼 길고 난해한 문서를 업로드해 보세요. 핵심 내용과 위험 요소를 찾아 어린이, 시니어, 일반인, 전문가 눈높이에 맞춰 설명해 드립니다.",
  
  // Upload Zone
  uploadTitle: "분석할 문서를 업로드하세요",
  uploadSubtitle: "PDF 또는 문서 이미지(PNG/JPG/WebP)를 업로드하세요. Gemma 4 31B가 텍스트와 시각 정보를 함께 분석합니다.",
  samplesTitle: "샘플 문서로 바로 체험하기",
  
  sampleInsTitle: "무배당 케어플러스 암보험 약관",
  sampleInsDesc: "대기 기간(90일), 1년 내 50% 감액 및 해부병리 보고서 청구 기준",
  sampleLegTitle: "주택임대차 표준계약서",
  sampleLegDesc: "보증금 2억, 대항력 확보를 위한 전입신고 및 2회 연체 해지 조항",
  sampleMedTitle: "수술동의 및 부작용 설명서",
  sampleMedDesc: "8시간 금식, 아스피린 중단, 개복술 전환 및 비급여 소모품 비용 동의",
  sampleAflacTitle: "Aflac 미국 암보험 요약본",
  sampleAflacDesc: "30일 대기 기간, 평생 갱신 조건 및 주별 일괄 보험료 조정 조항",
  trySampleBtn: "체험 →",
  
  // Loading & Progress
  extractingText: "문서 텍스트 추출 중...",
  extractingDesc: "업로드한 PDF 파일에서 페이지별 텍스트 데이터를 분석 및 추출하고 있습니다.",
  terminalTitle: "Cerebras parallel_agents.py",
  terminalSubtitle: "Gemma-4-31B Instruct 모델이 병렬 인퍼런스를 실행 중입니다.",
  elapsed: "경과 시간",
  success: "성공",
  pending: "대기 중",
  completed: "완료됨",
  
  agentNames: {
    summary: "Summary Agent",
    risks: "Risk Agent",
    money: "Money Agent",
    timeline: "Timeline Agent",
    actions: "Action Checklist Agent",
    persona: "Persona Translator Agent"
  },
  agentRoles: {
    summary: "분석 구조 및 핵심 3줄 요약 생성",
    risks: "독소 조항, 면책 및 주요 불이익 조건 감지",
    money: "금액, 보증금, 보상 금액, 수수료 추출",
    timeline: "청구 마감, 기한, 만기일, 납입 일정 탐색",
    actions: "사용자가 취해야 할 행동 체크리스트 정리",
    persona: "어린이/시니어/일반인/전문가 번역본 제작"
  },

  // Dashboard
  summaryTab: "요약",
  risksTab: "위험 요소",
  moneyTab: "비용 정보",
  timelineTab: "주요 일정",
  actionsTab: "행동 가이드",
  
  personaChild: "👶 어린이",
  personaSenior: "👵 어르신",
  personaGeneral: "🙂 일반",
  personaExpert: "👨‍⚖️ 전문가",
  
  downloadChecklist: "체크리스트 다운로드 (MD)",
  downloadChecklistTooltip: "행동 체크리스트 마크다운 파일 받기",
  
  // Chatbot
  chatbotTitle: "AI 챗봇 질문하기",
  chatbotWelcome: "안녕하세요! 분석 결과에 대해 궁금한 점이 있으시면 편하게 말씀해 주세요.",
  chatbotPlaceholder: "문서에 대해 질문해 보세요...",
  chatbotError: "질문에 응답하는 도중 오류가 발생했습니다. (임시 우회 처리 진행)",
  
  // Source Dialogue
  sourceTitle: "원문 근거 정보",
  sourceConfidence: "신뢰도",
  sourceTarget: "대상 항목",
  sourceLocation: "원문 위치",
  sourcePageNum: "페이지",
  sourceQuote: "근거 문장",
  sourceClose: "닫기",
  
  // Risks Table Headers
  riskSeverity: "위험도",
  riskExplanation: "어려운 표현 설명",
  riskWhyItMatters: "나에게 미치는 영향",
  riskEvidence: "원문 근거 보기",
  riskEvidencePage: "페이지",
  
  // Financial Headers
  financialAmount: "금액",
  financialDesc: "항목 설명",
  financialType: {
    you_pay: "내가 내는 돈",
    you_receive: "내가 받는 돈",
    conditional: "조건부 발생 돈",
    unknown: "미확정 비용"
  },
  
  // Timeline Headers
  timelineDate: "날짜 / 기한",
  timelineMeaning: "의미 및 중요도",
  timelineUrgency: "긴급도",
  
  // Actions Table
  actionTask: "해야 할 행동",
  actionPriority: "중요도",
  actionReason: "행동이 필요한 이유",

  // Metadata & Headers
  pageCountLabel: "페이지 수",
  analysisTimeLabel: "분석 시간",
  confidenceLabel: "신뢰도",
  confidenceHigh: "매우 높음",
  resetBtn: "초기화",
  explanationTitle: "눈높이 쉬운 설명",
  decreaseFont: "가-",
  increaseFont: "가+"
};

const en: TranslationKeys = {
  // Common
  appName: "Cerebras DocLens",
  gemmaBadge: "Gemma 4 31B (Cerebras)",
  footerPower: "© 2026 Cerebras DocLens. Powered by Cerebras Inference & Gemma-4-31B.",
  disclaimer: "Cerebras DocLens is an AI helper tool. It does not replace professional legal, medical, insurance, or financial advice. Always consult a professional or institution before making critical decisions.",
  
  // Hero / Landing
  heroBadge: "Every document. Explained for everyone.",
  heroTitle1: "Making complex documents",
  heroTitle2: "easy for everyone.",
  heroSubtitle: "Upload long, complex legal contracts, insurance policies, or medical consent forms. AI extracts key terms and risks, translating them to fit children, seniors, everyday adults, and experts.",
  
  // Upload Zone
  uploadTitle: "Upload document to analyze",
  uploadSubtitle: "Upload a PDF or document image (PNG/JPG/WebP). Gemma 4 31B analyzes text and visual evidence together.",
  samplesTitle: "Try with a sample document",
  
  sampleInsTitle: "Cancer Insurance Policy",
  sampleInsDesc: "Covers 90-day waiting periods, 50% reduction in first year, and biopsy report rules.",
  sampleLegTitle: "Residential Rental Agreement",
  sampleLegDesc: "Includes 200M KRW deposit, transfer registration for protection, and 2-month rent default terms.",
  sampleMedTitle: "Surgery Consent & Side Effects",
  sampleMedDesc: "Highlights 8-hour fasting, stopping aspirin, laparotomy transition, and non-benefit material fees.",
  sampleAflacTitle: "Aflac US Cancer Policy Summary",
  sampleAflacDesc: "Features 30-day waiting periods, guaranteed renewability, and class premium adjustments.",
  trySampleBtn: "Try →",
  
  // Loading & Progress
  extractingText: "Extracting document text...",
  extractingDesc: "Analyzing and extracting text data page-by-page from the uploaded PDF file.",
  terminalTitle: "Cerebras parallel_agents.py",
  terminalSubtitle: "Gemma-4-31B Instruct model executing parallel inference.",
  elapsed: "Elapsed",
  success: "success",
  pending: "pending",
  completed: "completed",
  
  agentNames: {
    summary: "Summary Agent",
    risks: "Risk Agent",
    money: "Money Agent",
    timeline: "Timeline Agent",
    actions: "Action Checklist Agent",
    persona: "Persona Translator Agent"
  },
  agentRoles: {
    summary: "Generates analysis structures and 3-point summaries",
    risks: "Detects toxic clauses, waivers, and high-risk terms",
    money: "Extracts prices, deposits, payouts, and fees",
    timeline: "Finds deadlines, periods, expiry dates, and billing dates",
    actions: "Compiles a checklist of user action items",
    persona: "Creates child/senior/general/expert translations"
  },

  // Dashboard
  summaryTab: "Summary",
  risksTab: "Risks & Clauses",
  moneyTab: "Financial Details",
  timelineTab: "Key Deadlines",
  actionsTab: "Action Checklist",
  
  personaChild: "👶 Child",
  personaSenior: "👵 Senior",
  personaGeneral: "🙂 General",
  personaExpert: "👨‍⚖️ Expert",
  
  downloadChecklist: "Download Checklist (MD)",
  downloadChecklistTooltip: "Download the action checklist as a Markdown file",
  
  // Chatbot
  chatbotTitle: "AI Chatbot Assistant",
  chatbotWelcome: "Hello! If you have any questions about the analysis results, feel free to ask.",
  chatbotPlaceholder: "Ask a question about the document...",
  chatbotError: "An error occurred. Falling back to robust model routing.",
  
  // Source Dialogue
  sourceTitle: "Original Source Evidence",
  sourceConfidence: "Confidence",
  sourceTarget: "Target Item",
  sourceLocation: "Document Source",
  sourcePageNum: "Page",
  sourceQuote: "Original Quote",
  sourceClose: "Close",
  
  // Risks Table Headers
  riskSeverity: "Severity",
  riskExplanation: "Plain Explanation",
  riskWhyItMatters: "Why It Matters",
  riskEvidence: "View Evidence",
  riskEvidencePage: "Page",
  
  // Financial Headers
  financialAmount: "Amount",
  financialDesc: "Item Description",
  financialType: {
    you_pay: "You Pay",
    you_receive: "You Receive",
    conditional: "Conditional Payout",
    unknown: "Unconfirmed Cost"
  },
  
  // Timeline Headers
  timelineDate: "Date / Period",
  timelineMeaning: "Meaning & Impact",
  timelineUrgency: "Urgency",
  
  // Actions Table
  actionTask: "Action Item",
  actionPriority: "Priority",
  actionReason: "Why Needed",

  // Metadata & Headers
  pageCountLabel: "Pages",
  analysisTimeLabel: "Analysis Time",
  confidenceLabel: "Confidence",
  confidenceHigh: "Very High",
  resetBtn: "Reset",
  explanationTitle: "Tailored Explanation",
  decreaseFont: "A-",
  increaseFont: "A+"
};

export const translations = { ko, en };
