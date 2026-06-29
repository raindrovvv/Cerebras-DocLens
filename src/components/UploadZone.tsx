"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Scale, ShieldAlert, Sparkles, Activity } from "lucide-react";
import { translations } from "@/services/translations";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onSelectSample: (type: "insurance" | "legal" | "medical" | "aflac") => void;
  isLoading: boolean;
  layoutMode?: "full" | "compact" | "samples-only";
  lang: "ko" | "en";
}

export default function UploadZone({ 
  onFileSelect, 
  onSelectSample, 
  isLoading, 
  layoutMode = "full",
  lang
}: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = translations[lang];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        onFileSelect(file);
      } else {
        alert(lang === "ko" ? "PDF 또는 이미지 파일만 업로드할 수 있습니다." : "Only PDF or image files are supported.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Render Drag & Drop Zone only
  const renderDragZone = (isCompact: boolean) => (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={triggerFileInput}
      className={`relative group cursor-pointer border rounded-2xl text-center transition-all duration-300 ${
        isCompact ? "py-8 px-6 border-dashed" : "p-12 border-solid"
      } ${
        isDragActive
          ? "border-primary bg-surface-card scale-[1.005]"
          : "border-hairline bg-surface-card/60 hover:border-primary hover:bg-surface-card hover:shadow-sm"
      } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />
      
      <div className={`relative z-10 flex flex-col items-center justify-center ${isCompact ? "space-y-3" : "space-y-5"}`}>
        <div className={`bg-canvas rounded-xl border border-hairline group-hover:border-primary/40 group-hover:scale-105 transition-all duration-300 ${
          isCompact ? "p-2.5" : "p-4"
        }`}>
          <UploadCloud className={`${isCompact ? "w-7 h-7" : "w-10 h-10"} text-primary`} />
        </div>
        <div className="space-y-1">
          <h3 className={`font-sans font-semibold text-ink ${isCompact ? "text-base" : "text-xl"}`}>
            {t.uploadTitle}
          </h3>
          <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
            {t.uploadSubtitle}
          </p>
        </div>
      </div>
    </div>
  );

  // Render vertical list of samples for split layout
  const renderVerticalSamples = () => (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5 font-sans">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> {t.samplesTitle}
        </h4>
      </div>
      
      <div className="flex flex-col gap-3">
        {/* Cancer Insurance Policy */}
        <button
          onClick={() => onSelectSample("insurance")}
          disabled={isLoading}
          className="flex items-center text-left p-4 rounded-xl border border-hairline bg-canvas hover:border-primary hover:bg-surface-soft transition-all duration-300 group cursor-pointer w-full"
        >
          <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-lg mr-3.5 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
            <ShieldAlert className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h5 className="font-sans text-sm font-semibold text-ink leading-tight group-hover:text-primary transition-colors truncate">
              {t.sampleInsTitle}
            </h5>
            <p className="text-xs text-body mt-1 leading-relaxed truncate">
              {t.sampleInsDesc}
            </p>
          </div>
          <span className="text-xs font-semibold text-primary ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
            {t.trySampleBtn}
          </span>
        </button>

        {/* Aflac Cancer Policy Summary (US) */}
        <button
          onClick={() => onSelectSample("aflac")}
          disabled={isLoading}
          className="flex items-center text-left p-4 rounded-xl border border-hairline bg-canvas hover:border-primary hover:bg-surface-soft transition-all duration-300 group cursor-pointer w-full"
        >
          <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-lg mr-3.5 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
            <ShieldAlert className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h5 className="font-sans text-sm font-semibold text-ink leading-tight group-hover:text-primary transition-colors truncate">
              {t.sampleAflacTitle}
            </h5>
            <p className="text-xs text-body mt-1 leading-relaxed truncate">
              {t.sampleAflacDesc}
            </p>
          </div>
          <span className="text-xs font-semibold text-primary ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
            {t.trySampleBtn}
          </span>
        </button>

        {/* Legal Rental Agreement */}
        <button
          onClick={() => onSelectSample("legal")}
          disabled={isLoading}
          className="flex items-center text-left p-4 rounded-xl border border-hairline bg-canvas hover:border-primary hover:bg-surface-soft transition-all duration-300 group cursor-pointer w-full"
        >
          <div className="p-2.5 bg-accent-teal/10 border border-accent-teal/20 text-accent-teal rounded-lg mr-3.5 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
            <Scale className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h5 className="font-sans text-sm font-semibold text-ink leading-tight group-hover:text-primary transition-colors truncate">
              {t.sampleLegTitle}
            </h5>
            <p className="text-xs text-body mt-1 leading-relaxed truncate">
              {t.sampleLegDesc}
            </p>
          </div>
          <span className="text-xs font-semibold text-primary ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
            {t.trySampleBtn}
          </span>
        </button>

        {/* Medical Surgery Consent */}
        <button
          onClick={() => onSelectSample("medical")}
          disabled={isLoading}
          className="flex items-center text-left p-4 rounded-xl border border-hairline bg-canvas hover:border-primary hover:bg-surface-soft transition-all duration-300 group cursor-pointer w-full"
        >
          <div className="p-2.5 bg-accent-amber/10 border border-accent-amber/20 text-accent-amber rounded-lg mr-3.5 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
            <Activity className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h5 className="font-sans text-sm font-semibold text-ink leading-tight group-hover:text-primary transition-colors truncate">
              {t.sampleMedTitle}
            </h5>
            <p className="text-xs text-body mt-1 leading-relaxed truncate">
              {t.sampleMedDesc}
            </p>
          </div>
          <span className="text-xs font-semibold text-primary ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
            {t.trySampleBtn}
          </span>
        </button>
      </div>
    </div>
  );

  // Conditional Rendering based on layoutMode
  if (layoutMode === "compact") {
    return renderDragZone(true);
  }

  if (layoutMode === "samples-only") {
    return renderVerticalSamples();
  }

  // Default "full" mode (vertically stacked with 4 columns grid for samples)
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {renderDragZone(false)}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5 font-sans">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> {t.samplesTitle}
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cancer Insurance Policy */}
          <button
            onClick={() => onSelectSample("insurance")}
            disabled={isLoading}
            className="flex flex-col text-left p-6 rounded-xl border border-hairline bg-canvas hover:border-primary hover:bg-surface-soft transition-all duration-300 group cursor-pointer h-full"
          >
            <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-lg mr-4 group-hover:scale-105 transition-transform duration-300 mb-4 w-fit">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h5 className="font-sans text-lg text-ink font-semibold leading-tight group-hover:text-primary transition-colors">
                  {t.sampleInsTitle}
                </h5>
                <p className="text-sm text-body mt-2 leading-relaxed line-clamp-3">
                  {t.sampleInsDesc}
                </p>
              </div>
              <span className="inline-flex items-center text-sm font-semibold text-primary mt-4 group-hover:translate-x-1 transition-transform">
                {t.trySampleBtn}
              </span>
            </div>
          </button>

          {/* Aflac US Cancer Policy */}
          <button
            onClick={() => onSelectSample("aflac")}
            disabled={isLoading}
            className="flex flex-col text-left p-6 rounded-xl border border-hairline bg-canvas hover:border-primary hover:bg-surface-soft transition-all duration-300 group cursor-pointer h-full"
          >
            <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-lg mr-4 group-hover:scale-105 transition-transform duration-300 mb-4 w-fit">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h5 className="font-sans text-lg text-ink font-semibold leading-tight group-hover:text-primary transition-colors">
                  {t.sampleAflacTitle}
                </h5>
                <p className="text-sm text-body mt-2 leading-relaxed line-clamp-3">
                  {t.sampleAflacDesc}
                </p>
              </div>
              <span className="inline-flex items-center text-sm font-semibold text-primary mt-4 group-hover:translate-x-1 transition-transform">
                {t.trySampleBtn}
              </span>
            </div>
          </button>

          {/* Legal Rental Agreement */}
          <button
            onClick={() => onSelectSample("legal")}
            disabled={isLoading}
            className="flex flex-col text-left p-6 rounded-xl border border-hairline bg-canvas hover:border-primary hover:bg-surface-soft transition-all duration-300 group cursor-pointer h-full"
          >
            <div className="p-3 bg-accent-teal/10 border border-accent-teal/20 text-accent-teal rounded-lg mr-4 group-hover:scale-105 transition-transform duration-300 mb-4 w-fit">
              <Scale className="w-5 h-5" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h5 className="font-sans text-lg text-ink font-semibold leading-tight group-hover:text-primary transition-colors">
                  {t.sampleLegTitle}
                </h5>
                <p className="text-sm text-body mt-2 leading-relaxed line-clamp-3">
                  {t.sampleLegDesc}
                </p>
              </div>
              <span className="inline-flex items-center text-sm font-semibold text-primary mt-4 group-hover:translate-x-1 transition-transform">
                {t.trySampleBtn}
              </span>
            </div>
          </button>

          {/* Medical Surgery Consent */}
          <button
            onClick={() => onSelectSample("medical")}
            disabled={isLoading}
            className="flex flex-col text-left p-6 rounded-xl border border-hairline bg-canvas hover:border-primary hover:bg-surface-soft transition-all duration-300 group cursor-pointer h-full"
          >
            <div className="p-3 bg-accent-amber/10 border border-accent-amber/20 text-accent-amber rounded-lg mr-4 group-hover:scale-105 transition-transform duration-300 mb-4 w-fit">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h5 className="font-sans text-lg text-ink font-semibold leading-tight group-hover:text-primary transition-colors">
                  {t.sampleMedTitle}
                </h5>
                <p className="text-sm text-body mt-2 leading-relaxed line-clamp-3">
                  {t.sampleMedDesc}
                </p>
              </div>
              <span className="inline-flex items-center text-sm font-semibold text-primary mt-4 group-hover:translate-x-1 transition-transform">
                {t.trySampleBtn}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
