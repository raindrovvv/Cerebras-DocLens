"use client";

import React, { useState, useEffect } from "react";
import { 
  Loader2, CheckCircle2, Cpu, Zap, FileText, 
  ShieldAlert, Coins, Calendar, ListTodo, Sparkles 
} from "lucide-react";
import { translations } from "@/services/translations";

interface AgentStatus {
  key: string;
  status: "idle" | "running" | "completed" | "failed";
  duration?: number;
}

interface ProgressIndicatorProps {
  durations?: Record<string, number>;
  isSample?: boolean;
  onComplete: () => void;
  lang: "ko" | "en";
  provider?: "cerebras" | "openai";
}

const INITIAL_AGENTS: AgentStatus[] = [
  { key: "summary", status: "idle" },
  { key: "risks", status: "idle" },
  { key: "money", status: "idle" },
  { key: "timeline", status: "idle" },
  { key: "actions", status: "idle" },
  { key: "persona", status: "idle" }
];

export default function ProgressIndicator({ 
  durations, 
  isSample = false, 
  onComplete,
  lang,
  provider = "cerebras"
}: ProgressIndicatorProps) {
  const [agents, setAgents] = useState<AgentStatus[]>(INITIAL_AGENTS);
  const [isAllCompleted, setIsAllCompleted] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [elapsed, setElapsed] = useState<number>(0);

  const t = translations[lang];

  const getAgentLabel = (key: string) => {
    switch (key) {
      case "summary": return { name: t.agentNames.summary, role: t.agentRoles.summary };
      case "risks": return { name: t.agentNames.risks, role: t.agentRoles.risks };
      case "money": return { name: t.agentNames.money, role: t.agentRoles.money };
      case "timeline": return { name: t.agentNames.timeline, role: t.agentRoles.timeline };
      case "actions": return { name: t.agentNames.actions, role: t.agentRoles.actions };
      case "persona": return { name: t.agentNames.persona, role: t.agentRoles.persona };
      default: return { name: key, role: "" };
    }
  };

  const getAgentIcon = (key: string, className: string) => {
    switch (key) {
      case "summary": return <FileText className={className} />;
      case "risks": return <ShieldAlert className={className} />;
      case "money": return <Coins className={className} />;
      case "timeline": return <Calendar className={className} />;
      case "actions": return <ListTodo className={className} />;
      case "persona": return <Sparkles className={className} />;
      default: return <Cpu className={className} />;
    }
  };

  const getAgentColorClass = (key: string) => {
    switch (key) {
      case "summary": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "risks": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "money": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "timeline": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      case "actions": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "persona": return "text-pink-500 bg-pink-500/10 border-pink-500/20";
      default: return "text-primary bg-primary/10 border-primary/20";
    }
  };

  // Live timer for overall elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      if (agents.every(a => a.status === "completed")) {
        clearInterval(timer);
        return;
      }
      setElapsed((Date.now() - startTime) / 1000);
    }, 50);

    return () => clearInterval(timer);
  }, [agents, startTime]);

  // Handle progress stages
  useEffect(() => {
    if (!durations) {
      setAgents(prev => prev.map(a => ({ ...a, status: "running" })));
      return;
    }

    const keys = Object.keys(durations);
    const sortedKeys = [...keys].sort((a, b) => (durations[a] || 0) - (durations[b] || 0));

    let index = 0;
    const interval = setInterval(() => {
      if (index >= sortedKeys.length) {
        clearInterval(interval);
        setIsAllCompleted(true);
        return;
      }

      const currentKey = sortedKeys[index];
      const actualDuration = durations[currentKey] || 0;

      setAgents(prev =>
        prev.map(a => {
          if (a.key === currentKey || (currentKey === "money" && a.key === "money") || (currentKey === "persona" && a.key === "persona")) {
            return {
              ...a,
              status: "completed",
              duration: actualDuration
            };
          }
          return a;
        })
      );
      index++;
    }, 250);

    return () => clearInterval(interval);
  }, [durations, onComplete]);

  const getTitleText = () => {
    if (isAllCompleted) {
      return lang === "ko" ? "✓ 모든 에이전트 분석 완료" : "✓ All Agents Completed";
    }
    if (provider === "openai") {
      return lang === "ko" ? "GPT-4.1 순차 추론 에이전트 가동 중" : "GPT-4.1 Sequential Agent Pipeline";
    }
    return lang === "ko" ? "Cerebras 초고속 병렬 멀티에이전트 오케스트레이터" : "Cerebras Ultra-Fast Parallel Multi-Agent Orchestrator";
  };

  const getSubTitleText = () => {
    if (provider === "openai") {
      return lang === "ko"
        ? "GPT-4.1 모델이 순차적으로 에이전트 태스크를 해독하고 있습니다."
        : "GPT-4.1 is resolving agent tasks one-by-one.";
    }
    return lang === "ko"
      ? "Gemma-4-31B Instruct 모델이 6개의 전문 에이전트를 실시간 병렬 가동 중입니다."
      : "Gemma-4-31B Instruct is concurrently executing 6 specialized document intelligence agents.";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-2xl bg-surface-dark border border-white/5 shadow-2xl space-y-8 animate-scale-up text-on-dark font-sans">
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl animate-pulse ${provider === "cerebras" ? "bg-primary/10 border border-primary/20 text-primary" : "bg-amber-500/10 border border-amber-500/20 text-amber-500"}`}>
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-normal text-on-dark flex items-center gap-1.5">
              {getTitleText()}
            </h3>
            <p className="text-xs text-on-dark-soft font-normal mt-0.5">
              {getSubTitleText()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end font-mono">
          <div className={`flex items-center gap-1.5 font-bold text-2xl ${isAllCompleted ? "text-accent-teal" : "animate-pulse " + (provider === "cerebras" ? "text-primary" : "text-amber-500")}`}>
            <Zap className={`w-5 h-5 ${isAllCompleted ? "fill-accent-teal text-accent-teal" : provider === "cerebras" ? "fill-primary text-primary" : "text-amber-500"}`} />
            {elapsed.toFixed(2)}s
          </div>
          <span className="text-[10px] text-on-dark-soft uppercase tracking-wider font-semibold mt-1">
            {isAllCompleted ? (lang === "ko" ? "총 소요 시간" : "TOTAL TIME") : t.elapsed}
          </span>
        </div>
      </div>

      {/* Agents 2x3 Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const { name, role } = getAgentLabel(agent.key);
          const colorClass = getAgentColorClass(agent.key);
          const isActive = agent.status === "running" || agent.status === "completed";
          
          return (
            <div
              key={agent.key}
              className={`flex flex-col justify-between p-5 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                agent.status === "completed"
                  ? "bg-surface-dark-elevated/40 border-white/10"
                  : agent.status === "running"
                  ? `bg-surface-dark-soft border-primary/30 shadow-[0_0_15px_rgba(204,120,92,0.1)]`
                  : "bg-transparent border-white/5 opacity-30"
              }`}
            >
              {/* Pulse Scanner Line for Active Agent */}
              {agent.status === "running" && (
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
              )}
              
              <div className="space-y-4">
                {/* Agent Header (Icon & Name) */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border flex-shrink-0 ${colorClass}`}>
                    {getAgentIcon(agent.key, "w-4.5 h-4.5")}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-on-dark leading-snug">
                      {name}
                    </h4>
                    <p className="text-[9px] text-muted-soft font-mono uppercase tracking-wider mt-0.5">
                      {agent.key}_agent
                    </p>
                  </div>
                </div>

                {/* Agent Description */}
                <p className="text-[11px] text-on-dark-soft leading-relaxed min-h-[44px]">
                  {role}
                </p>
              </div>

              {/* Status Footer */}
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-soft">
                  STATUS
                </span>
                
                <div className="flex items-center gap-1.5">
                  {agent.status === "completed" ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-accent-teal font-mono">
                        {agent.duration?.toFixed(2)}s
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-accent-teal" />
                    </div>
                  ) : agent.status === "running" ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-primary font-mono animate-pulse">
                        {lang === "ko" ? "분석 중..." : "RUNNING"}
                      </span>
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    </div>
                  ) : (
                    <span className="text-[10px] text-on-dark-soft/50 font-mono">
                      {lang === "ko" ? "대기 중" : "IDLE"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Results CTA — shown after all agents complete */}
      {isAllCompleted && (
        <div className="flex flex-col items-center gap-3 pt-2 animate-scale-up">
          <p className="text-xs text-on-dark-soft">
            {lang === "ko"
              ? "6개 에이전트의 분석이 모두 완료되었습니다. 결과를 확인해보세요!"
              : "All 6 agents have finished analysis. Ready to explore the results!"}
          </p>
          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-on-dark bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4" />
            {lang === "ko" ? "분석 결과 보기" : "View Results"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
