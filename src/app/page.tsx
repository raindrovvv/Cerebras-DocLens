"use client";

import React, { useState, lazy, Suspense } from "react";
import { Sparkles, FileText, Zap, Loader2, KeyRound } from "lucide-react";
import UploadZone from "@/components/UploadZone";
import ProgressIndicator from "@/components/ProgressIndicator";
import Toast, { ToastType } from "@/components/Toast";
import { FinalAnalysisResult } from "@/types";
import { translations } from "@/services/translations";

// Lazy load heavy components
const ResultDashboard = lazy(() => import("@/components/ResultDashboard"));

type ApiKeySettings = {
  cerebras: string;
  openai: string;
};

// Lazy load mock data only when needed
async function loadMockData(type: string, lang: string): Promise<FinalAnalysisResult> {
  const {
    mockInsuranceResult,
    mockLegalResult,
    mockMedicalResult,
    mockInsuranceResultEn,
    mockLegalResultEn,
    mockMedicalResultEn,
    mockAflacInsuranceResult,
    mockAflacInsuranceResultEn,
  } = await import("@/services/mockData");

  if (type === "insurance") return lang === "ko" ? mockInsuranceResult : mockInsuranceResultEn;
  if (type === "aflac") return lang === "ko" ? mockAflacInsuranceResult : mockAflacInsuranceResultEn;
  if (type === "legal") return lang === "ko" ? mockLegalResult : mockLegalResultEn;
  return lang === "ko" ? mockMedicalResult : mockMedicalResultEn;
}

