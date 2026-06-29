"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, ShieldAlert, Coins, Calendar, ListTodo, 
  MessageSquare, Send, ChevronDown, ChevronUp, 
  HelpCircle, Loader2, Sparkles, CheckSquare, Square, Zap
} from "lucide-react";
import { FinalAnalysisResult, Evidence } from "@/types";
import { translations } from "@/services/translations";

interface ResultDashboardProps {
  result: FinalAnalysisResult;
  overallDuration?: number;
  onReset: () => void;
  fullText?: string;
  lang: "ko" | "en";
  provider?: "cerebras" | "openai";
  agentDurations?: Record<string, number>;
  timingSource?: "real" | "demo";
  apiKeys?: {
    cerebras?: string;
    openai?: string;
  };
  onApiKeyRequired?: (provider?: "cerebras" | "openai") => void;
}

// Child Jargon Guide Tooltip Map
const JARGON_MAP: Record<string, string> = {
  "면책 기간": "내가 아파도 돈을 바로 주지 않고 기다리는 '준비 기간'을 말해요. 이 때 아프면 보장받지 못해요.",
  "면책기간": "내가 아파도 돈을 바로 주지 않고 기다리는 '준비 기간'을 말해요. 이 때 아프면 보장받지 못해요.",
  "감액 기간": "가입하고 얼마 되지 않았을 때(보통 1년), 약속한 보장 금액의 반(50%)만 깎아서 주는 기간이에요.",
  "감액기간": "가입하고 얼마 되지 않았을 때(보통 1년), 약속한 보장 금액의 반(50%)만 깎아서 주는 기간이에요.",
  "소멸시효": "약속된 기간(보통 3년) 안에 보험금을 청구하지 않으면 그 돈을 받을 수 있는 권리가 사라지는 기한이에요.",
  "조직검사 보고서": "의사 선생님이 진짜 아픈 곳의 세포를 떼서 현미경으로 관찰하고 정밀하게 작성한 문서예요. 가장 확실한 증거예요!",
  "대항력": "집주인이 바뀌더라도 내가 이 계약을 끝까지 유지하며 이 집에서 계속 살 수 있음을 지킬 수 있는 힘이에요.",
  "확정일자": "공무원 삼촌이 내가 이사 온 날짜가 맞다고 공식 확인해 주며 계약서에 찍어주는 도장이에요. 내 보증금을 숨겨주는 열쇠예요.",
  "우선변제권": "집에 큰 문제가 생겨 경매로 넘어가더라도, 내가 낸 보증금을 다른 사람들보다 먼저 안전하게 돌려받을 수 있는 우선권이에요.",
  "근저당권": "집주인이 은행에서 돈을 빌리면서 이 집을 담보(보증)로 맡겨두었다는 표시예요. 은행이 우선권을 갖는답니다.",
  "원상복구": "집을 나갈 때 처음에 들어왔을 때 상태처럼 깨끗하게 되돌려 놓아야 하는 세입자의 의무예요.",
  "원상회복": "집을 나갈 때 처음에 들어왔을 때 상태처럼 깨끗하게 되돌려 놓아야 하는 세입자의 의무예요.",
  "피보험자": "아프거나 다쳤을 때 보장의 혜택을 실제로 받게 되는 주인공(보험 가입 대상자)을 말해요."
};

const renderTextWithSimpleMarkdown = (text: string) => {
  return text.split("\n").map((line, lineIndex) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return (
      <React.Fragment key={`line-${lineIndex}`}>
        {parts.map((part, partIndex) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={partIndex} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
          }
          return <span key={partIndex}>{part}</span>;
        })}
        {lineIndex < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    );
  });
};

const JARGON_MAP_EN: Record<string, string> = {
  "waiting period": "A 'prep period' where the insurance doesn't pay immediately even if you're sick. Cancers found here are not covered.",
  "waiting periods": "A 'prep period' where the insurance doesn't pay immediately even if you're sick. Cancers found here are not covered.",
  "exclusion period": "A 'prep period' where the insurance doesn't pay immediately even if you're sick. Cancers found here are not covered.",
  "reduction period": "A period early in the policy (usually 1 year) where the payout is cut in half (50%).",
  "statute of limitations": "A deadline (usually 3 years) within which you must claim the money, or you lose the right to it.",
  "biopsy report": "A detailed document from a laboratory doctor who looks closely at tissue cells under a microscope to confirm the diagnosis.",
  "opposing power": "A legal shield that lets you stay in the house and keep your lease active even if the landlord changes.",
  "fixed-date stamp": "An official stamp from the local government confirming your move-in date to help protect your deposit.",
  "priority payment rights": "A priority right to get your deposit back before other lenders if the house goes into bank foreclosure.",
  "mortgage rights": "A marker showing the landlord borrowed money from the bank using this house as collateral.",
  "restoration": "An obligation to clean and repair the house back to its original condition before you move out.",
  "NPO": "Nothing by mouth. A strict rule of not eating or drinking anything, including water, before surgery.",
  "NPO (fasting)": "Nothing by mouth. A strict rule of not eating or drinking anything, including water, before surgery.",
  "ambulation": "Getting up and walking around after surgery to help your body heal and prevent organs from sticking together.",
  "adhesion": "An internal complication where tissues or organs stick together during the healing process."
};

// Component for Child-Friendly Text with Jargon Tooltips
const ChildTextRenderer = ({ text, lang }: { text: string; lang: "ko" | "en" }) => {
  let renderedElements: React.ReactNode[] = [];
  let currentText = text;
  let index = 0;

  const jargonSource = lang === "ko" ? JARGON_MAP : JARGON_MAP_EN;
  const keys = Object.keys(jargonSource);
  keys.sort((a, b) => b.length - a.length);

  while (currentText.length > 0) {
    let earliestMatch: { key: string; index: number } | null = null;

    for (const key of keys) {
      const matchIdx = currentText.indexOf(key);
      if (matchIdx !== -1) {
        if (!earliestMatch || matchIdx < earliestMatch.index) {
          earliestMatch = { key, index: matchIdx };
        }
      }
    }

    if (!earliestMatch) {
      renderedElements.push(<span key={`text-${index}`}>{currentText}</span>);
      break;
    }

    const { key, index: matchIdx } = earliestMatch;
    
    if (matchIdx > 0) {
      renderedElements.push(<span key={`text-${index}`}>{currentText.substring(0, matchIdx)}</span>);
      index++;
    }

    renderedElements.push(
      <span key={`jargon-${index}`} className="relative group inline-block font-semibold text-primary underline decoration-dashed decoration-primary/60 cursor-help px-1 bg-primary/5 rounded">
        {key}
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-surface-dark border border-white/10 text-on-dark text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 normal-case leading-relaxed font-normal font-sans">
          👶 <strong>{key}</strong>: {jargonSource[key]}
        </span>
      </span>
    );
    index++;

    currentText = currentText.substring(matchIdx + key.length);
  }

  return <p className="leading-relaxed whitespace-pre-wrap">{renderedElements}</p>;
};

