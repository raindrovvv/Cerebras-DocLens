# PRD: PlainDoc — 어려운 문서를 누구나 이해할 수 있게 설명하는 AI

**Version:** v0.1 Hackathon MVP  
**Date:** 2026-06-28  
**Owner:** JM  
**Target Event:** Cerebras / Gemma Hackathon 24h Prototype  
**Product Type:** AI Document Intelligence / Accessibility Tool

---

## 1. 한 줄 소개

**PlainDoc은 법률 문서, 보험 약관, 의료 문서처럼 어렵고 긴 문서를 업로드하면 AI가 핵심 내용, 위험 요소, 돈/기한/해야 할 일을 추출하고, 어린이·시니어·일반인·전문가 모드로 쉽게 설명해주는 문서 이해 도구이다.**

---

## 2. 제품 비전

복잡한 문서는 대부분 전문가의 언어로 쓰여 있다. 하지만 실제로 그 문서를 읽고 판단해야 하는 사람은 일반인, 시니어, 보호자, 환자, 계약 당사자, 학생일 때가 많다.

PlainDoc은 단순 요약기가 아니라 **“전문가 언어를 사람의 언어로 바꾸는 AI 설명 레이어”**를 목표로 한다.

### 핵심 슬로건

> **Every document. Explained for everyone.**

또는

> **AI that speaks your language — not legal, insurance, or medical language.**

---

## 3. 문제 정의

### 3.1 사용자 문제

긴 문서에는 중요한 내용이 숨어 있지만, 일반 사용자는 다음 문제를 겪는다.

1. 문서가 너무 길어서 끝까지 읽기 어렵다.
2. 전문 용어가 많아 내용을 이해하기 어렵다.
3. 나에게 중요한 조항, 비용, 기한, 위험을 찾기 어렵다.
4. 문서를 읽어도 “그래서 내가 뭘 해야 하지?”가 명확하지 않다.
5. 시니어, 어린이, 환자, 보호자처럼 정보 접근성이 낮은 사용자는 더 큰 어려움을 겪는다.

### 3.2 기존 솔루션의 한계

기존 PDF 요약 도구는 대부분 다음 수준에 머문다.

```text
PDF 업로드 → 전체 요약 → 끝
```

하지만 사용자가 원하는 것은 단순한 요약이 아니라 다음이다.

- 이 문서에서 **내게 중요한 내용**
- 놓치면 안 되는 **위험 조항**
- 실제로 해야 하는 **다음 행동**
- 어려운 내용을 내 수준에 맞춘 **쉬운 설명**
- 원문 어디에 근거가 있는지 확인할 수 있는 **출처**

---

## 4. 목표

### 4.1 Hackathon MVP 목표

24시간 안에 다음 경험을 데모 가능한 수준으로 구현한다.

1. 사용자가 PDF를 업로드한다.
2. AI가 문서를 분석한다.
3. AI가 다음 내용을 추출한다.
   - 3줄 요약
   - 핵심 내용
   - 위험/주의 사항
   - 돈 관련 내용
   - 중요한 날짜/기한
   - 사용자가 해야 할 일
4. 같은 내용을 네 가지 모드로 설명한다.
   - 어린이 모드
   - 시니어 모드
   - 일반인 모드
   - 전문가 모드
5. 각 설명에 원문 근거 페이지 또는 문장 일부를 연결한다.
6. 최종 결과를 대시보드 형태로 보여준다.

### 4.2 비즈니스 목표

- 복잡한 문서 이해를 누구나 쉽게 만든다.
- 보험, 법률, 의료, 공공문서 등 다양한 고난도 문서 영역으로 확장 가능성을 보여준다.
- 해커톤에서는 **멀티에이전트 + 접근성 + 실용성 + 빠른 추론 속도**를 명확하게 보여준다.

---

## 5. 비목표 / MVP에서 하지 않는 것

Hackathon MVP에서는 다음을 하지 않는다.

