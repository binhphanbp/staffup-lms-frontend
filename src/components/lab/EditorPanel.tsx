'use client';

import React from 'react';
import {
  CODE_LAB_LANGUAGES,
  type CodeLabEvaluationResult,
  type CodeLabLanguage,
  type CodeLabOverallStatus,
  type CodeLabSeverity,
  type CodeLabDiagnosticType,
} from '@/services/code-lab.service';

interface EditorPanelProps {
  code: string;
  onCodeChange: (code: string) => void;
  language: CodeLabLanguage;
  onLanguageChange: (lang: CodeLabLanguage) => void;
  isRunning: boolean;
  evaluation: CodeLabEvaluationResult | null;
  errorMessage: string | null;
  consoleTab: 'tests' | 'result';
  setConsoleTab: (tab: 'tests' | 'result') => void;
  onRunCode: () => void;
  testCaseCount: number;
}

// ─── Status / severity styling maps ─────────────────────────────────────────

const STATUS_LABEL: Record<CodeLabOverallStatus, string> = {
  passed: 'Đạt',
  partial: 'Đạt một phần',
  failed: 'Chưa đạt',
  error: 'Code lỗi',
};

const STATUS_BADGE: Record<CodeLabOverallStatus, string> = {
  passed: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40',
  partial: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/40',
  failed: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/40',
  error: 'bg-rose-700/20 text-rose-300 ring-1 ring-rose-500/40',
};

const STATUS_ICON: Record<CodeLabOverallStatus, string> = {
  passed: 'fa-circle-check',
  partial: 'fa-circle-half-stroke',
  failed: 'fa-circle-xmark',
  error: 'fa-triangle-exclamation',
};

const SEVERITY_BADGE: Record<CodeLabSeverity, string> = {
  high: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/40',
  medium: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/40',
  low: 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/30',
};

const DIAG_TYPE_ICON: Record<CodeLabDiagnosticType, string> = {
  error: 'fa-circle-xmark text-rose-400',
  warning: 'fa-triangle-exclamation text-amber-300',
  suggestion: 'fa-lightbulb text-sky-300',
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function ScoreGauge({ score, status }: { score: number; status: CodeLabOverallStatus }) {
  const ringColor =
    status === 'passed'
      ? 'stroke-emerald-400'
      : status === 'partial'
        ? 'stroke-amber-400'
        : status === 'error'
          ? 'stroke-rose-500'
          : 'stroke-rose-400';
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          className="stroke-white/10"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          className={`${ringColor} transition-[stroke-dashoffset] duration-500`}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="text-center">
        <div className="text-xl font-bold text-white">{score}</div>
        <div className="text-[9px] tracking-widest text-white/50 uppercase">/ 100</div>
      </div>
    </div>
  );
}