export default function ResultDashboard({ result, overallDuration = 2.4, onReset, fullText, lang, provider = "cerebras", agentDurations, timingSource = "real", apiKeys = {}, onApiKeyRequired }: ResultDashboardProps) {
  const t = translations[lang];
  const [activePersona, setActivePersona] = useState<"child" | "senior" | "general" | "expert">("general");
  const [fontSize, setFontSize] = useState<number>(16); 
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});
  
  const [collapseState, setCollapseState] = useState({
    risks: false,
    money: false,
    timeline: false,
    actions: false
  });

  const [activeEvidence, setActiveEvidence] = useState<{
    open: boolean;
    title: string;
    page: number;
    quote: string;
    confidence: number;
  } | null>(null);

  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: lang === "ko" ? "안녕하세요! 분석된 문서에 대해 궁금한 점을 질문하시면 선택된 페르소나의 눈높이에서 답변해 드립니다." : "Hello! Feel free to ask questions about the analyzed document, and I'll explain it matching your persona!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollChatRef = useRef(false);
  const [realSpeedData, setRealSpeedData] = useState<Record<string, { overall: number; agents: Record<string, number> }>>({});
  const [speedPanelOpen, setSpeedPanelOpen] = useState(true);

  const queueChatAutoScroll = () => {
    shouldAutoScrollChatRef.current = true;
  };

  // Auto-scroll only the chatbot internal message list.
  // scrollIntoView can move the whole document when buttons or inputs update state.
  useEffect(() => {
    if (!shouldAutoScrollChatRef.current) return;
    shouldAutoScrollChatRef.current = false;

    const chatList = chatListRef.current;
    if (!chatList) return;

    chatList.scrollTo({
      top: chatList.scrollHeight,
      behavior: "smooth"
    });
  }, [chatMessages]);


  // Load + save real speed comparison data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cerebras_doclens_speed_data_v4");
      if (stored) setRealSpeedData(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    if (agentDurations && overallDuration > 0 && timingSource === "real") {
      try {
        const stored = localStorage.getItem("cerebras_doclens_speed_data_v4");
        const existing = stored ? JSON.parse(stored) : {};
        existing[provider] = { overall: overallDuration, agents: agentDurations };
        localStorage.setItem("cerebras_doclens_speed_data_v4", JSON.stringify(existing));
        setRealSpeedData(existing);
      } catch {}
    }
  }, [agentDurations, overallDuration, provider, timingSource]);

  useEffect(() => {
    let welcome = lang === "ko" ? "안녕하세요! 분석된 문서에 대해 궁금한 점이 있으신가요?" : "Hello! Do you have any questions about the analyzed document?";
    if (activePersona === "child") {
      welcome = lang === "ko" 
        ? "안녕! 대장님! 👶 이 문서에서 이해하기 어려운 부분이나 궁금한 점을 나에게 물어봐! 아주 쉽고 재밌게 말해줄게!"
        : "Hi there, buddy! 👶 Ask me anything you find hard to understand in this document. I'll make it super easy and fun!";
      setFontSize(16);
    } else if (activePersona === "senior") {
      welcome = lang === "ko"
        ? "어르신, 안녕하세요! 👵 이 약관/계약서에서 이해가 가지 않으시거나 꼭 물어보고 싶으신 내용을 써주시면 큰 글씨로 친절하게 설명드리겠습니다."
        : "Hello, dear! 👵 If there's anything in this agreement that confuses you, just write it here. I'll explain it in big, friendly letters.";
      setFontSize(20); 
    } else if (activePersona === "expert") {
      welcome = lang === "ko"
        ? "안녕하십니까. 👨‍⚖️ 본 계약/약관에 관련하여 추가적인 법적 분쟁 리스크나 세부 조항 조건 해석에 대해 질문을 입력해 주시기 바랍니다."
        : "Greetings. 👨‍⚖️ Please input any queries regarding potential legal liability, conflict analysis, or specific clause interpretations.";
      setFontSize(15);
    } else {
      welcome = lang === "ko"
        ? "안녕하세요! 🙂 분석 결과에 대해 후속 질문이 있으시면 편하게 말씀해 주세요."
        : "Hello! 🙂 If you have any follow-up questions about the analysis results, please let me know.";
      setFontSize(16);
    }
    setChatMessages([{ sender: "bot", text: welcome }]);
  }, [activePersona, lang]);

  const handleToggleAction = (id: string) => {
    setCheckedActions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const downloadChecklist = () => {
    const title = result.document.fileName.replace(".pdf", "") + " - Cerebras DocLens Action Checklist";
    let content = `# ${title}\n\n`;
    content += lang === "ko" ? `## 문서명: ${result.document.fileName}\n` : `## Document: ${result.document.fileName}\n`;
    content += lang === "ko" ? `## 일시: ${new Date().toLocaleDateString()}\n\n` : `## Date: ${new Date().toLocaleDateString()}\n\n`;
    content += lang === "ko" 
      ? `> Cerebras DocLens에서 추출한 행동 체크리스트입니다. 중요한 결정 전에는 반드시 전문가의 자문을 받으시기 바랍니다.\n\n`
      : `> This is an action checklist extracted by Cerebras DocLens. Always consult a professional before making major decisions.\n\n`;
    content += lang === "ko" ? `### 해야 할 일 목록\n\n` : `### Action Item Checklist\n\n`;
    
    result.actions.forEach((act) => {
      const isCompleted = checkedActions[act.id] ? "[x]" : "[ ]";
      content += `${isCompleted} **${act.task}**\n`;
      content += lang === "ko" ? `   - 이유: ${act.reason}\n` : `   - Reason: ${act.reason}\n`;
      if (act.evidence[0]) {
        content += lang === "ko" 
          ? `   - 근거: ${act.evidence[0].page}페이지 ("${act.evidence[0].quote.trim()}")\n`
          : `   - Evidence: Page ${act.evidence[0].page} ("${act.evidence[0].quote.trim()}")\n`;
      }
      content += `\n`;
    });
    
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${result.document.fileName.replace(".pdf", "")}_checklist.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    queueChatAutoScroll();
    setChatMessages(prev => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setChatLoading(true);

    // Immediately add empty bot message for streaming
    queueChatAutoScroll();
    setChatMessages(prev => [...prev, { sender: "bot", text: "" }]);

    try {
      const docContext = fullText || (result.keyPoints.join("\n") + "\n\n" +
        result.risks.map(r => `${r.title}: ${r.plainExplanation}`).join("\n") + "\n\n" +
        result.moneyItems.map(m => `${m.amount} (${m.description})`).join("\n") + "\n\n" +
        result.timeline.map(t => `${t.dateText}: ${t.meaning}`).join("\n"));

      const response = await fetch("/api/ask-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: docContext,
          question: userText,
          mode: activePersona,
          lang: lang,
          provider,
          apiKeys,
          history: chatMessages.slice(-10)
        })
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text().catch(() => "");
        if (errorText.toLowerCase().includes("missing") && errorText.toLowerCase().includes("api key")) {
          onApiKeyRequired?.(provider);
          throw new Error(
            lang === "ko"
              ? "API 키가 필요합니다. 상단 키 아이콘에서 본인 API 키를 등록해 주세요."
              : "API key required. Click the key icon in the header and add your own API key."
          );
        }
        throw new Error(lang === "ko" ? "응답을 받지 못했습니다." : "No response received.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        // Update the last (empty) bot message with streamed text
        queueChatAutoScroll();
        setChatMessages(prev => {
          const msgs = [...prev];
          msgs[msgs.length - 1] = { sender: "bot", text: accumulated };
          return msgs;
        });
      }
    } catch (err) {
      console.error(err);
      queueChatAutoScroll();
      setChatMessages(prev => {
        const msgs = [...prev];
        msgs[msgs.length - 1] = { sender: "bot", text: lang === "ko" ? "오류가 발생했습니다. 다시 시도해 주세요." : "An error occurred. Please try again." };
        return msgs;
      });
    } finally {
      setChatLoading(false);
    }
  };

  const getSeverityBadge = (severity: "high" | "medium" | "low") => {
    if (severity === "high") {
      return <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-md font-sans">{lang === "ko" ? "위험도 상" : "High Risk"}</span>;
    }
    if (severity === "medium") {
      return <span className="px-2 py-0.5 text-[10px] font-semibold bg-accent-amber/10 text-accent-amber border border-accent-amber/20 rounded-md font-sans">{lang === "ko" ? "위험도 중" : "Medium Risk"}</span>;
    }
    return <span className="px-2 py-0.5 text-[10px] font-semibold bg-surface-soft text-muted border border-hairline rounded-md font-sans">{lang === "ko" ? "위험도 하" : "Low Risk"}</span>;
  };

  const getUrgencyBadge = (urgency: "high" | "medium" | "low") => {
    if (urgency === "high") {
      return <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-md font-sans">{lang === "ko" ? "긴급" : "Urgent"}</span>;
    }
    if (urgency === "medium") {
      return <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary-disabled/20 text-body border border-hairline rounded-md font-sans">{lang === "ko" ? "보통" : "Normal"}</span>;
    }
    return <span className="px-2 py-0.5 text-[10px] font-semibold bg-surface-soft text-muted border border-hairline rounded-md font-sans">{lang === "ko" ? "기한 여유" : "Flexible"}</span>;
  };

  const docTypeLabels: Record<string, string> = lang === "ko" ? {
    insurance: "보험 약관",
    legal: "법률 계약서",
    medical: "의료 서류",
    government: "공공 행정문서",
    financial: "금융 서류",
    other: "기타 문서"
  } : {
    insurance: "Insurance Policy",
    legal: "Legal Contract",
    medical: "Medical Document",
    government: "Public Policy",
    financial: "Financial Document",
    other: "Other Document"
  };
  const measuredCerebrasOverall = realSpeedData["cerebras"]?.overall;
  const measuredOpenAIOverall = realSpeedData["openai"]?.overall;
  const hasBothMeasured = Boolean(measuredCerebrasOverall && measuredOpenAIOverall);
  const measuredRatio = hasBothMeasured
    ? measuredOpenAIOverall! / measuredCerebrasOverall!
    : undefined;
  const winnerLabel = !hasBothMeasured
    ? undefined
    : measuredRatio! >= 1
    ? "Cerebras"
    : "GPT-4.1";
  const winnerRatio = !hasBothMeasured
    ? undefined
    : measuredRatio! >= 1
    ? measuredRatio!
    : 1 / measuredRatio!;
  const timingBadgeLabel = timingSource === "demo"
    ? (lang === "ko" ? "데모 타이밍" : "Demo Timing")
    : hasBothMeasured
    ? `${winnerLabel} ${winnerRatio!.toFixed(1)}x ${lang === "ko" ? "빠름" : "faster"}`
    : provider === "cerebras"
    ? (lang === "ko" ? "Cerebras 실측" : "Cerebras measured")
    : (lang === "ko" ? "GPT-4.1 실측" : "GPT-4.1 measured");
  const timingBadgeClass = timingSource === "demo"
    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
    : hasBothMeasured && winnerLabel === "GPT-4.1"
    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
    : "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20";

  return (
    <div 
      className={`w-full max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in ${
        activePersona === "senior" ? "contrast-110" : ""
      }`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Top Banner stats (Cream Card with Hairline border) */}
      <div className="p-6 rounded-xl border border-hairline bg-surface-card flex flex-wrap gap-6 items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-canvas border border-hairline text-primary rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/25 font-sans">
                {docTypeLabels[result.document.documentType] || "분석 완료"}
              </span>
              <span className="text-[10px] text-muted-soft font-medium">
                {new Date(result.document.uploadedAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-xl font-serif text-ink mt-1 font-normal line-clamp-1">
              {result.document.fileName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="text-center px-4 py-1.5 border-r border-hairline font-sans">
            <span className="text-[10px] uppercase font-bold text-muted-soft tracking-wider">{t.pageCountLabel}</span>
            <p className="text-base font-medium text-ink mt-0.5">{result.document.pageCount} p</p>
          </div>
          <div className="text-center px-4 py-1.5 border-r border-hairline font-sans relative group">
            <span className="text-[10px] uppercase font-bold text-muted-soft tracking-wider">{t.analysisTimeLabel}</span>
            <div className="flex items-center gap-1.5 justify-center mt-0.5">
              <p className="text-base font-medium text-primary">{overallDuration.toFixed(2)}s</p>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${timingBadgeClass}`}>
                {timingBadgeLabel}
              </span>
            </div>
            
            {/* Hover comparison tooltip */}
            <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 bg-surface-dark border border-white/10 text-on-dark text-xs rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 normal-case leading-relaxed font-sans font-normal text-left">
              <div className="flex items-center gap-1.5 mb-2 font-semibold text-primary">
                <Zap className="w-3.5 h-3.5 fill-primary/10" />
                <span>Cerebras vs GPT-4.1 Latency</span>
              </div>
              <div className="space-y-1.5 text-on-dark-soft">
                <div className="flex justify-between">
                  <span>Cerebras (Gemma 4 31B):</span>
                  <span className="font-bold text-green-400">
                    {measuredCerebrasOverall ? `${measuredCerebrasOverall.toFixed(2)}s` : (lang === "ko" ? "미측정" : "not measured")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GPT-4.1:</span>
                  <span className="font-bold text-amber-400">
                    {measuredOpenAIOverall ? `${measuredOpenAIOverall.toFixed(2)}s` : (lang === "ko" ? "미측정" : "not measured")}
                  </span>
                </div>
                <div className="border-t border-white/5 my-1.5 pt-1.5 flex justify-between font-semibold text-white">
                  <span>{lang === "ko" ? "이번 실행 승자:" : "Winner this run:"}</span>
                  <span className="text-primary font-bold">
                    {hasBothMeasured ? `${winnerLabel} ${winnerRatio!.toFixed(1)}x` : (lang === "ko" ? "비교 모드 필요" : "run Compare")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center px-4 py-1.5 font-sans">
            <span className="text-[10px] uppercase font-bold text-muted-soft tracking-wider">{t.confidenceLabel}</span>
            <p className="text-base font-medium text-accent-teal mt-0.5">{t.confidenceHigh}</p>
          </div>
          <button 
            onClick={onReset}
            className="anthro-btn-secondary px-4 py-2 cursor-pointer"
          >
            {t.resetBtn}
          </button>
        </div>
      </div>

      {/* Speed Comparison Bar Chart — Cerebras vs GPT-4.1 */}
      {agentDurations && Object.keys(agentDurations).length > 0 && (() => {
        const hasBothReal = Boolean(realSpeedData["cerebras"] && realSpeedData["openai"]);
        const cerebrasData = realSpeedData["cerebras"]?.agents || {};
        const openaiData = realSpeedData["openai"]?.agents || {};
        const currentOverall = Math.max(overallDuration, 0.01);
        const cerebrasOverall = realSpeedData["cerebras"]?.overall || (provider === "cerebras" ? currentOverall : currentOverall * 0.13);
        const openaiOverall = realSpeedData["openai"]?.overall || (provider === "openai" ? currentOverall : currentOverall * 7.5);
        const rawSpeedup = openaiOverall / Math.max(cerebrasOverall, 0.01);
        const speedupWinner = rawSpeedup >= 1 ? "Cerebras" : "GPT-4.1";
        const speedupRatio = rawSpeedup >= 1 ? rawSpeedup : 1 / Math.max(rawSpeedup, 0.01);
        const maxOverall = Math.max(cerebrasOverall, openaiOverall, 0.01);
        const cerebrasOverallPct = Math.max(6, (cerebrasOverall / maxOverall) * 100);
        const openaiOverallPct = Math.max(6, (openaiOverall / maxOverall) * 100);
        const agentMeta: Record<string, { label: string; icon: string }> = {
          intake: { label: "Intake", icon: "🧠" },
          summary: { label: "Summary", icon: "📄" },
          risks: { label: "Risk", icon: "🛡️" },
          money: { label: "Cost", icon: "💰" },
          timeline: { label: "Timeline", icon: "🗓️" },
          actions: { label: "Action", icon: "✅" },
          persona: { label: "Persona", icon: "✨" },
        };
        const compareRows = Object.entries(agentDurations).map(([agent, duration]) => {
          const normalizedAgent = agent.replace(/_agent$/i, "").toLowerCase();
          const meta = agentMeta[normalizedAgent] || {
            label: normalizedAgent.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
            icon: "⚡",
          };
          const cerebrasTime = cerebrasData[agent] ?? (provider === "cerebras" ? duration : duration * 0.13);
          const openaiTime = openaiData[agent] ?? (provider === "openai" ? duration : duration * 7.5);
          const maxTime = Math.max(cerebrasTime, openaiTime, 0.01);
          const winner = cerebrasTime <= openaiTime ? "Cerebras" : "GPT-4.1";
          const ratio = winner === "Cerebras"
            ? openaiTime / Math.max(cerebrasTime, 0.01)
            : cerebrasTime / Math.max(openaiTime, 0.01);

          return {
            agent,
            ...meta,
            cerebrasTime,
            openaiTime,
            cerebrasPct: Math.max(5, (cerebrasTime / maxTime) * 100),
            openaiPct: Math.max(5, (openaiTime / maxTime) * 100),
            winner,
            ratio,
            isOutlier: winner !== speedupWinner,
          };
        });
        const cerebrasWins = compareRows.filter((row) => row.winner === "Cerebras").length;
        const openaiWins = compareRows.filter((row) => row.winner === "GPT-4.1").length;
        const outlierRows = compareRows.filter((row) => row.isOutlier);
        const outlierLabel = outlierRows.map((row) => row.label).join(", ");
        const speedCopy = {
          title: lang === "ko" ? "공정 병렬 추론 속도 비교" : "Fair parallel inference comparison",
          measured: lang === "ko" ? "실측 데이터" : "Measured",
          estimated: lang === "ko" ? "추정 포함" : "Estimated",
          measuredHelp: lang === "ko"
            ? "비교 모드는 두 provider 모두 같은 문서 인테이크와 전문 에이전트 파이프라인을 실행한 실제 측정값으로 표시합니다."
            : "Compare mode shows measured results with both providers running the same document-intake and specialist-agent pipeline.",
          estimatedHelp: lang === "ko"
            ? "현재는 한쪽 provider 실측값이 없어 추정치를 함께 보여줍니다. 상단 비교 모드로 다시 분석하면 실측 비교로 바뀝니다."
            : "One provider is still estimated. Run Compare again to replace this with measured results.",
          overallWinner: lang === "ko" ? "전체 승자" : "Overall Winner",
          overallBasis: lang === "ko" ? "전체 분석 완료 시간 기준" : "Based on total completion time",
          agentScore: lang === "ko" ? "에이전트 승패" : "Agent Score",
          agentScoreHelp: lang === "ko" ? "인테이크와 전문 에이전트별 개별 승패" : "Per-stage wins across the intake and specialist agents",
          outlier: lang === "ko" ? "예외 구간" : "Outlier",
          outlierCount: outlierRows.length > 0
            ? (lang === "ko" ? `${outlierRows.length}개 역전 구간` : `${outlierRows.length} reversal${outlierRows.length === 1 ? "" : "s"}`)
            : (lang === "ko" ? "역전 구간 없음" : "No reversals"),
          outlierHelp: outlierRows.length > 0
            ? (lang === "ko" ? `${outlierLabel} 에이전트는 전체 승자와 반대 결과입니다.` : `${outlierLabel} went against the overall winner.`)
            : (lang === "ko" ? "모든 에이전트가 전체 승자와 같은 방향입니다." : "All agents match the overall winner trend."),
          interpretation: lang === "ko" ? "해석" : "Interpretation",
          interpretationHelp: lang === "ko"
            ? "전체 승자는 사용자 체감 시간, 에이전트 승패는 내부 병목과 예외 구간을 보여줍니다."
            : "Overall winner reflects user-perceived latency; agent wins expose bottlenecks and exceptions.",
          howToRead: lang === "ko" ? "읽는 법" : "How to read",
          howToReadHelp: lang === "ko"
            ? "막대가 짧을수록 빠릅니다. Intake는 원문을 한 번 압축하고, 아래 전문 에이전트들은 그 캐시를 재사용합니다."
            : "Shorter bars are faster. Intake compresses the source once, then specialist agents reuse that cache.",
          faster: lang === "ko" ? "빠름" : "faster",
        };

        return (
          <div className="rounded-xl border border-hairline bg-surface-card p-4 space-y-3 text-ink shadow-[0_18px_46px_rgba(88,60,34,0.10)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-base font-semibold text-ink">{speedCopy.title}</h3>
                  <span className={`text-[10px] px-2 py-1 rounded-full border ${hasBothReal ? "border-teal-500/40 bg-teal-500/15 text-teal-300" : "border-amber-500/40 bg-amber-500/15 text-amber-300"}`}>
                    {hasBothReal ? speedCopy.measured : speedCopy.estimated}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSpeedPanelOpen((open) => !open)}
                    aria-expanded={speedPanelOpen}
                    className="ml-1 inline-flex items-center gap-1 rounded-md border border-hairline bg-surface-soft px-2 py-1 text-[10px] font-semibold text-muted transition hover:border-primary/40 hover:text-ink"
                  >
                    {speedPanelOpen ? (lang === "ko" ? "접기" : "Collapse") : (lang === "ko" ? "펼치기" : "Expand")}
                    {speedPanelOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {hasBothReal ? speedCopy.measuredHelp : speedCopy.estimatedHelp}
                </p>
              </div>
              <div className={`rounded-lg px-4 py-3 border ${speedupWinner === "Cerebras" ? "border-primary/35 bg-primary/10" : "border-amber-500/35 bg-amber-500/10"}`}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{speedCopy.overallWinner}</p>
                <p className={`font-mono text-lg font-bold ${speedupWinner === "Cerebras" ? "text-primary" : "text-amber-300"}`}>
                  {speedupWinner} {speedupRatio.toFixed(1)}x {speedCopy.faster}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{speedCopy.overallBasis}</p>
              </div>
            </div>

            {speedPanelOpen && (
              <>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="rounded-lg border border-hairline bg-surface-soft p-3 text-ink shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">{speedCopy.agentScore}</p>
                <p className="text-sm font-semibold">
                  <span className="text-primary">Cerebras {cerebrasWins}</span>
                  <span className="text-muted-foreground"> : </span>
                  <span className="text-amber-300">GPT-4.1 {openaiWins}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{speedCopy.agentScoreHelp}</p>
              </div>
              <div className={`rounded-lg border p-3 text-ink shadow-sm ${outlierRows.length > 0 ? "border-amber-500/25 bg-amber-500/10" : "border-teal-500/25 bg-teal-500/10"}`}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">{speedCopy.outlier}</p>
                <p className={`text-sm font-semibold ${outlierRows.length > 0 ? "text-amber-300" : "text-teal-300"}`}>
                  {speedCopy.outlierCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {speedCopy.outlierHelp}
                </p>
              </div>
              <div className="rounded-lg border border-hairline bg-surface-soft p-3 text-ink shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">{speedCopy.interpretation}</p>
                <p className="text-xs text-ink leading-relaxed">
                  {speedCopy.interpretationHelp}
                </p>
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <div className="rounded-lg border border-primary/25 bg-primary/10 p-3 text-ink shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-primary">Cerebras</span>
                  <span className="font-mono text-lg font-bold text-primary">{cerebrasOverall.toFixed(2)}s</span>
                </div>
                <div className="h-2 rounded-full bg-primary/10 overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${cerebrasOverallPct}%` }} />
                </div>
              </div>
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-ink shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-amber-300">GPT-4.1</span>
                  <span className="font-mono text-lg font-bold text-amber-300">{openaiOverall.toFixed(2)}s</span>
                </div>
                <div className="h-2 rounded-full bg-amber-500/10 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${openaiOverallPct}%` }} />
                </div>
              </div>
              <div className="rounded-lg border border-hairline bg-surface-soft p-3 text-ink shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">{speedCopy.howToRead}</p>
                <p className="text-xs text-ink leading-relaxed">
                  {speedCopy.howToReadHelp}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {compareRows.map((row) => (
                <div key={row.agent} className="rounded-lg border border-hairline bg-surface-soft p-3 text-ink shadow-sm">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{row.icon}</span>
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{row.label}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {row.isOutlier && (
                        <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-amber-300">
                          Outlier
                        </span>
                      )}
                      <span className={`text-xs font-mono font-semibold ${row.winner === "Cerebras" ? "text-primary" : "text-amber-300"}`}>
                        {row.winner} {row.ratio.toFixed(1)}x {speedCopy.faster}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-[72px_1fr_70px] items-center gap-3">
                      <span className="text-xs font-semibold text-primary">Cerebras</span>
                      <div className="h-2 rounded-full bg-primary/15 overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${row.cerebrasPct}%` }} />
                      </div>
                      <span className="text-right font-mono text-xs text-primary">{row.cerebrasTime.toFixed(2)}s</span>
                    </div>
                    <div className="grid grid-cols-[72px_1fr_70px] items-center gap-3">
                      <span className="text-xs font-semibold text-amber-300">GPT-4.1</span>
                      <div className="h-2 rounded-full bg-amber-500/15 overflow-hidden">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${row.openaiPct}%` }} />
                      </div>
                      <span className="text-right font-mono text-xs text-amber-300">{row.openaiTime.toFixed(2)}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
              </>
            )}
          </div>
        );
      })()}
      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Persona explainer (Cream canvas pacing) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Persona selector tabs */}
          <div className="p-1 rounded-xl bg-surface-soft border border-hairline flex justify-between gap-1 font-sans">
            {(["child", "senior", "general", "expert"] as const).map((p) => {
              const emojiMap = { child: "👶", senior: "👵", general: "🙂", expert: "👨‍⚖️" };
              const labelMap = { child: t.personaChild, senior: t.personaSenior, general: t.personaGeneral, expert: t.personaExpert };
              const isActive = activePersona === p;
              return (
                <button
                  key={p}
                  onClick={() => setActivePersona(p)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex flex-col items-center gap-0.5 ${
                    isActive
                      ? "bg-surface-card text-ink border border-hairline shadow-sm"
                      : "text-muted hover:text-ink hover:bg-surface-card/50"
                  }`}
                >
                  <span className="text-base leading-none">{emojiMap[p]}</span>
                  <span>{labelMap[p]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Persona Banner */}
          {(() => {
            const bannerConfig = {
              child: { emoji: "👶", color: "bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400", label: lang === "ko" ? "어린이 눈높이로 설명합니다" : "Explaining for a child" },
              senior: { emoji: "👵", color: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400", label: lang === "ko" ? "어르신을 위해 크고 쉽게 설명합니다" : "Explaining for an elderly person" },
              general: { emoji: "🙂", color: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400", label: lang === "ko" ? "일반 성인을 위한 평어 설명입니다" : "Plain language explanation for adults" },
              expert: { emoji: "👨‍⚖️", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400", label: lang === "ko" ? "전문가 관점의 법률·기술 용어로 설명합니다" : "Expert legal and technical explanation" },
            }[activePersona];
            return (
              <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-medium font-sans ${bannerConfig.color} transition-all duration-300`}>
                <span className="text-lg">{bannerConfig.emoji}</span>
                <span>{bannerConfig.label}</span>
              </div>
            );
          })()}

          {/* Persona explanation card */}
          <div className="p-8 rounded-xl border border-hairline bg-surface-card transition-all duration-300">
            <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-serif text-lg text-ink font-normal">{t.explanationTitle}</h3>
              </div>

              {/* Font Resizer controls */}
              <div className="flex items-center gap-1.5 border border-hairline rounded-lg p-0.5 bg-canvas font-sans">
                <button 
                  onClick={() => setFontSize(prev => Math.max(12, prev - 2))} 
                  className="px-2 py-0.5 text-[11px] text-muted hover:text-ink hover:bg-surface-soft rounded font-medium cursor-pointer"
                >
                  {t.decreaseFont}
                </button>
                <span className="text-[11px] text-ink px-1 border-x border-hairline/40">{fontSize}px</span>
                <button 
                  onClick={() => setFontSize(prev => Math.min(26, prev + 2))} 
                  className="px-2 py-0.5 text-[11px] text-muted hover:text-ink hover:bg-surface-soft rounded font-medium cursor-pointer"
                >
                  {t.increaseFont}
                </button>
              </div>
            </div>

            {/* Render translation */}
            <div 
              className={`leading-relaxed text-body ${
                activePersona === "senior" ? "font-serif text-ink tracking-wide leading-loose" : ""
              }`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {activePersona === "child" && (
                <ChildTextRenderer text={result.personaBrief.child} lang={lang} />
              )}
              {activePersona === "senior" && (
                <p className="whitespace-pre-wrap">{renderTextWithSimpleMarkdown(result.personaBrief.senior)}</p>
              )}
              {activePersona === "general" && (
                <p className="whitespace-pre-wrap">{renderTextWithSimpleMarkdown(result.personaBrief.general)}</p>
              )}
              {activePersona === "expert" && (
                <p className="whitespace-pre-wrap font-mono text-ink/90 leading-relaxed text-sm bg-canvas p-4 rounded-lg border border-hairline">{result.personaBrief.expert}</p>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-8 pt-4 border-t border-hairline/60 flex items-start gap-2.5 text-xs text-muted-soft font-sans">
              <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-soft" />
              <p>{result.disclaimer}</p>
            </div>
          </div>

          {/* Action Checklist - Positioned FIRST in senior mode for accessibility */}
          {activePersona === "senior" && (
            <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
              <div className="flex items-center justify-between gap-2.5 text-primary">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5" />
                  <h4 className="font-serif text-base font-normal">{lang === "ko" ? "👵 어르신이 오늘 꼭 해야 할 일" : "👵 Senior Action Checklist"}</h4>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadChecklist();
                  }}
                  className="anthro-btn-secondary px-3 py-1.5 text-xs cursor-pointer flex items-center gap-1.5 bg-canvas"
                >
                  <ListTodo className="w-3.5 h-3.5" />
                  {t.downloadChecklist}
                </button>
              </div>
              <div className="space-y-3">
                {result.actions.map((act) => (
                  <div 
                    key={act.id} 
                    onClick={() => handleToggleAction(act.id)}
                    className="flex items-start gap-3 p-4 bg-canvas border border-hairline hover:border-primary/30 rounded-xl cursor-pointer transition duration-200"
                  >
                    <button className="flex-shrink-0 mt-0.5 text-primary">
                      {checkedActions[act.id] ? (
                        <CheckSquare className="w-5 h-5 fill-primary/10" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-soft" />
                      )}
                    </button>
                    <div>
                      <span className={`text-base font-serif text-ink ${checkedActions[act.id] ? "line-through text-muted-soft" : ""}`}>
                        {act.task}
                      </span>
                      <p className="text-xs text-body mt-1">{act.reason}</p>
                      {act.evidence[0] && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveEvidence({
                              open: true,
                              title: act.task,
                              page: act.evidence[0].page,
                              quote: act.evidence[0].quote,
                              confidence: act.evidence[0].confidence
                            });
                          }}
                          className="text-[10px] text-primary underline mt-2.5 block font-medium hover:text-primary-active font-sans"
                        >
                          {lang === "ko" ? `원문 근거 보기 (약관 ${act.evidence[0].page}페이지)` : `View Evidence (Page ${act.evidence[0].page})`}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Cards Section (Anthropic alternating cream cards) */}
          <div className="space-y-6">
            
            {/* Risks Card */}
            <div className="p-6 rounded-xl border border-hairline bg-surface-card transition-all duration-300">
              <button 
                onClick={() => setCollapseState(p => ({ ...p, risks: !p.risks }))}
                className="w-full flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/10">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-base text-ink font-normal group-hover:text-primary transition-colors">
                    {t.risksTab} ({result.risks.length})
                  </h3>
                </div>
                {collapseState.risks ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
              </button>

              {!collapseState.risks && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  {result.risks.map((risk) => (
                    <div key={risk.id} className="p-4 bg-canvas rounded-xl border border-hairline hover:border-primary/20 transition duration-200">
                       <div className="flex items-center justify-between">
                        <h4 className="font-medium text-ink text-sm">{risk.title}</h4>
                        {getSeverityBadge(risk.severity)}
                      </div>
                      <p className="text-xs text-body mt-2.5 leading-relaxed">{risk.plainExplanation}</p>
                      <p className="text-xs text-body-strong font-medium mt-2 border-l-2 border-primary pl-2.5">
                        {risk.whyItMatters}
                      </p>
                      {risk.evidence[0] && (
                        <button
                          onClick={() => setActiveEvidence({
                            open: true,
                            title: risk.title,
                            page: risk.evidence[0].page,
                            quote: risk.evidence[0].quote,
                            confidence: risk.evidence[0].confidence
                          })}
                          className="text-[10px] text-primary underline mt-3 hover:text-primary-active font-sans"
                        >
                          {lang === "ko" ? `원문 근거 보기 (${risk.evidence[0].page}페이지)` : `View Evidence (Page ${risk.evidence[0].page})`}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Money Card */}
            <div className="p-6 rounded-xl border border-hairline bg-surface-card transition-all duration-300">
              <button 
                onClick={() => setCollapseState(p => ({ ...p, money: !p.money }))}
                className="w-full flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-disabled/30 text-body rounded-lg border border-hairline">
                    <Coins className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-base text-ink font-normal group-hover:text-primary transition-colors">
                    {t.moneyTab} ({result.moneyItems.length})
                  </h3>
                </div>
                {collapseState.money ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
              </button>

              {!collapseState.money && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  {result.moneyItems.map((money) => (
                    <div key={money.id} className="p-4 bg-canvas rounded-xl border border-hairline flex items-center justify-between hover:border-primary/20 transition duration-200">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${
                            money.type === "you_receive"
                              ? "bg-accent-teal/10 text-accent-teal border-accent-teal/20"
                              : money.type === "you_pay"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-surface-soft text-body border-hairline"
                          } font-sans`}>
                            {t.financialType[money.type] || (lang === "ko" ? "조건부 발생" : "Conditional")}
                          </span>
                          <span className="text-[10px] text-muted-soft">
                            {money.evidence[0] ? (lang === "ko" ? `약관 ${money.evidence[0].page}p` : `Page ${money.evidence[0].page}`) : ""}
                          </span>
                        </div>
                        <p className="text-xs text-ink font-medium leading-relaxed">{money.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-ink font-sans">{money.amount}</span>
                        {money.evidence[0] && (
                          <button
                            onClick={() => setActiveEvidence({
                              open: true,
                              title: money.description,
                              page: money.evidence[0].page,
                              quote: money.evidence[0].quote,
                              confidence: money.evidence[0].confidence
                            })}
                            className="text-[9px] text-primary underline block mt-1 hover:text-primary-active font-sans"
                          >
                            {lang === "ko" ? "근거 보기" : "View Evidence"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline Card */}
            <div className="p-6 rounded-xl border border-hairline bg-surface-card transition-all duration-300">
              <button 
                onClick={() => setCollapseState(p => ({ ...p, timeline: !p.timeline }))}
                className="w-full flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-disabled/30 text-body rounded-lg border border-hairline">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-base text-ink font-normal group-hover:text-primary transition-colors">
                    {t.timelineTab} ({result.timeline.length})
                  </h3>
                </div>
                {collapseState.timeline ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
              </button>

              {!collapseState.timeline && (
                <div className="mt-6 space-y-4 animate-fade-in font-sans">
                  {result.timeline.map((time) => (
                    <div key={time.id} className="p-4 bg-canvas rounded-xl border border-hairline hover:border-primary/20 transition duration-200 flex gap-4 items-start">
                      <div className="p-2 bg-surface-card border border-hairline text-ink rounded-lg font-semibold text-xs whitespace-nowrap min-w-[90px] text-center font-mono">
                        {time.dateText}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-ink leading-relaxed">{time.meaning}</span>
                          {getUrgencyBadge(time.urgency)}
                        </div>
                        {time.evidence[0] && (
                          <button
                            onClick={() => setActiveEvidence({
                              open: true,
                              title: time.meaning,
                              page: time.evidence[0].page,
                              quote: time.evidence[0].quote,
                              confidence: time.evidence[0].confidence
                            })}
                            className="text-[9px] text-primary underline hover:text-primary-active block mt-1"
                          >
                            {lang === "ko" ? `원문 근거 보기 (${time.evidence[0].page}페이지)` : `View Evidence (Page ${time.evidence[0].page})`}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Card (Only shown if NOT in senior mode to avoid redundancy) */}
            {activePersona !== "senior" && (
              <div className="p-6 rounded-xl border border-hairline bg-surface-card transition-all duration-300">
                <div className="flex items-center justify-between mb-4 border-b border-hairline/60 pb-3">
                  <button 
                    onClick={() => setCollapseState(p => ({ ...p, actions: !p.actions }))}
                    className="flex items-center gap-3 text-left cursor-pointer group flex-1"
                  >
                    <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/10">
                      <ListTodo className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif text-base text-ink font-normal group-hover:text-primary transition-colors">
                      {t.actionsTab} ({result.actions.length})
                    </h3>
                    {collapseState.actions ? <ChevronUp className="w-4 h-4 text-muted ml-2" /> : <ChevronDown className="w-4 h-4 text-muted ml-2" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadChecklist();
                    }}
                    className="anthro-btn-secondary px-3 py-1.5 text-xs cursor-pointer flex items-center gap-1 bg-canvas"
                  >
                    <ListTodo className="w-3.5 h-3.5" />
                    {lang === "ko" ? "다운로드" : "Download"}
                  </button>
                </div>

                {!collapseState.actions && (
                  <div className="mt-4 space-y-4 animate-fade-in">
                    {result.actions.map((act) => (
                      <div 
                        key={act.id} 
                        onClick={() => handleToggleAction(act.id)}
                        className="p-4 bg-canvas rounded-xl border border-hairline hover:border-primary/20 transition duration-200 flex gap-3 items-start cursor-pointer"
                      >
                        <button className="flex-shrink-0 mt-0.5 text-primary">
                          {checkedActions[act.id] ? (
                            <CheckSquare className="w-5 h-5 fill-primary/10" />
                          ) : (
                            <Square className="w-5 h-5 text-muted-soft" />
                          )}
                        </button>
                        <div>
                          <span className={`text-xs font-serif font-semibold text-ink ${checkedActions[act.id] ? "line-through text-muted-soft" : ""}`}>
                            {act.task}
                          </span>
                          <p className="text-[11px] text-body mt-1 leading-relaxed">{act.reason}</p>
                          {act.evidence[0] && (
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveEvidence({
                                    open: true,
                                    title: act.task,
                                    page: act.evidence[0].page,
                                    quote: act.evidence[0].quote,
                                    confidence: act.evidence[0].confidence
                                  });
                              }}
                              className="text-[9px] text-primary underline mt-2 block hover:text-primary-active font-sans"
                            >
                              {lang === "ko" ? `원문 근거 보기 (${act.evidence[0].page}페이지)` : `View Evidence (Page ${act.evidence[0].page})`}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Right column: Interactive Chatbot (Dark Navy Surface mockup) */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Executive summaries panel (Cream Card) */}
          <div className="p-6 rounded-xl border border-hairline bg-surface-card space-y-4">
            <h4 className="font-bold text-[10px] text-muted-soft uppercase tracking-widest font-sans">{lang === "ko" ? "한눈에 보는 요약" : "Executive Summary"}</h4>
            <div className="space-y-3.5">
              {result.executiveSummary.map((line, idx) => (
                <div key={idx} className="flex gap-2.5 text-xs text-body leading-relaxed">
                  <span className="text-primary font-bold font-mono">0{idx + 1}.</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Chatbot (Futuristic Dark Navy terminal mockup) */}
          <div className="p-6 rounded-xl bg-surface-dark border border-white/5 flex flex-col h-[500px] text-on-dark font-sans shadow-lg">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-4">
              <MessageSquare className="w-4 h-4 text-primary" />
              <h4 className="font-serif text-sm text-on-dark font-normal">{t.chatbotTitle}</h4>
            </div>

            {/* Chat list */}
            <div ref={chatListRef} className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`p-3.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : activePersona === "child"
                      ? "bg-surface-dark-soft border border-white/5 text-on-dark rounded-tl-none"
                      : activePersona === "senior"
                      ? "bg-surface-dark-soft border border-white/5 text-on-dark rounded-tl-none font-medium text-sm leading-relaxed"
                      : "bg-surface-dark-soft border border-white/5 text-on-dark rounded-tl-none"
                  }`}>
                    {msg.text}
                    {/* Blinking cursor while streaming the last bot message */}
                    {msg.sender === "bot" && idx === chatMessages.length - 1 && chatLoading && (
                      <span className="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>
              ))}
              {/* Invisible anchor for auto-scroll */}
              <div ref={chatEndRef} />
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="p-3 bg-surface-dark-soft rounded-xl rounded-tl-none border border-white/5">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleChatSubmit} className="mt-4 flex gap-2 items-end">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit(e as any);
                  }
                }}
                placeholder={t.chatbotPlaceholder}
                disabled={chatLoading}
                rows={1}
                className="flex-1 px-4 py-2.5 text-xs border border-white/10 hover:border-white/20 bg-surface-dark-elevated rounded-lg text-on-dark focus:outline-none focus:border-primary transition duration-200 resize-none"
                style={{ maxHeight: "80px", overflowY: "auto" }}
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="p-3 bg-primary hover:bg-primary-active text-white rounded-lg transition cursor-pointer flex-shrink-0 disabled:opacity-40"
              >
                {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Grounding Source Dialog (Cream Canvas with Hairline Border) */}
      {activeEvidence?.open && (
        <div className="fixed inset-0 bg-surface-dark/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999] animate-fade-in font-sans">
          <div className="bg-canvas border border-hairline p-6 rounded-2xl max-w-xl w-full space-y-6 shadow-2xl relative select-none">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h4 className="font-serif text-base text-ink font-normal flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {t.sourceTitle}
              </h4>
              <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-mono font-bold">
                {t.sourceConfidence} {(activeEvidence.confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-muted-soft uppercase font-bold tracking-wider">{t.sourceTarget}</span>
                <p className="text-sm font-semibold text-ink mt-0.5">{activeEvidence.title}</p>
              </div>
              
              <div>
                <span className="text-[10px] text-muted-soft uppercase font-bold tracking-wider">{t.sourceLocation}</span>
                <p className="text-sm font-semibold text-ink mt-0.5">
                  {lang === "ko" ? `${activeEvidence.page} 페이지` : `Page ${activeEvidence.page}`}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-muted-soft uppercase font-bold tracking-wider">{t.sourceQuote}</span>
                <div className="p-4 bg-surface-soft border border-hairline rounded-xl text-xs text-body italic leading-relaxed whitespace-pre-wrap mt-1 select-text">
                  "{activeEvidence.quote}"
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setActiveEvidence(null)}
                className="anthro-btn-primary px-5 py-2.5 cursor-pointer font-sans font-semibold text-xs"
              >
                {t.sourceClose}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