1. 법률 자문, 의료 진단, 보험금 지급 보장 등 전문적 결론을 대신 내리지 않는다.
2. 모든 스캔 PDF OCR을 완벽히 지원하지 않는다.
3. 사용자의 실제 보험/병원/법률 계정과 연동하지 않는다.
4. 다국어 전체 번역은 필수 범위에서 제외한다.
5. 결제, 회원가입, 팀 협업 기능은 제외한다.
6. 원문 전체를 완벽하게 재작성하지 않는다.

---

## 6. 타깃 사용자

### 6.1 주요 사용자

#### 1) 시니어 사용자

- 보험 약관, 병원 안내문, 정부 공문을 이해해야 한다.
- 작은 글씨와 긴 문장을 읽기 어렵다.
- 핵심만 크고 쉽게 보고 싶어 한다.

#### 2) 보호자 / 가족

- 부모님 보험, 병원 기록, 계약 문서를 대신 확인한다.
- 가족에게 쉽게 설명해야 한다.
- 위험한 조항이나 해야 할 일을 빠르게 찾고 싶어 한다.

#### 3) 일반 성인

- 전세계약서, 보험 약관, 병원 진단서, 대출 서류를 읽어야 한다.
- 전문가에게 묻기 전에 먼저 전체 구조를 이해하고 싶어 한다.

#### 4) 어린이 / 청소년

- 어려운 학교 안내문, 규정, 부모님이 보여준 문서를 쉽게 이해하고 싶다.
- 비유와 쉬운 단어가 필요하다.

#### 5) 소규모 비즈니스 운영자

- 계약서, 서비스 약관, 보험 문서를 빠르게 파악해야 한다.
- 법무팀 없이 리스크를 먼저 스크리닝하고 싶다.

---

## 7. 핵심 사용자 시나리오

### 시나리오 A: 보험 약관 이해

사용자는 120페이지짜리 보험 약관 PDF를 업로드한다.

PlainDoc은 다음을 보여준다.

- 내가 받을 수 있는 주요 보장
- 보험금을 못 받을 수 있는 경우
- 청구 시 필요한 서류
- 중요한 기한
- 시니어 모드 설명
- 어린이에게 설명하듯 쉬운 버전

### 시나리오 B: 임대차 계약서 검토

사용자는 임대차 계약서 PDF를 업로드한다.

PlainDoc은 다음을 보여준다.

- 보증금, 월세, 관리비
- 계약 기간
- 자동 연장 여부
- 해지 조건
- 위약금
- 위험 조항
- 해야 할 일 체크리스트

### 시나리오 C: 의료 검사 결과 이해

사용자는 혈액검사 결과 또는 병원 소견서를 업로드한다.

PlainDoc은 다음을 보여준다.

- 어려운 의학 용어의 쉬운 설명
- 정상/주의/상담 필요 항목 분류
- 의사에게 물어볼 질문
- 생활 관리 체크리스트

> 주의: 의료 문서의 경우 진단이 아니라 “문서 이해 보조”로 제한한다.

---

## 8. 핵심 차별점

### 8.1 단순 요약이 아니라 “이해” 중심

PlainDoc은 문서를 줄이는 것이 아니라 사용자가 이해하고 행동할 수 있게 바꾼다.

### 8.2 페르소나별 설명 모드

같은 내용을 사용자 수준에 맞게 변환한다.

| 모드 | 설명 방식 |
|---|---|
| 어린이 모드 | 초등학생도 이해할 단어, 짧은 문장, 쉬운 비유 |
| 시니어 모드 | 큰 글씨, 핵심 중심, 해야 할 일 중심, 전문용어 최소화 |
| 일반인 모드 | 일상 언어로 정확하게 설명 |
| 전문가 모드 | 원문 용어, 조항, 근거 중심 설명 |

### 8.3 멀티에이전트 분석

문서를 하나의 AI가 대충 요약하지 않고, 여러 전문 Agent가 나눠서 분석한다.

```text
Document Reader Agent
Risk Agent
Money Agent
Timeline Agent
Action Agent
Persona Explanation Agent
Source Grounding Agent
```

### 8.4 원문 근거 제공

중요한 설명에는 페이지 번호와 원문 근거를 연결한다.

### 8.5 행동 중심 결과

최종 화면은 “읽을거리”가 아니라 “해야 할 일”을 중심으로 구성한다.

