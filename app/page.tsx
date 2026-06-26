"use client";

import { useState, useCallback } from "react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { SearchBar } from "@/components/SearchBar";
import { AgentProgressPanel } from "@/components/AgentProgressPanel";
import { InvestmentVerdict } from "@/components/InvestmentVerdict";
import { FinancialMetricsGrid } from "@/components/FinancialMetricsGrid";
import { NewsTimeline } from "@/components/NewsTimeline";
import { RiskRadar } from "@/components/RiskRadar";
import { ReasoningAccordion } from "@/components/ReasoningAccordion";
import { ErrorBanner } from "@/components/ErrorBanner";

// Dashboard Home Components
import { QuickStats } from "@/components/home/QuickStats";
import { HowItWorks } from "@/components/home/HowItWorks";
import { RecentReports } from "@/components/home/RecentReports";
import { WatchlistWidget } from "@/components/home/WatchlistWidget";
import { InsightsCard } from "@/components/home/InsightsCard";
import { PromoCard } from "@/components/home/PromoCard";
import { HeroIllustration } from "@/components/home/HeroIllustration";

import { Clock, ArrowLeft, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────
// Processing Time Badge
// ────────────────────────────────────────────────────────────
function ProcessingTimeBadge({ ms }: { ms: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[var(--text-3)]">
      <Clock size={12} />
      <span>Analysis completed in {(ms / 1000).toFixed(1)}s</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────
export default function HomePage() {
  const { status, steps, report, error, analyze, reset } = useAnalysis();
  const [lastCompany, setLastCompany] = useState<string>("");

  const handleSubmit = useCallback(
    (company: string) => {
      setLastCompany(company);
      analyze(company);
    },
    [analyze]
  );

  const handleRetry = useCallback(() => {
    if (lastCompany) analyze(lastCompany);
  }, [lastCompany, analyze]);

  const isActive = status === "loading" || status === "streaming";
  const isDone = status === "complete" && report !== null;
  const isError = status === "error";

  return (
    <main className="animate-fade-in">
      {/* Error Banner */}
      {isError && error && (
        <div className="max-w-2xl mx-auto mb-6">
          <ErrorBanner
            message={error}
            onDismiss={reset}
            onRetry={handleRetry}
          />
        </div>
      )}

      {/* Warnings from report */}
      {isDone && report?.hasWarnings && (
        <div className="max-w-2xl mx-auto mb-6 space-y-2">
          {report.warnings.map((w, i) => (
            <div
              key={i}
              className="card border-amber-500/20 bg-amber-500/5 px-4 py-3"
            >
              <p className="text-amber-300 text-sm">⚠️ {w}</p>
            </div>
          ))}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          1. IDLE (LANDING) STATE — SaaS Workspace Dashboard
          ──────────────────────────────────────────────────────────── */}
      {!isActive && !isDone && (
        <div className="space-y-6">
          {/* Hero Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 border-b border-[var(--border)]">
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold font-display tracking-tight text-white">
                  Investment Research Workspace
                </h1>
                <p className="text-[var(--text-3)] text-sm max-w-xl leading-relaxed">
                  Deploy a multi-agent orchestration pipeline powered by Gemini 2.5 Flash and LangGraph.
                  Analyze fundamentals, real-time news sentiment, and risk profiles to generate structured recommendations.
                </p>
              </div>
              <div className="max-w-xl">
                <SearchBar onSubmit={handleSubmit} isLoading={isActive} />
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <HeroIllustration />
            </div>
          </div>

          {/* Quick Stats */}
          <QuickStats />

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              <RecentReports onAnalyze={handleSubmit} />
              <HowItWorks />
            </div>

            {/* Right Column (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              <WatchlistWidget onAnalyze={handleSubmit} />
              <InsightsCard />
              <PromoCard />
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          2. LOADING / STREAMING STATE — Live Agent Workflow
          ──────────────────────────────────────────────────────────── */}
      {isActive && (
        <div className="max-w-4xl mx-auto py-12 space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold text-white">
              Analyzing <span className="gradient-text">{lastCompany}</span>
            </h2>
            <p className="text-xs text-[var(--text-4)] font-mono">
              Initiating Gemini reasoning agents & data connectors...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center card p-6 bg-subtle">
            <div className="md:col-span-7">
              <AgentProgressPanel steps={steps} isActive={isActive} />
            </div>
            <div className="md:col-span-5 flex justify-center">
              <HeroIllustration />
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          3. COMPLETE STATE — Investment Analysis Report
          ──────────────────────────────────────────────────────────── */}
      {isDone && report && (
        <div className="space-y-6 animate-fade-in">
          {/* Workspace Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center py-4 border-b border-[var(--border)]">
            <div className="flex-1 w-full max-w-xl">
              <SearchBar onSubmit={handleSubmit} isLoading={isActive} compact={true} />
            </div>
            <button
              onClick={reset}
              className="btn btn-secondary btn-sm flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              Back to Dashboard
            </button>
          </div>

          {/* Report Metadata */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text-3)]">
              Analysis Results for{" "}
              <span className="text-white font-display font-bold">{report.companyName}</span>
            </h2>
            <ProcessingTimeBadge ms={report.processingTimeMs} />
          </div>

          {/* Results Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column — Verdict + Reasoning + Progress */}
            <div className="xl:col-span-1 space-y-6">
              {/* Activity feed representation of completed graph */}
              <AgentProgressPanel steps={steps} isActive={false} />

              {/* Verdict Ring and Details Card */}
              <InvestmentVerdict
                report={report.committee}
                profile={report.profile}
              />

              {/* Accordion summary list */}
              <ReasoningAccordion report={report.committee} />
            </div>

            {/* Right Column — Financials, News, Risk */}
            <div className="xl:col-span-2 space-y-6">
              <FinancialMetricsGrid data={report.financials} />
              <NewsTimeline news={report.news} />
              <RiskRadar risk={report.risk} />
            </div>
          </div>

          {/* Footer research disclaimer */}
          <div className="pt-8 pb-4 text-center">
            <p className="text-xs text-[var(--text-4)] max-w-2xl mx-auto leading-relaxed">
              This analysis is generated by AI agents for educational and research purposes only.
              It does not constitute financial advice. Always conduct your own due diligence
              before making investment decisions.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