export default function Home() {
  const [status, setStatus] = useState<"idle" | "parsing" | "analyzing" | "completed">("idle");
  const [fileName, setFileName] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(0);
  const [agentDurations, setAgentDurations] = useState<Record<string, number> | undefined>(undefined);
  const [analysisResult, setAnalysisResult] = useState<FinalAnalysisResult | null>(null);
  const [fullText, setFullText] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"ko" | "en">("ko");
  const [provider, setProvider] = useState<"cerebras" | "openai">("cerebras");
  const [compareBoth, setCompareBoth] = useState<boolean>(false);
  const [overallDuration, setOverallDuration] = useState<number>(0);
  const [timingSource, setTimingSource] = useState<"real" | "demo">("real");
  const [lastAnalysisPayload, setLastAnalysisPayload] = useState<any>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeySettings>({ cerebras: "", openai: "" });
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const showToast = (message: string, type: ToastType = "error") => setToast({ message, type });
  const closeToast = () => setToast(null);

  const t = translations[lang];
  const hasCerebrasUserKey = apiKeys.cerebras.trim().length > 0;
  const hasOpenAIUserKey = apiKeys.openai.trim().length > 0;
  const getRequestApiKeys = () => ({
    cerebras: apiKeys.cerebras.trim(),
    openai: apiKeys.openai.trim()
  });

  const promptForApiKey = (targetProvider?: "cerebras" | "openai") => {
    setShowApiKeySettings(true);
    const providerName = targetProvider === "openai" ? "GPT-4.1" : targetProvider === "cerebras" ? "Cerebras" : "Cerebras/GPT-4.1";
    showToast(
      lang === "ko"
        ? `${providerName} API 키가 필요합니다. 상단 키 아이콘에서 본인 API 키를 등록해 주세요.`
        : `${providerName} API key required. Click the key icon in the header and add your own API key.`,
      "warning"
    );
  };

  const isMissingApiKeyError = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error || "");
    return message.toLowerCase().includes("missing") && message.toLowerCase().includes("api key");
  };

  const saveApiKeys = () => {
    try {
      localStorage.setItem("cerebras_doclens_api_keys", JSON.stringify(getRequestApiKeys()));
      setShowApiKeySettings(false);
      showToast(lang === "ko" ? "API 키가 이 브라우저에 저장되었습니다." : "API keys saved in this browser.", "success");
    } catch {
      showToast(lang === "ko" ? "API 키 저장에 실패했습니다." : "Failed to save API keys.");
    }
  };

  const clearApiKeys = () => {
    try {
      localStorage.removeItem("cerebras_doclens_api_keys");
      setApiKeys({ cerebras: "", openai: "" });
      showToast(lang === "ko" ? "저장된 API 키를 삭제했습니다." : "Saved API keys removed.", "success");
    } catch {
      showToast(lang === "ko" ? "API 키 삭제에 실패했습니다." : "Failed to clear API keys.");
    }
  };

  // Restore analysis results from sessionStorage on mount
  React.useEffect(() => {
    try {
      const cached = sessionStorage.getItem("cerebras_doclens_session");
      if (cached) {
        const data = JSON.parse(cached);
        if (data.result && data.status === "completed") {
          setStatus("completed");
          setFileName(data.fileName || "");
          setAnalysisResult(data.result);
          setAgentDurations(data.agentDurations);
          setOverallDuration(data.overallDuration || 0);
          setProvider(data.provider || "cerebras");
          setCompareBoth(data.compareBoth || false);
          setTimingSource(data.timingSource || "real");
          setFullText(data.fullText || "");
          setLang(data.lang || "ko");
          setLastAnalysisPayload(data.analysisPayload || null);
        }
      }
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("cerebras_doclens_api_keys");
      if (stored) {
        const parsed = JSON.parse(stored);
        setApiKeys({ cerebras: parsed.cerebras || "", openai: parsed.openai || "" });
      }
    } catch {}
  }, []);

  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSelectSample = async (type: "insurance" | "legal" | "medical" | "aflac") => {
    setStatus("analyzing");
    setAgentDurations(undefined); // Reset durations for fresh timing
    setTimingSource("demo");
    setFileName(
      type === "insurance"
        ? (lang === "ko" ? "무배당_케어플러스_암보험_약관.pdf" : "CarePlus_Cancer_Insurance_Policy.pdf")
        : type === "aflac"
        ? "Aflac_Cancer_Care_Classic_Policy_Summary.pdf"
        : type === "legal"
        ? (lang === "ko" ? "주택임대차표준계약서_서울마포구.pdf" : "Residential_Lease_Agreement.pdf")
        : (lang === "ko" ? "수술동의서_및_부작용_설명서.pdf" : "Surgery_Consent_Form.pdf")
    );
    setFullText("");

    // Simulate parallel agent execution timing
    setTimeout(async () => {
      const mockResult = await loadMockData(type, lang);
      if (provider === "openai") {
        setAgentDurations({
          summary: 4.82,
          risks: 7.91,
          money: 5.12,
          timeline: 6.45,
          actions: 5.98,
          persona: 8.34
        });
        setOverallDuration(8.34);
      } else {
        setAgentDurations({
          summary: 0.65,
          risks: 0.98,
          money: 0.72,
          timeline: 0.84,
          actions: 0.79,
          persona: 1.15
        });
        setOverallDuration(1.15);
      }
      setAnalysisResult(mockResult);
    }, 100);
  };

  const handleFileSelect = async (file: File) => {
    setStatus("parsing");
    setFileName(file.name);
    setPageCount(0);
    setTimingSource("real");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const parseRes = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData
      });

      if (!parseRes.ok) {
        throw new Error(lang === "ko" ? "PDF 텍스트를 추출하는 데 실패했습니다." : "Failed to extract text from PDF.");
      }

      const parseData = await parseRes.json();

      // Warn user if scanned PDF detected
      if (parseData.isLikelyScanned) {
        showToast(
          lang === "ko"
            ? "이 PDF는 스캔 이미지 파일로 보입니다. 텍스트 레이어가 없어 분석 결과가 정확하지 않을 수 있습니다."
            : "This PDF appears to be a scanned image file. Lack of text layer may result in inaccurate analysis.",
          "warning"
        );
      }

      setPageCount(parseData.pageCount);
      const extractedText = parseData.pages.map((p: any) => p.text).join("\n\n");
      setFullText(extractedText);

      setStatus("analyzing");

      const basePayload = {
        documentId: `doc_${Math.random().toString(36).substring(7)}`,
        fileName: file.name,
        pageCount: parseData.pageCount,
        pages: parseData.pages,
        visualPages: parseData.visualPages || [],
        inputMode: parseData.inputMode || "pdf",
        lang
      };
      setLastAnalysisPayload(basePayload);

      const runAnalysis = async (targetProvider: "cerebras" | "openai") => {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...basePayload, provider: targetProvider, fairCompare: compareBoth, apiKeys: getRequestApiKeys() })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          const error = new Error(data.error || `${targetProvider} analysis failed`);
          (error as any).provider = data.provider || targetProvider;
          throw error;
        }
        if (!data.success) {
          const error = new Error(data.error || `${targetProvider} analysis failed`);
          (error as any).provider = data.provider || targetProvider;
          throw error;
        }
        return data;
      };

      let analyzeData;
      let resultProvider = provider;
      if (compareBoth) {
        const [cerebrasData, openaiData] = await Promise.all([
          runAnalysis("cerebras"),
          runAnalysis("openai")
        ]);
        analyzeData = cerebrasData;
        resultProvider = "cerebras";
        setProvider("cerebras");
        try {
          const existing = JSON.parse(localStorage.getItem("cerebras_doclens_speed_data_v4") || "{}");
          existing.cerebras = { overall: cerebrasData.overallDuration, agents: cerebrasData.durations };
          existing.openai = { overall: openaiData.overallDuration, agents: openaiData.durations };
          localStorage.setItem("cerebras_doclens_speed_data_v4", JSON.stringify(existing));
        } catch {}
      } else {
        analyzeData = await runAnalysis(provider);
      }

      setAgentDurations(analyzeData.durations);
      setOverallDuration(analyzeData.overallDuration);
      setAnalysisResult(analyzeData.result);
      // Cache to sessionStorage for refresh persistence
      try {
        sessionStorage.setItem("cerebras_doclens_session", JSON.stringify({
          status: "completed",
          fileName: file.name,
          result: analyzeData.result,
          agentDurations: analyzeData.durations,
          overallDuration: analyzeData.overallDuration,
          provider: resultProvider,
          compareBoth,
          timingSource: "real",
          fullText: extractedText,
          lang,
          analysisPayload: basePayload
        }));
      } catch {}
    } catch (error) {
      if (isMissingApiKeyError(error)) {
        promptForApiKey((error as any).provider || provider);
      } else {
        showToast((error as Error).message || (lang === "ko" ? "파일 처리 실패" : "File processing failed"));
      }
      setStatus("idle");
    }
  };

  const rerunAnalysisForLanguage = async (nextLang: "ko" | "en") => {
    const fallbackPayload = fullText.trim()
      ? {
          documentId: analysisResult?.document.id || `doc_${Math.random().toString(36).substring(7)}`,
          fileName: fileName || analysisResult?.document.fileName || "uploaded_document.pdf",
          pageCount: pageCount || analysisResult?.document.pageCount || 1,
          pages: [{ pageNum: 1, text: fullText }],
          visualPages: [],
          inputMode: analysisResult?.document.fileType === "image" ? "image" : "pdf",
          lang: nextLang
        }
      : null;
    const payloadForLanguage = lastAnalysisPayload || fallbackPayload;

    if (!payloadForLanguage || status !== "completed") {
      setLang(nextLang);
      return;
    }

    const nextPayload = { ...payloadForLanguage, lang: nextLang };
    setLang(nextLang);
    setStatus("analyzing");
    setAgentDurations(undefined);
    setTimingSource("real");

    const runAnalysis = async (targetProvider: "cerebras" | "openai") => {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nextPayload, provider: targetProvider, fairCompare: compareBoth, apiKeys: getRequestApiKeys() })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = new Error(data.error || `${targetProvider} analysis failed`);
        (error as any).provider = data.provider || targetProvider;
        throw error;
      }
      if (!data.success) {
        const error = new Error(data.error || `${targetProvider} analysis failed`);
        (error as any).provider = data.provider || targetProvider;
        throw error;
      }
      return data;
    };

    try {
      let analyzeData;
      let resultProvider = provider;
      if (compareBoth) {
        const [cerebrasData, openaiData] = await Promise.all([
          runAnalysis("cerebras"),
          runAnalysis("openai")
        ]);
        analyzeData = cerebrasData;
        resultProvider = "cerebras";
        setProvider("cerebras");
        try {
          const existing = JSON.parse(localStorage.getItem("cerebras_doclens_speed_data_v4") || "{}");
          existing.cerebras = { overall: cerebrasData.overallDuration, agents: cerebrasData.durations };
          existing.openai = { overall: openaiData.overallDuration, agents: openaiData.durations };
          localStorage.setItem("cerebras_doclens_speed_data_v4", JSON.stringify(existing));
        } catch {}
      } else {
        analyzeData = await runAnalysis(provider);
      }

      setAgentDurations(analyzeData.durations);
      setOverallDuration(analyzeData.overallDuration);
      setAnalysisResult(analyzeData.result);
      setLastAnalysisPayload(nextPayload);
      setStatus("completed");
      try {
        sessionStorage.setItem("cerebras_doclens_session", JSON.stringify({
          status: "completed",
          fileName,
          result: analyzeData.result,
          agentDurations: analyzeData.durations,
          overallDuration: analyzeData.overallDuration,
          provider: resultProvider,
          compareBoth,
          timingSource: "real",
          fullText,
          lang: nextLang,
          analysisPayload: nextPayload
        }));
      } catch {}
    } catch (error) {
      if (isMissingApiKeyError(error)) {
        promptForApiKey((error as any).provider || provider);
      } else {
        showToast((error as Error).message || (nextLang === "ko" ? "언어 변경 재분석 실패" : "Failed to re-analyze in selected language"));
      }
      setStatus("completed");
    }
  };

  const handleLanguageToggle = () => {
    const generatedText = analysisResult
      ? [
          ...(analysisResult.executiveSummary || []),
          ...(analysisResult.keyPoints || []),
          analysisResult.personaBrief?.child,
          analysisResult.personaBrief?.senior,
          analysisResult.personaBrief?.general,
          analysisResult.personaBrief?.expert,
          ...(analysisResult.risks || []).flatMap((risk) => [risk.title, risk.plainExplanation, risk.whyItMatters]),
          ...(analysisResult.moneyItems || []).map((money) => money.description),
          ...(analysisResult.timeline || []).map((time) => time.meaning),
          ...(analysisResult.actions || []).flatMap((action) => [action.task, action.reason])
        ].filter(Boolean).join("\n")
      : "";
    const resultLooksKorean = /[가-힣]/.test(generatedText);
    const nextLang = lang === "en" && resultLooksKorean ? "en" : lang === "ko" ? "en" : "ko";
    void rerunAnalysisForLanguage(nextLang);
  };

  const handleReset = () => {
    setStatus("idle");
    setFileName("");
    setPageCount(0);
    setAgentDurations(undefined);
    setAnalysisResult(null);
    setLastAnalysisPayload(null);
    setFullText("");
    try { sessionStorage.removeItem("cerebras_doclens_session"); } catch {}
  };

  return (
    <div className={`min-h-screen bg-canvas text-ink flex flex-col selection:bg-primary selection:text-white relative transition-colors duration-300 ${theme === "dark" ? "dark" : ""}`}>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {showApiKeySettings && (
        <div className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm flex items-start justify-center px-4 pt-24 font-sans">
          <div className="w-full max-w-lg rounded-2xl border border-hairline bg-surface-card text-ink shadow-2xl p-5 animate-scale-up">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-serif text-xl text-ink">{lang === "ko" ? "API 키 등록" : "API key settings"}</h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {lang === "ko"
                    ? "키는 이 브라우저 localStorage에만 저장되고, 분석 요청 시에만 서버로 전달됩니다."
                    : "Keys are stored only in this browser localStorage and sent to the server only for analysis requests."}
                </p>
              </div>
              <button
                onClick={() => setShowApiKeySettings(false)}
                className="text-muted hover:text-ink text-sm px-2 py-1 rounded-md hover:bg-surface-soft transition"
              >
                Esc
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Cerebras API Key</span>
                <input
                  type="password"
                  value={apiKeys.cerebras}
                  onChange={(event) => setApiKeys((prev) => ({ ...prev, cerebras: event.target.value }))}
                  placeholder="csk-..."
                  className="mt-1 w-full rounded-lg border border-hairline bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary/60"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">OpenAI GPT-4.1 API Key</span>
                <input
                  type="password"
                  value={apiKeys.openai}
                  onChange={(event) => setApiKeys((prev) => ({ ...prev, openai: event.target.value }))}
                  placeholder="sk-..."
                  className="mt-1 w-full rounded-lg border border-hairline bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary/60"
                />
              </label>
            </div>

            <div className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-muted leading-relaxed">
              {lang === "ko"
                ? "안심하세요. 입력한 키는 서버에 저장하지 않고 이 브라우저에만 보관됩니다. 그래도 걱정된다면 테스트용 API 키를 만들어 사용해 본 뒤, 데모가 끝나면 바로 폐기하세요."
                : "Your keys are not saved on our server; they stay in this browser only. If you are still concerned, create a temporary test API key, try the demo, then revoke it right away."}
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={clearApiKeys}
                className="px-4 py-2 rounded-lg border border-hairline text-sm text-muted hover:text-error-red hover:bg-surface-soft transition"
              >
                {lang === "ko" ? "저장된 키 삭제" : "Clear saved keys"}
              </button>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowApiKeySettings(false)}
                  className="px-4 py-2 rounded-lg border border-hairline text-sm text-muted hover:text-ink hover:bg-surface-soft transition"
                >
                  {lang === "ko" ? "취소" : "Cancel"}
                </button>
                <button
                  onClick={saveApiKeys}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition"
                >
                  {lang === "ko" ? "저장" : "Save keys"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner Accent strip (Anthropic minimal coral highlight) */}
      <div className="h-1 bg-primary w-full" />

      {/* Header bar (Pinned Cream Nav Bar) */}
      <header className="border-b border-hairline bg-canvas/80 backdrop-blur-md sticky top-0 z-50 transition duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleReset}>
            {/* Custom SVG logo: Sheet of paper with horizontal simplification lines and a sparkle dot */}
            <svg className="w-5 h-5 text-primary stroke-primary fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 13h8M8 17h5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="15" cy="17" r="1.5" className="fill-primary" />
            </svg>
            <span className="font-sans text-lg font-bold text-ink tracking-tight">
              {t.appName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle Button */}
            <button
              onClick={handleLanguageToggle}
              className="px-2.5 py-1.5 rounded-lg border border-hairline bg-surface-card hover:bg-surface-soft hover:border-primary/40 text-ink text-xs font-semibold transition duration-200 cursor-pointer flex items-center justify-center font-sans"
              title={lang === "ko" ? "Switch to English" : "한국어 전환"}
            >
              {lang === "ko" ? "EN" : "KO"}
            </button>

            <button
              onClick={() => setShowApiKeySettings(true)}
              className={`p-2 rounded-lg border border-hairline bg-surface-card hover:bg-surface-soft hover:border-primary/40 text-ink transition duration-200 cursor-pointer flex items-center justify-center relative ${hasCerebrasUserKey || hasOpenAIUserKey ? "border-primary/40" : ""}`}
              title={lang === "ko" ? "API 키 등록" : "API key settings"}
            >
              <KeyRound className="w-4 h-4 text-ink" />
              {(hasCerebrasUserKey || hasOpenAIUserKey) && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent-teal border border-canvas" />
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-hairline bg-surface-card hover:bg-surface-soft hover:border-primary/40 text-ink transition duration-200 cursor-pointer flex items-center justify-center"
              title="테마 전환"
            >
              {theme === "light" ? (
                /* Moon Icon for Dark Mode */
                <svg className="w-4 h-4 text-ink fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                /* Sun Icon for Light Mode */
                <svg className="w-4 h-4 text-ink fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
            </button>

            <div className="flex items-center p-0.5 rounded-lg border border-hairline bg-surface-card font-sans text-xs">
              <button
                onClick={() => { setCompareBoth(false); setProvider("cerebras"); }}
                className={`px-2.5 py-1.5 rounded-md font-semibold transition duration-200 cursor-pointer flex items-center gap-1.5 ${
                  !compareBoth && provider === "cerebras"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
                title="Cerebras (Ultra-Fast Inference)"
              >
                <Zap className={`w-3.5 h-3.5 ${!compareBoth && provider === "cerebras" ? "fill-white text-white" : "text-primary"}`} />
                <span>Cerebras</span>
              </button>
              <button
                onClick={() => { setCompareBoth(false); setProvider("openai"); }}
                className={`px-2.5 py-1.5 rounded-md font-semibold transition duration-200 cursor-pointer flex items-center gap-1.5 ${
                  !compareBoth && provider === "openai"
                    ? "bg-accent-teal text-white shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
                title="GPT-4.1 (Baseline Latency)"
              >
                <span>GPT-4.1</span>
              </button>
              <button
                onClick={() => { setCompareBoth(true); setProvider("cerebras"); }}
                className={`px-2.5 py-1.5 rounded-md font-semibold transition duration-200 cursor-pointer flex items-center gap-1.5 ${
                  compareBoth
                    ? "bg-surface-dark text-on-dark shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
                title="Run Cerebras and GPT-4.1 together for measured speed comparison"
              >
                <span>{lang === "ko" ? "비교" : "Compare"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-6 md:py-10 flex flex-col justify-center relative z-10">

        {status === "idle" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center animate-fade-in py-2">
            {/* Left Column: Hero Text + Upload Zone */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="space-y-3.5">
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[11px] font-semibold font-sans w-fit">
                  <Sparkles className="w-3 h-3" /> {t.heroBadge}
                </div>
                <h1 className="text-3xl md:text-4xl xl:text-5xl font-serif font-normal text-ink tracking-tight leading-tight">
                  {t.heroTitle1} <br />
                  <span className="text-primary font-normal">
                    {t.heroTitle2}
                  </span>
                </h1>
                <p className="text-sm md:text-base text-body leading-relaxed font-sans max-w-xl">
                  {t.heroSubtitle}
                </p>
              </div>

              <UploadZone
                onFileSelect={handleFileSelect}
                onSelectSample={handleSelectSample}
                isLoading={false}
                layoutMode="compact"
                lang={lang}
              />
            </div>

            {/* Right Column: Vertically stacked sample documents */}
            <div className="lg:col-span-5 space-y-4 border-l border-hairline pl-0 lg:pl-8 h-full flex flex-col justify-center">
              <UploadZone
                onFileSelect={handleFileSelect}
                onSelectSample={handleSelectSample}
                isLoading={false}
                layoutMode="samples-only"
                lang={lang}
              />
            </div>
          </div>
        )}

        {status === "parsing" && (
          <div className="flex flex-col items-center justify-center space-y-4 py-20 animate-fade-in font-sans">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-surface-card border-t-primary animate-spin" />
              <FileText className="w-6 h-6 text-primary absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-ink text-base">{t.extractingText}</h3>
              <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
                {lang === "ko"
                  ? `업로드한 PDF 파일 "${fileName}"에서 페이지별 텍스트 데이터를 분석 및 추출하고 있습니다.`
                  : `Extracting and parsing text data page-by-page from the uploaded PDF file "${fileName}".`}
              </p>
              {pageCount > 0 && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-accent-teal">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {lang === "ko" ? `총 ${pageCount}페이지 추출 완료` : `${pageCount} pages extracted`}
                </div>
              )}
            </div>
          </div>
        )}

        {status === "analyzing" && (
          <ProgressIndicator
            durations={agentDurations}
            onComplete={() => setStatus("completed")}
            lang={lang}
            provider={compareBoth ? "cerebras" : provider}
          />
        )}

        {status === "completed" && analysisResult && (
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          }>
            <ResultDashboard
              result={analysisResult}
              overallDuration={overallDuration}
              onReset={handleReset}
              fullText={fullText}
              lang={lang}
              provider={provider}
              agentDurations={agentDurations}
              timingSource={timingSource}
              apiKeys={getRequestApiKeys()}
              onApiKeyRequired={promptForApiKey}
            />
          </Suspense>
        )}

      </main>

      {/* Footer (Dark Navy Pre-footer pacing) */}
      <footer className="border-t border-white/5 py-8 bg-surface-dark text-on-dark-soft text-center text-xs font-mono relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-primary stroke-primary fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 13h8M8 17h5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="15" cy="17" r="1.5" className="fill-primary" />
            </svg>
            <span className="font-sans text-sm text-on-dark font-semibold">{t.appName}</span>
          </div>
          <p>{t.footerPower}</p>
        </div>
      </footer>
    </div>
  );
}