---

## 9. 제품 범위

### 9.1 MVP 범위: P0

| 기능 | 설명 | 우선순위 |
|---|---|---|
| PDF 업로드 | 사용자가 PDF 파일을 업로드 | P0 |
| 텍스트 추출 | PDF에서 텍스트 추출 | P0 |
| 문서 유형 분류 | 보험/법률/의료/기타 분류 | P0 |
| 핵심 요약 | 3줄 요약, 전체 요약 생성 | P0 |
| 위험 분석 | 불리한 조항, 주의사항 추출 | P0 |
| 돈/금액 추출 | 금액, 수수료, 보장액, 위약금 추출 | P0 |
| 기한/날짜 추출 | 계약일, 청구 기한, 만료일 추출 | P0 |
| 액션 아이템 | 사용자가 해야 할 일 생성 | P0 |
| 어린이 모드 | 쉬운 단어로 재설명 | P0 |
| 시니어 모드 | 큰 글씨, 핵심 중심 설명 | P0 |
| 전문가 모드 | 근거와 원문 용어 중심 설명 | P0 |
| 출처 표시 | 페이지 번호/문장 근거 표시 | P0 |
| 결과 대시보드 | 분석 결과를 카드 UI로 표시 | P0 |

### 9.2 확장 범위: P1

| 기능 | 설명 | 우선순위 |
|---|---|---|
| 질문하기 | 문서에 대해 후속 질문 가능 | P1 |
| 인포그래픽 생성 | 문서 내용을 시각 카드/흐름도로 변환 | P1 |
| 음성 읽기 | 시니어를 위한 TTS 읽어주기 | P1 |
| 문서 비교 | 두 계약서/약관 차이 비교 | P1 |
| 체크리스트 다운로드 | 해야 할 일을 PDF/Markdown으로 저장 | P1 |
| 한국어/영어 전환 | 설명 언어 선택 | P1 |

### 9.3 장기 범위: P2

| 기능 | 설명 | 우선순위 |
|---|---|---|
| OCR 고도화 | 스캔 문서 이미지 인식 | P2 |
| 병원/보험사 연동 | 실제 계정 데이터 연결 | P2 |
| 가족 공유 | 부모님/가족에게 설명 공유 | P2 |
| 알림 | 중요한 기한 알림 | P2 |
| 전문가 연결 | 변호사/보험 전문가/의료 상담 연결 | P2 |
| 모바일 앱 | 카메라로 문서 촬영 후 분석 | P2 |

---

## 10. 사용자 플로우

### 10.1 기본 플로우

```text
Landing Page
↓
PDF Upload
↓
Document Type Detection
↓
AI Multi-Agent Analysis
↓
Result Dashboard
↓
Persona Tabs
↓
Action Checklist
↓
Follow-up Question
```

### 10.2 상세 플로우

1. 사용자가 PDF를 업로드한다.
2. 시스템이 PDF 텍스트를 추출한다.
3. 문서 유형을 자동 분류한다.
4. Orchestrator Agent가 분석 계획을 세운다.
5. 여러 Agent가 병렬로 분석한다.
6. Aggregator Agent가 결과를 통합한다.
7. Persona Explanation Agent가 사용자별 설명을 만든다.
8. Source Grounding Agent가 근거를 연결한다.
9. UI가 결과를 대시보드로 표시한다.

---

## 11. 화면 구성

### 11.1 Landing Page

목적: 제품 가치를 5초 안에 이해시키기.

필수 요소:

- 제품명: PlainDoc
- 헤드라인: “어려운 문서를 누구나 이해할 수 있게.”
- 서브카피: “보험, 법률, 의료 문서를 어린이·시니어·일반인 눈높이에 맞게 설명합니다.”
- PDF 업로드 영역
- 샘플 문서로 체험하기 버튼

### 11.2 Upload Page

요소:

- Drag & Drop 업로드
- 파일명 표시
- 예상 페이지 수 표시
- 문서 유형 선택 옵션
  - 자동 감지
  - 보험
  - 법률
  - 의료
  - 공공문서
  - 기타
- 분석 시작 버튼