function ResultPanel({ evaluation }: { evaluation: CodeLabEvaluationResult }) {
  const passedCount = evaluation.testResults.filter((t) => t.passed).length;
  const totalCount = evaluation.testResults.length;
  return (
    <div className="space-y-4">
      {/* Hero — status + score + summary */}
      <div className="rounded-lg border border-white/5 bg-[#282c34] p-4">
        <div className="flex items-start gap-4">
          <ScoreGauge score={evaluation.score} status={evaluation.overallStatus} />
          <div className="flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_BADGE[evaluation.overallStatus]}`}
              >
                <i className={`fa-solid ${STATUS_ICON[evaluation.overallStatus]} text-[10px]`} />
                {STATUS_LABEL[evaluation.overallStatus]}
              </span>
              {totalCount > 0 && (
                <span className="text-[11px] font-medium text-slate-400">
                  {passedCount}/{totalCount} test cases pass
                </span>
              )}
            </div>
            <p className="text-[12.5px] leading-relaxed text-slate-200">{evaluation.summary}</p>
          </div>
        </div>
      </div>

      {/* Test results */}
      {totalCount > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            <i className="fa-solid fa-vial-circle-check" /> Kết quả test cases
          </div>
          <div className="space-y-2">
            {evaluation.testResults.map((t) => (
              <div
                key={t.testCaseIndex}
                className={`rounded-md border p-3 ${
                  t.passed
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-rose-500/30 bg-rose-500/5'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-100">
                    <i
                      className={`fa-solid ${
                        t.passed ? 'fa-check text-emerald-400' : 'fa-xmark text-rose-400'
                      }`}
                    />
                    Test Case #{t.testCaseIndex + 1}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      t.passed ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {t.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 text-[9px] font-bold tracking-wider text-slate-500 uppercase">
                      Expected
                    </div>
                    <pre className="overflow-x-auto rounded bg-[#1e2227] p-2 font-mono text-[11px] text-amber-200">
                      {t.expectedOutput}
                    </pre>
                  </div>
                  <div>
                    <div className="mb-1 text-[9px] font-bold tracking-wider text-slate-500 uppercase">
                      AI mô phỏng
                    </div>
                    <pre className="overflow-x-auto rounded bg-[#1e2227] p-2 font-mono text-[11px] text-sky-200">
                      {t.simulatedOutput || '(không có output)'}
                    </pre>
                  </div>
                </div>
                <div className="text-[11.5px] leading-relaxed text-slate-300">
                  <i className="fa-solid fa-message mr-1 text-slate-500" />
                  {t.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagnostics */}
      {evaluation.diagnostics.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            <i className="fa-solid fa-magnifying-glass-chart" /> Phân tích chi tiết
          </div>
          <div className="space-y-2">
            {evaluation.diagnostics.map((d, i) => (
              <div
                key={i}
                className="rounded-md border border-white/5 bg-[#282c34] p-3 transition-colors hover:bg-[#2c313a]"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-100">
                    <i className={`fa-solid ${DIAG_TYPE_ICON[d.type]} text-[11px]`} />
                    {d.title}
                  </div>
                  <div className="flex items-center gap-1">
                    {d.lineHint !== null && (
                      <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                        L{d.lineHint}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${SEVERITY_BADGE[d.severity]}`}
                    >
                      {d.severity}
                    </span>
                  </div>
                </div>
                <p className="text-[11.5px] leading-relaxed text-slate-300">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {evaluation.suggestions.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            <i className="fa-solid fa-wand-magic-sparkles text-purple-400" /> Gợi ý cải thiện
          </div>
          <ul className="space-y-1.5">
            {evaluation.suggestions.map((s, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-md border border-purple-500/20 bg-purple-500/5 p-2.5 text-[11.5px] leading-relaxed text-slate-200"
              >
                <i className="fa-solid fa-circle-arrow-right mt-0.5 shrink-0 text-[11px] text-purple-400" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-1 text-[10px] text-slate-500">
        <i className="fa-solid fa-circle-info mr-1" />
        AI mô phỏng (không thực thi code) — kết quả mang tính tham khảo, có thể không khớp 100% với
        runtime thật.
      </div>
    </div>
  );
}

// ─── Main panel ─────────────────────────────────────────────────────────────

export const EditorPanel = ({
  code,
  onCodeChange,
  language,
  onLanguageChange,
  isRunning,
  evaluation,
  errorMessage,
  consoleTab,
  setConsoleTab,
  onRunCode,
  testCaseCount,
}: EditorPanelProps) => {
  const lineNumbersRef = React.useRef<HTMLDivElement | null>(null);
  const lineNumbers = React.useMemo(() => {
    const total = Math.max(20, code.split('\n').length);
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [code]);

  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const failedTestCount = evaluation?.testResults.filter((t) => !t.passed).length ?? 0;

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-[var(--color-code-bg)] md:min-w-[300px]">
      {/* Editor Toolbar */}
      <div className="z-10 flex h-10 flex-shrink-0 items-center justify-between border-b border-black/40 bg-[#21252b] px-3 text-slate-300 shadow-sm">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-code text-sm text-blue-400" aria-hidden />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as CodeLabLanguage)}
            className="cursor-pointer rounded bg-white/5 px-2 py-1 text-[12px] font-medium text-slate-200 transition-colors outline-none hover:bg-white/10 focus:ring-1 focus:ring-blue-400"
          >
            {CODE_LAB_LANGUAGES.map((l) => (
              <option key={l} value={l} className="bg-[#21252b] text-slate-200">
                {l}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className={`flex items-center gap-1.5 rounded border border-white/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1 text-[12px] font-bold text-white transition-all hover:from-blue-500/30 hover:to-purple-500/30 ${isRunning ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          {isRunning ? (
            <i className="fa-solid fa-spinner fa-spin text-[10px]"></i>
          ) : (
            <i className="fa-solid fa-wand-magic-sparkles text-[10px] text-purple-300"></i>
          )}
          <span>{isRunning ? 'Đang phân tích...' : 'Run AI Review'}</span>
        </button>
      </div>

      {/* Editor Area */}
      <div className="relative flex flex-1 overflow-hidden bg-[var(--color-code-bg)] font-mono text-[13px] leading-relaxed text-[var(--color-code-text)]">
        <div
          ref={lineNumbersRef}
          className="w-12 flex-shrink-0 overflow-hidden border-r border-white/5 bg-[#282c34] pt-4 pr-3 text-right font-mono text-[13px] leading-relaxed text-[#4b5263] select-none"
        >
          {lineNumbers.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onScroll={handleEditorScroll}
          spellCheck={false}
          className="dark-scrollbar flex-1 resize-none overflow-auto bg-transparent pt-4 pb-10 pl-4 font-mono text-[13px] leading-relaxed text-[var(--color-code-text)] outline-none"
          placeholder="// Viết code của bạn ở đây..."
        />
      </div>

      {/* Terminal */}
      <div className="z-20 flex h-[40%] flex-shrink-0 flex-col border-t border-black/50 bg-[#1e2227] shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
        <div className="flex border-b border-white/5 bg-[#21252b]">
          <button
            onClick={() => setConsoleTab('tests')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2 text-[12px] transition-colors ${consoleTab === 'tests' ? 'border-primary bg-[#282c34] font-bold text-slate-200' : 'border-transparent font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-vial text-slate-400"></i> Test Cases
          </button>
          <button
            onClick={() => setConsoleTab('result')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2 text-[12px] transition-colors ${consoleTab === 'result' ? 'border-primary bg-[#282c34] font-bold text-slate-200' : 'border-transparent font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-terminal text-slate-400"></i> Kết quả AI
            {evaluation && (
              <span
                className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                  evaluation.overallStatus === 'passed'
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : evaluation.overallStatus === 'partial'
                      ? 'bg-amber-500/15 text-amber-300'
                      : 'bg-rose-500/15 text-rose-300'
                }`}
              >
                {evaluation.overallStatus === 'passed'
                  ? 'pass'
                  : evaluation.overallStatus === 'error'
                    ? 'error'
                    : failedTestCount > 0
                      ? `${failedTestCount} fail`
                      : evaluation.overallStatus}
              </span>
            )}
          </button>
        </div>

        <div className="dark-scrollbar relative flex-1 overflow-y-auto p-3">
          {consoleTab === 'tests' && (
            <div className="space-y-2 font-mono text-[12px] text-slate-300">
              <div className="text-[10px] tracking-wider text-slate-500 uppercase">
                Bài này có {testCaseCount} test case{testCaseCount !== 1 ? 's' : ''} ở panel
                &quot;Yêu cầu đề bài&quot; — bấm{' '}
                <strong className="text-white">Run AI Review</strong> để chấm.
              </div>
            </div>
          )}

          {consoleTab === 'result' &&
            (isRunning ? (
              <div className="flex flex-col items-center gap-3 py-8 font-mono text-[12px]">
                <div className="text-primary flex items-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin" />
                  <span>AI đang phân tích & mô phỏng test cases...</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Quá trình này thường mất 4–10 giây.
                </div>
              </div>
            ) : errorMessage ? (
              <div className="rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-[12px] text-rose-200">
                <div className="mb-1 flex items-center gap-2 font-bold">
                  <i className="fa-solid fa-triangle-exclamation" /> Không gọi được AI
                </div>
                <div className="text-rose-200/80">{errorMessage}</div>
              </div>
            ) : evaluation ? (
              <ResultPanel evaluation={evaluation} />
            ) : (
              <div className="flex items-center gap-2 py-2 font-mono text-[12px] text-slate-500">
                <i className="fa-solid fa-circle-info" /> Bấm <strong>Run AI Review</strong> để xem
                kết quả AI chấm code.
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