### 11.3 Loading / Agent Progress Page

Cerebras의 빠른 추론을 보여주기 위한 핵심 화면.

예시:

```text
✓ Document Reader Agent finished in 0.8s
✓ Risk Agent finished in 1.2s
✓ Money Agent finished in 1.0s
✓ Timeline Agent finished in 0.9s
✓ Persona Agent finished in 1.5s
```

목적:

- 멀티에이전트 구조를 시각적으로 보여준다.
- 빠른 분석 속도를 데모에서 체감하게 만든다.

### 11.4 Result Dashboard

상단:

- 문서 유형
- 페이지 수
- 분석 완료 시간
- 신뢰도 표시

메인 카드:

1. 3줄 요약
2. 가장 중요한 내용 5개
3. 위험/주의사항
4. 돈 관련 내용
5. 날짜/기한
6. 해야 할 일
7. 설명 모드 탭
8. 원문 근거

### 11.5 Persona Explanation Tabs

탭 구성:

- 👶 어린이 모드
- 👵 시니어 모드
- 🙂 일반인 모드
- 👨‍⚖️ 전문가 모드

각 탭은 같은 내용을 다른 말투와 난이도로 보여준다.

---

## 12. 기능 요구사항

### FR-001 PDF 업로드

**설명:** 사용자는 PDF 파일을 업로드할 수 있다.

**Acceptance Criteria**

- PDF 파일만 업로드 가능하다.
- 20MB 이하 파일을 지원한다.
- 업로드 후 파일명과 페이지 수가 표시된다.
- 업로드 실패 시 사용자에게 이유를 보여준다.

---

### FR-002 PDF 텍스트 추출

**설명:** 시스템은 PDF에서 텍스트를 추출한다.

**Acceptance Criteria**

- 텍스트 기반 PDF에서 페이지별 텍스트를 추출한다.
- 각 텍스트 chunk는 page number를 유지한다.
- 텍스트 추출이 거의 불가능한 스캔 PDF는 사용자에게 안내한다.

---

### FR-003 문서 유형 분류

**설명:** AI가 문서 유형을 자동으로 분류한다.

**분류 옵션**

- Insurance
- Legal
- Medical
- Government
- Financial
- Other

**Acceptance Criteria**

- 문서 유형과 confidence score를 반환한다.
- confidence가 낮으면 “기타 문서”로 분류한다.

---

### FR-004 핵심 요약 생성

**설명:** 문서 전체를 3줄 요약과 상세 요약으로 제공한다.

**Acceptance Criteria**

- 3줄 요약은 500자 이하로 제공한다.
- 상세 요약은 섹션별로 제공한다.
- 모든 핵심 주장에는 source page를 연결한다.

---

### FR-005 위험/주의사항 분석

**설명:** 사용자가 놓치면 손해를 볼 수 있는 내용을 추출한다.

**예시**

- 보장 제외 조건
- 위약금
- 자동 갱신
- 청구 기한
- 면책 조항
- 개인정보 제공 조항

**Acceptance Criteria**

- 위험 항목은 severity를 가진다.
  - High
  - Medium
  - Low
- 각 위험 항목은 쉬운 설명과 원문 근거를 가진다.

---

### FR-006 돈 관련 내용 추출

**설명:** 문서 내 금액, 비용, 보장액, 수수료, 위약금을 추출한다.

**Acceptance Criteria**

- 금액과 관련 설명을 함께 보여준다.
- 금액이 사용자가 받을 돈인지, 낼 돈인지 구분한다.
- 불확실한 금액은 “확인 필요”로 표시한다.

---

### FR-007 날짜/기한 추출

**설명:** 중요한 날짜와 기한을 추출한다.

**Acceptance Criteria**

- 날짜, 기간, 조건부 기한을 추출한다.
- 날짜의 의미를 쉬운 말로 설명한다.
- 액션 아이템과 연결한다.

---

### FR-008 액션 아이템 생성

**설명:** 사용자가 다음에 해야 할 일을 체크리스트로 만든다.

**Acceptance Criteria**

- 각 액션은 동사로 시작한다.
- 우선순위를 가진다.
- 관련 근거 페이지를 가진다.
- 전문 상담이 필요한 항목은 별도로 표시한다.

---

### FR-009 어린이 모드 설명

**설명:** 문서를 초등학생도 이해할 수 있게 설명한다.

**Writing Rules**

- 짧은 문장 사용
- 어려운 용어 금지
- 일상적인 비유 사용
- 겁을 주는 표현 지양
- 중요한 내용은 “꼭 기억할 것”으로 표시

**예시**

원문:

> 피보험자가 고의로 사고를 발생시킨 경우 보험금 지급이 제한됩니다.

어린이 모드:

> 일부러 사고를 내면 보험회사는 돈을 주지 않을 수 있어요.

---

### FR-010 시니어 모드 설명

**설명:** 시니어가 쉽게 읽고 행동할 수 있도록 설명한다.

**Writing Rules**

- 큰 글씨 UI
- 한 문장 한 의미
- 전문용어 최소화
- “해야 할 일” 우선
- 돈, 날짜, 전화/방문 필요 여부 강조

**예시**

> 꼭 확인하세요. 30일 안에 서류를 내야 보험금을 받을 수 있습니다.

---

### FR-011 전문가 모드 설명

**설명:** 원문 용어와 구조를 유지하면서 근거 중심으로 설명한다.

**Acceptance Criteria**

- 조항 번호가 있으면 표시한다.
- 원문 표현을 보존한다.
- 해석과 원문 사실을 구분한다.

---

### FR-012 근거 표시

**설명:** 모든 중요한 분석 결과에는 근거를 표시한다.

**Acceptance Criteria**

- page number를 표시한다.
- 가능하면 원문 문장을 짧게 표시한다.
- 근거가 부족한 내용은 “근거 불충분”으로 표시한다.

---

## 13. AI Agent 설계

### 13.1 전체 구조

```text
PDF Upload
↓
PDF Parser
↓
Chunker
↓
Orchestrator Agent
↓
Parallel Agents
  ├─ Document Reader Agent
  ├─ Risk Agent
  ├─ Money Agent
  ├─ Timeline Agent
  ├─ Action Agent
  └─ Persona Explanation Agent
↓
Aggregator Agent
↓
Source Grounding Agent
↓
Result Dashboard
```

### 13.2 Agent별 역할

#### 1) Orchestrator Agent

역할:

- 문서 유형 판단
- 분석 계획 생성
- 어떤 Agent를 실행할지 결정

출력:

```json
{
  "document_type": "insurance",
  "confidence": 0.87,
  "analysis_plan": ["summary", "risk", "money", "timeline", "actions", "persona"]
}
```

#### 2) Document Reader Agent

역할:

- 문서 구조 파악
- 섹션별 요약
- 핵심 주제 추출

#### 3) Risk Agent

역할:

- 사용자가 불리할 수 있는 조항 탐지
- 면책, 위약금, 제한 조건, 자동 갱신 등 탐지

#### 4) Money Agent

역할:

- 금액, 비용, 보장액, 수수료, 위약금 추출
- “받는 돈 / 내는 돈 / 조건부 금액” 분류

#### 5) Timeline Agent

역할:

- 날짜, 기간, 마감일 추출
- 청구 기한, 계약 만료, 철회 가능 기간 등 정리

#### 6) Action Agent

역할:

- 사용자가 해야 할 일을 체크리스트로 변환
- 우선순위와 근거 연결

#### 7) Persona Explanation Agent

역할:

- 어린이/시니어/일반인/전문가 모드 설명 생성
- 동일한 사실을 난이도별로 재작성

#### 8) Source Grounding Agent

역할:

- AI가 생성한 주장과 원문 chunk를 매칭
- 근거가 없는 문장은 제거 또는 “확인 필요” 처리

---

## 14. 데이터 모델

### 14.1 Document

```ts
type Document = {
  id: string;
  fileName: string;
  fileType: "pdf";
  pageCount: number;
  uploadedAt: string;
  documentType: "insurance" | "legal" | "medical" | "government" | "financial" | "other";
  language: "ko" | "en" | "other";
};
```

### 14.2 Evidence

```ts
type Evidence = {
  page: number;
  quote: string;
  confidence: number;
};
```

### 14.3 RiskItem

```ts
type RiskItem = {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  plainExplanation: string;
  whyItMatters: string;
  evidence: Evidence[];
};
```

### 14.4 MoneyItem

```ts
type MoneyItem = {
  id: string;
  amount: string;
  type: "you_pay" | "you_receive" | "conditional" | "unknown";
  description: string;
  evidence: Evidence[];
};
```

### 14.5 TimelineItem

```ts
type TimelineItem = {
  id: string;
  dateText: string;
  meaning: string;
  urgency: "high" | "medium" | "low";
  evidence: Evidence[];
};
```

### 14.6 ActionItem

```ts
type ActionItem = {
  id: string;
  task: string;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  reason: string;
  evidence: Evidence[];
};
```

### 14.7 PersonaBrief

```ts
type PersonaBrief = {
  child: string;
  senior: string;
  general: string;
  expert: string;
};
```

### 14.8 FinalAnalysisResult

```ts
type FinalAnalysisResult = {
  document: Document;
  executiveSummary: string[];
  keyPoints: string[];
  risks: RiskItem[];
  moneyItems: MoneyItem[];
  timeline: TimelineItem[];
  actions: ActionItem[];
  personaBrief: PersonaBrief;
  disclaimer: string;
};
```

---

## 15. API 설계

### POST /api/upload

PDF 파일 업로드.

Response:

```json
{
  "documentId": "doc_123",
  "fileName": "insurance_policy.pdf",
  "pageCount": 84,
  "status": "uploaded"
}
```

### POST /api/analyze

문서 분석 실행.

Request:

```json
{
  "documentId": "doc_123",
  "preferredMode": "senior",
  "documentType": "auto"
}
```

Response:

```json
{
  "analysisId": "analysis_123",
  "status": "processing"
}
```

### GET /api/analyze/:analysisId

분석 결과 조회.

Response:

```json
{
  "status": "completed",
  "result": {
    "executiveSummary": [
      "이 문서는 암 진단비와 입원비 보장 내용을 설명합니다.",
      "보험금을 받으려면 진단서와 청구 서류가 필요합니다.",
      "일부 경우에는 보험금이 지급되지 않을 수 있습니다."
    ],
    "risks": [],
    "moneyItems": [],
    "timeline": [],
    "actions": [],
    "personaBrief": {}
  }
}
```

### POST /api/ask

문서 기반 후속 질문.

Request:

```json
{
  "documentId": "doc_123",
  "question": "보험금을 못 받는 경우가 뭐야?",
  "mode": "senior"
}
```

Response:

```json
{
  "answer": "일부러 사고를 낸 경우에는 보험금을 받기 어렵습니다.",
  "evidence": [
    {
      "page": 32,
      "quote": "피보험자가 고의로...",
      "confidence": 0.91
    }
  ]
}
```

---

## 16. 기술 아키텍처

### 16.1 추천 스택

Frontend:

- Next.js
- React
- Tailwind CSS
- shadcn/ui

Backend:

- Next.js API Routes 또는 FastAPI
- PDF parsing: PyMuPDF, pdf-parse, pdfplumber 중 선택
- LLM inference: Cerebras Inference API
- Optional vector search: local embeddings or simple keyword retrieval

Storage:

- Hackathon MVP: local temp storage
- Production: encrypted object storage

### 16.2 MVP 처리 방식

해커톤에서는 복잡한 RAG 시스템보다 단순하고 안정적인 구조를 우선한다.

```text
PDF text extraction
↓
Page-based chunking
↓
Top relevant chunk selection per agent
↓
Parallel LLM calls
↓
JSON output validation
↓
Dashboard rendering
```

### 16.3 병렬 호출 전략

Cerebras의 빠른 추론을 보여주기 위해 Agent를 병렬 실행한다.

```ts
const [summary, risks, money, timeline, actions] = await Promise.all([
  runSummaryAgent(chunks),
  runRiskAgent(chunks),
  runMoneyAgent(chunks),
  runTimelineAgent(chunks),
  runActionAgent(chunks),
]);
```

---

## 17. Prompt Contract

### 17.1 공통 시스템 원칙

모든 Agent는 다음 원칙을 따른다.

1. 문서에 없는 내용을 추측하지 않는다.
2. 근거가 부족하면 “확인 필요”라고 표시한다.
3. 법률/의료/보험 전문 자문처럼 단정하지 않는다.
4. 사용자가 이해하기 쉬운 언어로 설명한다.
5. 가능한 경우 page number와 원문 근거를 반환한다.

### 17.2 Risk Agent Prompt 요약

```text
You are a risk analysis agent for complex documents.
Find clauses or statements that may negatively affect the user.
Classify each risk as high, medium, or low.
Return JSON only.
Each risk must include title, explanation, why_it_matters, severity, and evidence.
Do not invent risks not supported by the document.
```

### 17.3 Persona Agent Prompt 요약

```text
Rewrite the same factual content for four audiences:
1. child: explain like a 10-year-old
2. senior: large-font friendly, action-oriented, simple Korean
3. general: plain language for adults
4. expert: preserve technical/legal/medical terms
Do not change the facts.
Do not add unsupported claims.
```

---

## 18. 접근성 요구사항

PlainDoc은 정보 접근성을 핵심 가치로 한다.

### 18.1 시니어 모드 UI

- 큰 글씨 토글
- 높은 대비
- 짧은 문장
- 버튼 크기 확대
- 위험/돈/기한을 아이콘으로 표시
- “지금 해야 할 일”을 최상단에 배치

### 18.2 어린이 모드 UI

- 어려운 단어 설명 툴팁
- 짧은 카드형 문장
- 비유 사용
- 무서운 표현보다 안전한 표현 사용

### 18.3 공통 접근성

- 모바일에서도 읽기 쉬운 레이아웃
- 키보드 접근 가능
- 색상만으로 위험도를 구분하지 않음
- 스크린리더 친화적 텍스트 구조

---

## 19. 법적/윤리적 가드레일

### 19.1 필수 고지 문구

서비스 내에 다음 문구를 표시한다.

> PlainDoc은 문서 이해를 돕는 AI 도구입니다. 법률, 의료, 보험, 금융에 대한 전문 자문을 대체하지 않습니다. 중요한 결정 전에는 반드시 전문가 또는 해당 기관에 확인하세요.

### 19.2 의료 문서 주의

- 진단을 내리지 않는다.
- 약 복용 변경을 제안하지 않는다.
- 응급 증상이 의심되는 경우 의료기관 상담을 권장한다.

### 19.3 법률 문서 주의

- 계약의 유효성 판단을 단정하지 않는다.
- 소송 가능성이나 승소 가능성을 단정하지 않는다.
- 변호사 상담이 필요한 항목은 표시만 한다.

### 19.4 보험 문서 주의

- 보험금 지급 가능성을 보장하지 않는다.
- 약관상 가능성, 제한 조건, 확인 필요 사항으로 표현한다.

---

## 20. 성공 지표

### 20.1 Hackathon Demo Metrics

| 지표 | 목표 |
|---|---|
| 50페이지 PDF 분석 시간 | 30초 이내 |
| Agent 병렬 실행 표시 | 필수 |
| Persona 설명 생성 | 4개 모드 모두 생성 |
| 핵심 위험 추출 | 최소 3개 이상 |
| 액션 아이템 생성 | 최소 3개 이상 |
| 출처 표시 | 핵심 항목의 70% 이상 |

### 20.2 제품 성공 지표

| 지표 | 의미 |
|---|---|
| Time to Understand | 사용자가 문서를 이해하는 데 걸리는 시간 |
| Comprehension Score | 사용자가 이해했다고 느끼는 정도 |
| Action Completion Rate | 생성된 체크리스트 수행률 |
| Trust Score | 원문 근거가 충분하다고 느끼는 정도 |
| Return Usage | 사용자가 다른 문서도 업로드하는 비율 |

---

## 21. 해커톤 24시간 개발 계획

### 0–2시간: 제품/디자인 고정

- 제품명, 슬로건 확정
- 데모 문서 1~2개 준비
- 주요 화면 와이어프레임 작성

### 2–5시간: PDF 업로드/파싱

- 업로드 UI 구현
- PDF 텍스트 추출
- 페이지별 chunk 생성

### 5–9시간: Agent 구현

- Summary Agent
- Risk Agent
- Money Agent
- Timeline Agent
- Action Agent
- Persona Agent

### 9–12시간: 결과 대시보드

- Summary 카드
- Risk 카드
- Money 카드
- Timeline 카드
- Persona 탭
- Evidence 표시

### 12–15시간: Cerebras 병렬 추론 최적화

- Agent 병렬 호출
- 처리 시간 표시
- JSON 파싱 안정화

### 15–18시간: 접근성 UI

- 시니어 모드 큰 글씨
- 어린이 모드 쉬운 카드
- 위험/돈/기한 아이콘

### 18–21시간: 데모 시나리오 완성

- 샘플 보험/계약 문서 분석
- 결과 예쁘게 정리
- 실패 케이스 처리

### 21–24시간: 영상/제출

- 2분 데모 영상 촬영
- README 작성
- 제출 폼 작성
- SNS용 짧은 클립 제작

---

## 22. 데모 시나리오

### 데모 제목

**“My grandma can finally understand her insurance policy.”**

### 흐름

1. 80페이지 보험 약관 PDF를 업로드한다.
2. PlainDoc이 Agent들을 병렬 실행한다.
3. 15초 안에 결과 대시보드가 생성된다.
4. 일반인 모드로 전체 핵심을 보여준다.
5. 시니어 모드로 전환한다.
6. 글씨가 커지고, “해야 할 일” 중심으로 재정리된다.
7. 어린이 모드로 전환한다.
8. 어려운 보험 용어가 쉬운 말로 바뀐다.
9. 위험 조항 하나를 클릭하면 원문 페이지 근거가 열린다.
10. 마지막에 액션 체크리스트를 보여준다.

### 데모에서 강조할 문장

> “This is not just summarization. It is document understanding for everyone.”

---

## 23. README용 프로젝트 설명

```md
# PlainDoc

PlainDoc is an AI document understanding tool that turns complex legal, insurance, and medical documents into clear, actionable explanations for everyone — including seniors and children.

## What it does

Upload a long PDF and PlainDoc extracts:

- Key summary
- Risks and warnings
- Money-related terms
- Important dates
- Action checklist
- Source evidence
- Child-friendly explanation
- Senior-friendly explanation
- Expert mode explanation

## Why Cerebras

PlainDoc uses multiple AI agents in parallel. Each agent focuses on a different aspect of the document, such as risks, money, deadlines, and accessibility. Cerebras enables fast multi-agent inference, making the experience feel instant even for long documents.
```

---

## 24. 향후 로드맵

### v0.2

- 문서 기반 Q&A
- OCR 지원
- 결과 PDF 다운로드
- 의료/보험/법률별 템플릿 고도화

### v0.3

- 가족 공유 링크
- 시니어 음성 읽기
- 중요한 기한 캘린더 저장
- 문서 비교 기능

### v1.0

- 모바일 앱
- 개인 문서 보관함
- 전문가 상담 연결
- 기관/기업용 플랜

---

## 25. Open Questions

1. 첫 데모 문서는 보험, 법률, 의료 중 무엇으로 할 것인가?
2. 한국어 문서를 우선할 것인가, 영어 문서를 우선할 것인가?
3. OCR 없는 텍스트 PDF만 지원한다고 명확히 제한할 것인가?
4. 서비스 이름을 PlainDoc으로 확정할 것인가?
5. 해커톤 제출 영상은 시니어 중심으로 갈 것인가, 어린이 중심으로 갈 것인가?

---

## 26. 최종 MVP 정의

Hackathon 제출 기준으로 PlainDoc MVP는 다음 한 문장으로 정의한다.

> **사용자가 복잡한 PDF를 업로드하면, 여러 AI Agent가 문서를 빠르게 분석하여 핵심 요약, 위험, 돈, 날짜, 해야 할 일을 추출하고, 이를 어린이·시니어·일반인·전문가 눈높이에 맞춰 설명하는 웹 앱.**

